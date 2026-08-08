# Cloudinary Migration Plan

> **Status as of 2026-08-08: Phases 1 and 2 are complete and live** — `POST /api/media` uploads straight to Cloudinary via an in-memory buffer (no more `multer.diskStorage`), and `GET /api/media/proxy` was added (not in the original phase plan below) to make Cloudinary's `raw`-type delivery behave like a normal in-app preview/download. Phase 3 (migrating the ~31 pre-existing local files) remains explicitly skipped, as decided below. Phases 4-5 (cleanup, verification checklist) were not formally executed as written, but their intent is largely covered elsewhere: `ARCHITECTURE_AND_HANDOVER.md` and `CLAUDE.md` were updated to describe the current Cloudinary-backed implementation, and the local `UPLOAD_DIR`/static-serving code was deliberately **kept**, not removed, specifically so the un-migrated Phase-3 files keep resolving — removing it would break them.
>
> **One new problem was discovered post-migration, not anticipated by this plan**: Cloudinary has an account-level "Restricted media types" security setting that, when the "Allow delivery of PDF and ZIP files" toggle is off, blocks unauthenticated delivery of `raw`-type resources (`401`, `X-Cld-Error: deny or ACL failure`) — this affects every `raw` upload (PDFs/Word docs) made through this app, not just ones with a particular filename. Full diagnostic writeup, and the two ways to fix it (toggle the Cloudinary setting, or move to signed/authenticated delivery), are in `ARCHITECTURE_AND_HANDOVER.md` §18.2. **This is unresolved** — whoever has access to the Cloudinary account for this project should check that setting.
>
> A related, now-resolved false lead from the same investigation: an earlier version of `routes/media.ts` embedded the file's extension into the Cloudinary `public_id` for raw uploads (e.g. `.../abc123.pdf`) as a workaround for Cloudinary not inferring a Content-Type on raw resources. That embedding was removed — it doesn't cause the 401 above (confirmed by testing: renaming an already-blocked asset to drop the extension did not fix it), but it was an unnecessary practice worth dropping anyway since the `/media/proxy` route already reconstructs the correct filename/extension via `Content-Disposition` on the way out.

---

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
