# Cloudinary Migration Plan

Goal: move all **image** and **document** (PDF/Word) uploads off local disk
(`UPLOAD_DIR` / `backend/src/uploads`) onto Cloudinary, since Render's
filesystem is ephemeral and wipes uploads on every redeploy/restart.

Video is out of scope — the app never uploads video; radio/video content uses
external YouTube links already.

Constraints (do not violate):
- Keep PostgreSQL + Prisma exactly as-is. No provider change.
- Do not upgrade Prisma, react-scripts, or TypeScript. Do not run `npm audit fix`.
- Cloudinary credentials are env vars only — never hardcoded or committed.
- One phase at a time. Stop after each phase for confirmation before continuing.

## Inventory (from Phase 0 audit)

Single upload endpoint: `POST /api/media` (`backend/src/routes/media.ts`),
using `multer.diskStorage` from `backend/src/middleware/upload.ts`. Every
frontend upload widget (`ImageUpload.tsx`, `FileUpload.tsx`, `AudioUpload.tsx`)
calls this same endpoint and stores whatever `url` string comes back into
the parent entity's own field — there is no per-entity upload route.

31 files (~7.0MB) already exist under `backend/src/uploads/` and are committed
to git. These are referenced by real rows in the database today and must be
migrated (re-uploaded to Cloudinary, URLs updated in the DB), not just
switched over for future uploads.

## Phases

- **Phase 0 — Audit** (this phase): confirm the current implementation,
  inventory every DB field that stores an upload URL, flag open questions.
- **Phase 1 — Cloudinary setup**: add `cloudinary` package, env vars
  (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`),
  a small config/client module. No route changes yet.
- **Phase 2 — Swap upload middleware**: replace `multer.diskStorage` with
  in-memory storage + a Cloudinary upload call in `routes/media.ts`. PDFs/Word
  docs go up as `resource_type: raw`, images as `resource_type: image`.
- **Phase 3 — SKIPPED per explicit user decision**: the 31 existing files
  under `backend/src/uploads/` will *not* be migrated to Cloudinary. Their DB
  rows keep pointing at the old local `/uploads/...` URL, which will stop
  resolving once the app runs on a host with an ephemeral filesystem (Render)
  or once `middleware/upload.ts` stops writing there. Only uploads made
  *after* the Phase 2 cutover are covered.
- **Phase 4 — Cleanup**: remove the local upload directory from git tracking,
  remove now-unused `UPLOAD_DIR`/`uploadPath` static-serving code, update
  `.env.example` files, update `ARCHITECTURE_AND_HANDOVER.md`/`CLAUDE.md`
  references to local disk storage.
- **Phase 5 — Verification checklist**: upload an image, upload a PDF, confirm
  existing (migrated) media still renders, confirm a fresh Render deploy
  doesn't lose anything.

## DB fields that store upload URLs (from `schema.prisma`)

| Model | Field(s) |
|---|---|
| Media | `url` (the canonical library entry) |
| Activity | `image`, `images[]` |
| Report | `fileUrl` |
| Newsletter | `fileUrl` |
| TeamMember | `image` |
| Project | `image`, `images[]` |
| Hub | `image` |
| HubPhoto | `imageUrl` |
| Publication | `fileUrl`, `image` |
| PressStatement | `fileUrl` |
| RadioSpot | `image`, `audioUrl` |
| SiteSettings | `logo`, `favicon` |
| Partner | `logo` |
| Donor | `logo` |
| Resource | `fileUrl`, `thumbnail` |
| Brochure | `fileUrl`, `thumbnail` |
| Testimonial | `photo` |
| ProgramContent | `heroImage` |

## Decisions

- **Audio (MP3)**: confirmed in scope. Uploaded MP3s (radio spots) move to
  Cloudinary alongside images and documents, using `resource_type: "video"`
  (Cloudinary's category for all non-image binary/audio/video assets accessed
  via its media pipeline — this is how Cloudinary classifies audio).
