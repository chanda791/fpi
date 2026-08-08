# CLAUDE.md

Terse orientation notes for AI coding assistants working in this repo. For the full picture, read `ARCHITECTURE_AND_HANDOVER.md` — this file is a fast-start summary and a list of things that will bite you if you don't know them going in, not a replacement for it.

## What this is

FPI Zambia's public website + CMS. Two independent apps in one repo:
- `fpi/` (repo root) — React + TypeScript frontend, Create React App, Tailwind.
- `fpi/backend/` — Express + TypeScript API, Prisma ORM, PostgreSQL (hosted on Neon).

They only talk to each other over HTTP (`REACT_APP_API_URL` → `/api/*`). No shared code, no monorepo tooling, two separate `node_modules`.

## Before you start

- Run frontend from `fpi/` (`npm start`), backend from `fpi/backend/` (`npm run dev`), or both via the root `package.json`'s `backend:dev` proxy script. Don't assume one `npm install` covers both — they're separate.
- The database is a real, shared, live Neon Postgres instance — there is no separate local/dev database by default. **Treat every `prisma db push`/`migrate` as touching production data.** Ask before running one, even for an "obviously safe" additive column. See "Database changes" below.
- `tsc` does not work as configured in this repo. `tsconfig.json` sets `moduleResolution: "bundler"`, which requires TypeScript 5+, but the installed `typescript` is `4.9.5`. Running `npx tsc --noEmit -p .` fails at config-parsing, before checking any file — and the error message references `tsconfig.json`, not a source file, so a filename-scoped grep on the output finds nothing and looks clean when it isn't. **If you need to actually type-check**, write a temporary sibling tsconfig with `moduleResolution: "node"`, run `tsc` against that, then delete it — don't trust a bare `npx tsc` in this repo, and don't "fix" the real `tsconfig.json` as a side effect of unrelated work without calling it out.

## Database changes

- Schema lives in `backend/prisma/schema.prisma`. This project's migration history is inconsistent — some changes were applied via `prisma migrate dev` (tracked in `backend/prisma/migrations/`), others via `prisma db push` (untracked, causes drift). Running `prisma migrate dev` on a schema with untracked drift will offer to **reset the database** — never accept that. Use `prisma db push` instead when drift is already present (check with a dry run / read the error first).
- Prisma Client regeneration (`prisma generate`, which `db push`/`migrate dev` both run automatically) can fail on Windows with `EPERM ... query_engine-windows.dll.node` if a dev server (`ts-node-dev`) is still holding the file open. This is usually **harmless** — the generated JS/TS client (which is what actually matters for new fields to be usable) updates fine; only the native binary rename fails. Verify with a quick throwaway script that queries the new field before assuming the migration didn't take.
- Always confirm with the user before pushing a schema change to the live DB, even a small additive one. This has been the working pattern all along — don't skip it because a change "looks safe."

## Media / uploads

- All uploads (images, PDFs, docs, audio) go through `POST /api/media`, straight to **Cloudinary** — not local disk. `multer` is only used to parse the multipart request into an in-memory buffer.
- PDFs/docs upload as Cloudinary `resource_type: "raw"`. Raw delivery always forces `Content-Disposition: attachment` and can't be told to render inline via URL params — that's why `GET /api/media/proxy` exists (backend re-streams the file with headers it controls). Frontend code should link to `getPreviewUrl()`/`getDownloadUrl()` (`src/services/config.ts`), **never** a raw Cloudinary URL directly, for anything meant to preview inline or download with a clean filename.
- **Known unresolved issue**: Cloudinary has an account-level "Allow delivery of PDF and ZIP files" security setting. If it's off, `raw` resource delivery 401s account-wide (confirmed via testing — not extension- or filename-related, despite that being the first plausible-looking hypothesis). If someone reports "PDF preview/download is broken," check this Cloudinary Console setting before assuming it's a code bug. Full writeup in `ARCHITECTURE_AND_HANDOVER.md` §18.2.
- Don't re-embed the file extension into a raw upload's Cloudinary `public_id`. An earlier version of the code did this (as a workaround for Cloudinary not inferring Content-Type on raw uploads) and it actively made the delivery-restriction problem above worse. The backend proxy already reconstructs the correct filename/extension on the way out.

## Conventions worth matching

- Backend routes are almost all "inline Prisma in the route handler" — no repository/service layer for ~26 of 27 resources (the one exception, `homepage.ts`, goes through a controller/service). Match the existing style for a new resource rather than introducing a new layered pattern; there are dead orphaned controller/service files from a previous attempt at this (`backend/src/controllers/*`, most of `backend/src/services/*`) — don't resurrect that pattern without finishing the migration everywhere.
- Auth: one blanket gate (`app.use("/api", requireAuthForMutations)` in `server.ts`) protects mutations on everything mounted after it. A new "public read, authenticated write" resource just needs to be mounted after that line — no per-route auth middleware needed. A new *public-write* resource (like a contact form) needs to be mounted *before* the gate and bring its own rate limiter.
- Frontend: two coexisting data-fetching patterns — a typed `*Service` layer (`src/services/*.ts`, wraps `api.ts`) and raw `fetch(API_BASE_URL + ...)` calls directly in page components. Admin CRUD pages lean on the service layer; public pages lean on raw fetch. Match whichever pattern the file you're editing already uses rather than introducing a third way.
- Admin list/create/edit pages follow a consistent trio pattern per resource (`Reports.tsx` + `CreateReport.tsx` + `EditReport.tsx`, etc.) — when adding a new admin-manageable resource, this is the template to copy, including the shared form components under `src/components/admin/document/` (for the five "document" content types: Reports, Publications, Newsletters, Press Statements — `DocumentForm` takes `showImage`/`showDate` props to opt individual resources into a cover image / backdatable publish date) and `src/components/admin/project/` (`ProjectGalleryPicker` specifically is generic enough to reuse for any "array of image URLs" field — it's already reused by `ProgramsAdmin.tsx` for per-section galleries, not just Projects).
- `published: true` is the default on nearly every content model — public list endpoints return **everything**, published or not, and rely on the frontend to filter. This is a known gap, not a pattern to copy into new code if you can help it — prefer filtering server-side (`where: { published: true }`) for any new public-facing query.

## Don't

- Don't assume `git status`/`npm test` catches type errors — see the `tsc` note above.
- Don't touch `.env`/`backend/.env` file contents in a way that would leak them into a commit, output, or artifact.
- Don't run destructive Prisma commands (`migrate reset`, `db push --force-reset`) — ever — without explicit, scoped user confirmation for that exact command.
