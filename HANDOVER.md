# FPI Zambia Website & CMS — Handover Checklist

A short, action-oriented checklist for whoever is taking over hosting/operating this project — a new developer, an agency, or FPI Zambia's own IT staff. For *why* any of this is true, see `ARCHITECTURE_AND_HANDOVER.md` (the long-form technical deep-dive) — this document just tells you what to do and in what order. Last reviewed 2026-08-08.

## 1. What you're taking over

Two independently-deployed apps:
- **Frontend** (`fpi/`) — a React/TypeScript single-page app (Create React App), static-hosted.
- **Backend** (`fpi/backend/`) — a Node/Express/TypeScript API, needs a long-running server host (not serverless-function-only, since it holds a persistent Prisma connection pool).

Plus two managed third-party services this project already depends on and you'll need your own credentials/access for:
- **Neon** — hosted PostgreSQL (the actual database).
- **Cloudinary** — media hosting for every image, PDF, and audio file uploaded through the CMS.

Nothing else is required to run this — no Redis, no message queue, no separate object-storage bucket (Cloudinary covers that), no CDN you have to configure yourself beyond what your static host provides.

## 2. Before you touch anything — get access to these first

- [ ] Neon project access (or the raw `DATABASE_URL` connection string) — this is the single source of truth for all content.
- [ ] Cloudinary account access (or `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`) — without these, uploads fail outright (the backend logs a warning at startup if any are missing).
- [ ] Whatever host is currently running the backend (Render/Railway/Fly.io/a VPS/etc.) — you need this to rotate secrets and redeploy.
- [ ] Whatever host is currently serving the frontend build (Vercel/Netlify/etc.).
- [ ] The current `ADMIN_EMAIL`/`ADMIN_PASSWORD` bootstrap credentials, or an existing named admin account in the CMS (`Admin → Users`) — you need to log in at all before you can do anything else.
- [ ] The current `JWT_SECRET` value, **or** be prepared to rotate it (rotating it immediately logs out every currently-signed-in user — fine for a handover, just know it'll happen).

## 3. Rotate these before (or immediately after) taking over — do not skip

Credentials that existed before the handover should be treated as compromised the moment ownership changes hands, regardless of how much you trust the previous operator:

- [ ] `ADMIN_PASSWORD` (backend env var) — the bootstrap superuser account's password.
- [ ] `JWT_SECRET` (backend env var) — rotating this invalidates every outstanding login token instantly; do it during a maintenance window if you want to avoid surprising active admin users.
- [ ] `DATABASE_URL` credentials, if Neon lets you rotate the password without changing the connection string shape — check the Neon dashboard.
- [ ] Cloudinary API key/secret, via the Cloudinary Console (Settings → Security → API Keys — you can generate a new key/secret pair and revoke the old one).
- [ ] Any named `User` accounts (`Admin → Users`) that shouldn't have continued access — deactivate or delete them rather than leaving them active "just in case."

**After rotating `JWT_SECRET` or `ADMIN_PASSWORD`, every admin user (including you) needs to log in again.** This is expected, not a bug.

## 4. Environment variables you must set correctly

See `ARCHITECTURE_AND_HANDOVER.md` §8 for the full table (every variable, what breaks if it's missing, whether it's safe to expose). The short version — get these right before the first real deploy:

**Backend** (`backend/.env` locally; real environment variables, not a committed file, in production):
```
DATABASE_URL=...              # Neon connection string
JWT_SECRET=...                 # long random value — never leave this on the hardcoded fallback
ADMIN_EMAIL=...
ADMIN_PASSWORD=...             # strong, unique — never reuse a dev/demo password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CORS_ORIGIN=https://your-real-frontend-domain.com   # comma-separated if more than one
APP_BASE_URL=https://your-real-backend-domain.com
APP_PUBLIC_URL=https://your-real-frontend-domain.com
```

**Frontend** (`fpi/.env`, or set at build time on your static host):
```
REACT_APP_API_URL=https://your-real-backend-domain.com/api
```
This one is **baked into the JS bundle at build time** (Create React App inlines it) — changing it later requires a full rebuild, not just a redeploy of the same files.

**A misconfigured `CORS_ORIGIN` is the #1 "site is completely broken" cause after a redeploy.** If unset, the API rejects every browser request (fails closed — this is deliberate and correct behavior, but it means the whole site goes dark, not "mostly works").

## 5. Cloudinary — one setting you need to check manually

Under Cloudinary Console → **Settings → Security**, confirm **"Allow delivery of PDF and ZIP files"** is turned **on**. If it's off, PDF/Word document uploads (reports, publications, press statements, newsletters, brochures) will upload successfully but then fail to preview or download with a `401`/`502` error — this is an account-level Cloudinary restriction, not a bug in this app's code. See `ARCHITECTURE_AND_HANDOVER.md` §18.2 for the full diagnostic writeup if you hit this.

## 6. Database

- [ ] Run `npx prisma migrate deploy` from `backend/` against the target `DATABASE_URL` before the backend's first boot on a new database. This applies all migrations in `backend/prisma/migrations/` in order; it does **not** prompt or modify migration history, so it's safe for automated deploys.
- [ ] Run `npx prisma generate` (usually automatic via `npm install`'s postinstall hook — verify it actually ran if the app throws Prisma-client-shape errors on boot).
- [ ] **Back up the Neon database on a schedule.** Nothing in this codebase does this for you — check whether Neon's own backup/point-in-time-recovery features are enabled on the project's plan, and don't assume they are by default.
- [ ] Whoever owns billing for Neon should know the project may auto-suspend its compute after a period of inactivity (a Neon platform behavior) — the first request after a suspension has a one-time latency spike while it wakes up. This is normal, not an outage.

## 7. First boot on a brand-new environment (skip if you're just taking over an existing live site)

1. `npx prisma migrate deploy` (creates all tables).
2. Start the backend; log in once with `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
3. Create a `Province` row for each of Lusaka, Southern, Eastern, Copperbelt (`Admin → Provinces`) if you want to use the one-off hub-seeding endpoint.
4. Optionally call `POST /api/seed/hubs` (authenticated, e.g. via curl/Postman with a bearer token — there is no button for this in the UI) to populate 9 default MIL hubs.
5. Configure SMTP under `Admin → Settings` — until this is set, "Forgot password" emails don't actually send; the reset link only appears in the server's console logs. See `PASSWORD_RECOVERY.md`.
6. Create real, named accounts under `Admin → Users`. Stop using the `ADMIN_EMAIL`/`ADMIN_PASSWORD` bootstrap account for day-to-day work afterward — treat it as a break-glass account only.

## 8. Known gaps to be aware of (not fixed, not blocking, but you should know)

These are real, currently-true limitations — not hypothetical risks. Full detail in `ARCHITECTURE_AND_HANDOVER.md` §16 and §18:

- **No rate limiting on authenticated write endpoints.** Login, password reset, and public form submissions are throttled; ordinary authenticated CRUD (creating/editing content) is not. A compromised admin token could be used to hammer the API without any backend-side limit.
- **Public list endpoints return unpublished content.** Draft/unpublished rows are filtered out client-side, not server-side — anyone calling the API directly (or opening browser devtools) can see draft content that was never meant to be public. Low severity for an NGO content site, but real.
- **No automated tests.** Changes should be manually verified against the running app before shipping — there's no CI test suite to catch regressions.
- **Hand-rolled auth (JWT + password hashing), not a vetted library.** Functionally sound (HMAC-SHA256 with constant-time comparison, PBKDF2 with a reasonable iteration count) but carries more audit burden than `jsonwebtoken`/`bcrypt` would.
- **No `helmet`** — no baseline security headers (`X-Content-Type-Options`, HSTS, etc.) are set. Cheap to add, not currently installed.
- **Cascading deletes aren't guarded.** Deleting a Province with Hubs, a Hub with Photos/Events, or a Media Library item still referenced elsewhere, fails ungracefully (a generic error, or in the Media case, a silently broken image link elsewhere on the site) rather than a clear "delete its children first" message.

## 9. Who to talk to about content, not code

This document and `ARCHITECTURE_AND_HANDOVER.md` cover the technical handover. For questions about what content should say, branding, or organizational decisions, that's a Free Press Initiative Zambia staff question, not a codebase question — don't guess.
