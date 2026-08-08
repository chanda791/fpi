# FPI Zambia Website & CMS — Architecture and Developer Handover

This document is a complete architectural review of the repository as it actually exists on disk (originally audited 2026-07-19, **updated 2026-08-08** to reflect the Cloudinary migration and a round of feature work — see §18 "August 2026 Update Log" for a summary of everything that changed and why the two dates matter). It is written for a senior developer who has never seen this codebase before and needs to become fully productive without live guidance. Every claim below is based on reading the actual source files listed — no feature is described unless it is implemented.

Three shorter documents exist alongside this one and remain useful:
- `CLAUDE.md` — terse architecture notes aimed at AI coding assistants (also auto-loaded by Claude Code as project instructions).
- `HANDOVER.md` — a security/ops-focused pre-launch checklist for whoever hosts the site.
- `PASSWORD_RECOVERY.md` — a focused explainer of the SMTP-based "forgot password" flow.

This document supersedes none of them; it is the long-form version that explains *why* the codebase looks the way it does, file by file. If anything in this document conflicts with the actual source (schema, routes, components), **trust the source** — this file is a snapshot, not a build artifact.

---

## 1. Project Overview

### 1.1 Purpose

The repository implements the public website and content-management system (CMS) for **Free Press Initiative Zambia (FPI Zambia)**, an NGO working on media freedom, media & information literacy (MIL), journalism capacity-building, advocacy, and research in Zambia. The site has two audiences:

1. **Public visitors** — browse programs, activities, projects, team, publications, press statements, newsletters, reports, MIL hubs (by province), radio spots, partners, donors, and submit contact/newsletter-subscription/testimonial forms.
2. **Staff/administrators** — log into a CMS (`/admin/*`) to create, edit, publish, and delete every piece of content shown on the public site, manage media uploads, configure site-wide settings (including SMTP), and manage other admin/editor user accounts.

### 1.2 Technologies used

| Layer | Technology | Version (from package.json) |
|---|---|---|
| Frontend framework | React | 19.2.7 |
| Frontend language | TypeScript | 4.9.5 |
| Frontend tooling | Create React App (`react-scripts`) | 5.0.1 |
| Routing | React Router | 7.16.0 |
| Styling | Tailwind CSS + PostCSS/Autoprefixer | 3.4.17 |
| Animation | Framer Motion | 12.40.0 |
| Carousels | Swiper | 12.2.0 |
| Icons | lucide-react, react-icons | 1.18.0 / 5.6.0 |
| Counters | react-countup | 6.5.3 |
| Backend framework | Express | 5.0.0 |
| Backend language | TypeScript | 5.9.0 |
| Backend dev runner | ts-node-dev | 2.0.0 |
| ORM | Prisma (`@prisma/client` + `prisma` CLI) | 6.19.3 |
| Database | PostgreSQL, hosted on **Neon** (serverless Postgres) | — |
| File uploads | Multer (**in-memory buffer**, not disk) + Cloudinary SDK — see §3.9 | multer 2.2.0 / cloudinary 2.10.0 |
| Media hosting/CDN | **Cloudinary** (images, PDFs/docs as `raw`, audio/video as `video` resource type) | 2.10.0 |
| Env loading | `dotenv` (backend) — used directly by `prisma.config.ts`; `backend/src/loadEnv.ts` is a separate hand-rolled loader used by the app itself (both exist, see §3.1) | 17.4.2 |
| Email | Nodemailer | 9.0.3 |
| Rate limiting | express-rate-limit | 8.6.0 |
| CORS | cors | 2.8.5 |
| Auth | Hand-rolled JWT + PBKDF2 (Node `crypto` — no external auth library) | — |

### 1.3 Frontend architecture (summary)

The frontend is a single Create React App project rooted at the repository root (`fpi/`, i.e. the folder containing `package.json`, `src/`, `public/`). It is a classic client-rendered SPA:

- One `BrowserRouter` (`src/App.tsx`) declares **all routes flat** — no nested route trees, no route-based code splitting.
- Public pages fetch data by calling the backend REST API, either directly via `fetch()` against `API_BASE_URL` or through a typed service layer (`src/services/*.ts`). Both patterns coexist (see §10 and §16).
- Admin (CMS) pages live under `/admin/*`, are wrapped individually in `<ProtectedRoute>`, and almost always go through the `src/services/*.ts` service layer, which itself wraps `src/services/api.ts`.
- Authentication state is a JWT stored in `localStorage` or `sessionStorage` (never both), decoded client-side to check expiry.
- Tailwind CSS handles all styling; there is no CSS-in-JS or component library (buttons, inputs, tables etc. are hand-built under `src/components/admin`).

### 1.4 Backend architecture (summary)

The backend is an independent Node/Express application in `backend/`, with its own `package.json`, its own `node_modules`, and its own TypeScript config:

- `backend/src/server.ts` is the single entry point: it builds the Express app, wires CORS, JSON parsing, ~26 route modules (mounted at `/api/<resource>`), static file serving for uploads, and a global 4-arg error handler.
- Almost every route module (`backend/src/routes/*.ts`) talks to PostgreSQL **directly via the Prisma client**, inline in the route handler — there is no repository/DAO abstraction for most resources. A small, inconsistent "layered" style (router → controller → service → Prisma) exists only for the homepage-sections resource (see §3.2 and §16).
- Auth is enforced by a single global middleware, `requireAuthForMutations`, mounted after the public-writable routes and before all the admin-facing ones — every subsequent route's write verbs require a valid bearer JWT.
- Prisma (`backend/prisma/schema.prisma`) defines 25 models mapped 1:1 onto PostgreSQL tables of the same name, all created through 16 sequential migrations.

### 1.5 How all components communicate

```
┌────────────────────────┐        HTTPS / JSON (REACT_APP_API_URL)        ┌──────────────────────────┐
│   React SPA (browser)  │ ───────────────────────────────────────────▶  │  Express API (Node)       │
│   fpi/ (CRA build)     │ ◀───────────────────────────────────────────  │  backend/ (backend/dist)  │
└────────────────────────┘              fetch()/api.ts, bearer JWT       └───────────┬───────────────┘
                                                                                       │ Prisma Client
                                                                                       ▼
                                                                          ┌──────────────────────────┐
                                                                          │ PostgreSQL (Neon,         │
                                                                          │ pooled connection, SSL)   │
                                                                          └──────────────────────────┘
```

The two apps are **deployed independently** and know nothing about each other's internals — the only contract between them is the JSON REST API under `/api/*` and the static `/uploads/*` file server. The frontend is configured with the backend's base URL via `REACT_APP_API_URL` (baked into the static build at build time, since CRA inlines `process.env.REACT_APP_*` values). There is no server-side rendering, no GraphQL, no websockets, and no shared code/package between the two apps (duplicated type definitions and even a duplicated `BaseService` class exist independently on each side — see §16).

---

## 2. Complete Project Structure

The repository root (`Final-project/`) contains only the `fpi/` project folder plus normal OS/user-profile noise (not part of the project). Everything below is rooted at `fpi/`.

### 2.1 Frontend tree (`fpi/`)

```
fpi/
├── .env                          # local dev env (gitignored by nothing explicit at root, but holds only a public value)
├── .env.example                  # template: REACT_APP_API_URL
├── CLAUDE.md                     # architecture notes for AI coding assistants
├── HANDOVER.md                   # ops/security pre-launch checklist
├── README.md                     # setup & run instructions
├── package.json                  # frontend deps + npm scripts (also proxies backend:* scripts)
├── package-lock.json
├── postcss.config.js             # Tailwind + Autoprefixer plugin wiring
├── tailwind.config.js            # Tailwind theme extensions (fadeIn/slideUp keyframes)
├── tsconfig.json                 # CRA TypeScript config
├── vercel.json                   # SPA rewrite rule for Vercel hosting
├── structure.txt                 # stale, auto-generated tree snapshot (not authoritative)
├── build/                        # production build output of `npm run build` (generated, not hand-edited)
├── public/                       # CRA public assets copied verbatim into build/
│   ├── index.html                # HTML shell CRA injects the bundle into
│   ├── manifest.json, robots.txt, logo.png
│   ├── documents/                # static PDFs served as-is (e.g. brochures bundled at build time)
│   └── images/                   # static hero/background images referenced by absolute /images/... paths
└── src/
    ├── index.tsx                 # React entry point; installs the global fetch interceptor, mounts <App/>
    ├── index.css / App.css       # global styles + Tailwind directives
    ├── App.tsx                   # ALL route declarations, admin-chrome toggling, maintenance gate wiring
    ├── App.test.tsx              # single CRA smoke test (react-scripts test / Jest)
    ├── setupTests.ts             # jest-dom setup required by CRA's test runner
    ├── react-app-env.d.ts        # CRA-generated ambient types
    ├── reportWebVitals.ts        # optional CRA perf-metrics hook (not wired to any analytics)
    ├── logo.png / logo.svg       # CRA boilerplate assets, largely unused
    │
    ├── components/
    │   ├── BackButton.tsx        # shared "go back" control; used on detail pages (uses useGoBack hook)
    │   ├── Lightbox.tsx          # image lightbox/gallery viewer; used by ActivityDetail, ProjectDetail,
    │   │                         #   and (added August 2026) ProgramSections.tsx's section-gallery modal
    │   ├── DocumentPreviewModal.tsx  # ADDED August 2026 — shared PDF/doc preview modal (open in place vs.
    │   │                         #   force-download); resolves Cloudinary raw-file URLs through the
    │   │                         #   /media/proxy endpoint (getPreviewUrl/getDownloadUrl in services/config.ts).
    │   │                         #   Used by every knowledge-centre page (Reports, Publications, Newsletters,
    │   │                         #   Press Statements, Brochure) and ProgramSections.tsx
    │   ├── MaintenanceGate.tsx   # fetches /settings, blocks the public site when maintenanceMode=true
    │   ├── ScrollToTop.tsx       # resets scroll position on route change; mounted once in App.tsx
    │   ├── layout/
    │   │   ├── Navbar.tsx        # public-site navigation bar (mega-menu dropdowns, mobile drawer, search)
    │   │   └── Footer.tsx        # public-site footer (newsletter signup, social links, sitemap)
    │   ├── programs/
    │   │   └── ProgramSections.tsx  # renders the dynamic `sections` JSON blocks for a ProgramContent page;
    │   │                            #   as of August 2026 each section can carry a gallery of extra images
    │   │                            #   (opens in Lightbox) in addition to its single cover `image`
    │   └── admin/                # CMS-only shared UI kit (all hand-built, no external component library)
    │       ├── AdminLayout.tsx, Sidebar.tsx, Header.tsx      # CMS shell: sidebar nav + top bar wrapping every /admin page
    │       ├── ProtectedRoute.tsx                            # redirects to /admin/login if isAuthenticated() is false
    │       ├── PageHeader.tsx, PageCard.tsx                  # layout chrome reused by every list/create/edit page
    │       ├── Input.tsx, TextArea.tsx, Select.tsx, Toggle.tsx  # form primitives
    │       ├── ImageUpload.tsx, FileUpload.tsx, AudioUpload.tsx # upload widgets; POST multipart to /api/media directly (not via mediaService)
    │       ├── PrimaryButton.tsx, SecondaryButton.tsx        # button primitives
    │       ├── Badge.tsx, EmptyState.tsx, Loading.tsx, StatCard.tsx  # small presentational widgets
    │       ├── index.ts                                      # barrel re-export of the above (only partially used — many pages import files directly)
    │       ├── common/
    │       │   ├── DataTable.tsx     # generic typed table (columns + render fn) used by every admin list page
    │       │   └── SearchBar.tsx     # controlled search input used above every DataTable
    │       ├── activity/    ActivityForm.tsx, ActivityGalleryPicker.tsx, CategorySelect.tsx, ProgramSelect.tsx, ProvinceSelect.tsx, PublishSwitch.tsx
    │       ├── project/     ProjectForm.tsx, ProjectGalleryPicker.tsx, ProjectImagePicker.tsx, ProjectCategorySelect.tsx, ProjectStatusSelect.tsx, PublishSwitch.tsx
    │       │                #   ProjectGalleryPicker is reused as-is (with configurable label/help text,
    │       │                #   added August 2026) by ProgramsAdmin.tsx for per-section image galleries
    │       ├── team/        CategorySelect.tsx, PublishSwitch.tsx, ResponsibilitiesEditor.tsx, TeamImagePicker.tsx
    │       ├── document/    DocumentForm.tsx, DocumentUpload.tsx, DocumentCategorySelect.tsx, PublishSwitch.tsx  (shared by Reports/Publications/PressStatements/Newsletters forms;
    │       │                #   gained optional showImage/showDate props in August 2026 for Reports' cover image and Newsletters' backdatable publishDate)
    │       ├── homepage/    HomepageEditor.tsx, CTAEditor.tsx, FeaturedProjectsEditor.tsx, GalleryEditor.tsx, LatestActivitiesEditor.tsx, QuickAccessEditor.tsx, StatisticsEditor.tsx
    │       ├── radio/       RadioSpotForm.tsx
    │       ├── dashboard/   (dashboard widgets used by pages/admin/Dashboard.tsx)
    │       └── layout/      (duplicate/legacy home for some admin chrome pieces)
    │
    ├── constants/
    │   └── homepage.ts       # EMPTY placeholder ("intentionally empty... not currently imported anywhere") — dead file, kept per an internal note referencing a nonexistent PROJECT_AUDIT.md
    │
    ├── data/
    │   └── radioSpots.ts     # static hardcoded array of YouTube-embed radio spot metadata, used as a fallback/seed list by pages/mil/RadioSpots.tsx alongside live API data
    │
    ├── hooks/
    │   ├── useGoBack.ts        # navigate(-1) with a fallback route if there's no real browser history
    │   └── useScrollReveal.ts  # EMPTY placeholder — dead file; Home.tsx defines its own local useScrollReveal instead of importing this
    │
    ├── pages/                  # mirrors the public site's information architecture 1:1 with routes in App.tsx
    │   ├── Home.tsx                       # "/" — hero, stats, latest activities, CTA, gallery (fetches /activities directly)
    │   ├── Activities.tsx                 # "/activities" — public activities grid (fetches /activities directly)
    │   ├── ActivityDetail.tsx             # "/activities/:id" — single activity + gallery + lightbox
    │   ├── about/AboutUs.tsx              # "/about"
    │   ├── team/Team.tsx                  # "/team"
    │   ├── contact/Contact.tsx            # "/contact" — submits the public contact form
    │   ├── resources/Resources.tsx        # "/resources"
    │   ├── partners/Partners.tsx          # "/partners"
    │   ├── donors/Donors.tsx              # "/donors"
    │   ├── sponsors/Sponsors.tsx          # "/sponsors" (static/legacy page)
    │   ├── programs/{Programs,Advocacy,MediaLiteracy,Research,CapacityBuilding}.tsx  # "/programs" + 4 sub-program pages, driven by ProgramContent
    │   ├── knowledge/{Newsletters,Reports,Publications,PressStatements}.tsx          # "/knowledge/*" document listing pages
    │   ├── mil/{AboutMIL,Brochure,RadioSpots}.tsx                                    # "/mil/*"
    │   ├── mil/Hubs.tsx, mil/Hubs/{AllHubs,ProvinceHubs,HubDetail}.tsx               # "/mil/hubs*", "/mil/province/:province", "/mil/hub/:slug"
    │   ├── Projects/{FlagshipProjectList,ProjectDetail,SheRise,ClaimYourSpace,Funsani,ConflictSensitiveJournalism}.tsx  # "/projects/*" (last four are hardcoded flagship-project microsites)
    │   └── admin/                          # CMS pages — one folder mirroring every content type, "List / Create<X> / Edit<X>" convention
    │       ├── Login.tsx, ForgotPassword.tsx, ResetPassword.tsx        # unauthenticated auth pages
    │       ├── Dashboard.tsx                                            # "/admin" landing page (stat cards)
    │       ├── Homepage.tsx                                             # "/admin/homepage" — homepage JSON section editor
    │       ├── {Activities,CreateActivity,EditActivity}.tsx
    │       ├── {Projects,CreateProject,EditProject}.tsx
    │       ├── {Report as Reports,CreateReport,EditReport}.tsx
    │       ├── {Publications,CreatePublication,EditPublication}.tsx
    │       ├── {Newsletters,CreateNewsletter,EditNewsletter}.tsx
    │       ├── {PressStatements,CreatePressStatement,EditPressStatement}.tsx
    │       ├── {RadioSpots,CreateRadioSpot,EditRadioSpot}.tsx
    │       ├── {Hubs,CreateHub,EditHub}.tsx, Provinces.tsx
    │       ├── HubEvents.tsx, HubPhotos.tsx   # ADDED August 2026 — HubEvent/HubPhoto had DB models + routes
    │       │                                  #   since June but no admin UI at all until this; standalone
    │       │                                  #   list+inline-form pages (not nested inside EditHub), matching
    │       │                                  #   the BrochuresAdmin.tsx pattern
    │       ├── {TeamMembers,CreateTeam,EditTeam}.tsx
    │       ├── media/{MediaLibrary,UploadMedia,EditMedia,MediaPicker}.tsx
    │       ├── Settings.tsx, Users.tsx
    │       ├── PartnersAdmin.tsx, DonorsAdmin.tsx, TestimonialsAdmin.tsx, SubscribersAdmin.tsx, ContactMessagesAdmin.tsx, ResourcesAdmin.tsx, BrochuresAdmin.tsx, ProgramsAdmin.tsx
    │
    ├── services/                # frontend API client layer (25 files as of August 2026)
    │   ├── config.ts             # API_BASE_URL/API_ORIGIN derivation, getAssetUrl(), getPreviewUrl()/
    │   │                         #   getDownloadUrl() (ADDED August 2026 — route Cloudinary raw-file URLs
    │   │                         #   through /media/proxy, see §3.9), installApiFetchInterceptor()
    │   ├── api.ts                 # low-level fetch wrapper: api.get/post/put/patch/delete, attaches bearer token, 401 handling
    │   ├── auth.ts                # login/logout/forgotPassword/resetPassword/changePassword + isAuthenticated()
    │   ├── BaseService.ts         # generic CRUD class extended by most resource services
    │   ├── activityService.ts, projectService.ts, teamService.ts, hubService.ts, mediaService.ts,
    │   │   newsletterService.ts, pressStatementService.ts, publicationService.ts, radioSpotService.ts,
    │   │   reportService.ts, provinceService.ts                       # thin BaseService<T> subclasses/instances
    │   ├── hubEventService.ts, hubPhotoService.ts   # ADDED August 2026 — thin object-literal services (not
    │   │                         #   BaseService subclasses) matching /api/hub-events, /api/hub-photos
    │   ├── homepageService.ts     # BaseService subclass + getSection/updateSection helpers
    │   ├── brochureService.ts, contactService.ts, donorService.ts, partnerService.ts,
    │   │   programContentService.ts, resourceService.ts, settingsService.ts, subscriberService.ts,
    │   │   testimonialService.ts, userService.ts                      # bespoke object-literal services (call api.* directly, not BaseService)
    │
    ├── types/                    # frontend-only TS interfaces (separate from, and not shared with, backend/src/types)
    │   ├── activity.ts, project.ts, team.ts, homepage.ts, media.ts, pressStatement.ts, publication.ts
    │   └── home.ts                # EMPTY placeholder, dead file (same pattern as constants/homepage.ts)
    │
    └── utils/
        ├── formatDate.ts          # Intl.DateTimeFormat wrapper (en-GB, long month)
        └── formatSize.ts          # bytes → "B/KB/MB/GB" for the Media Library UI
```

### 2.2 Backend tree (`fpi/backend/`)

```
backend/
├── .env                          # real local secrets (DATABASE_URL, JWT_SECRET, ADMIN_*) — gitignored
├── .env.example                  # template committed to git
├── .gitignore                    # ignores node_modules, .env, /src/generated/prisma
├── backend-structure.txt         # stale, auto-generated tree snapshot (not authoritative)
├── package.json                  # backend deps + dev/build/start scripts
├── package-lock.json
├── prisma.config.ts              # Prisma 6 config file (schema path, migrations path, datasource URL)
├── tsconfig.json                 # compiles src/ → dist/, target ES2020, strict mode on
├── prisma/
│   ├── schema.prisma              # single source of truth for all 25 models (see §5)
│   └── migrations/                # 16 timestamped migration folders + migration_lock.toml (provider lock: postgresql)
│       ├── 20260604154840_init/migration.sql
│       ├── 20260604222911_activity_upgrade/migration.sql
│       ├── 20260606062939_add_team_members/migration.sql
│       ├── 20260608115135_add_projects/migration.sql
│       ├── 20260608145255_add_hubs_system/migration.sql
│       ├── 20260622064146_add_media_library/migration.sql
│       ├── 20260622151540_update_team_member/migration.sql
│       ├── 20260625114134_add_publication/migration.sql
│       ├── 20260625124240_add_homepage_sections/migration.sql
│       ├── 20260629131223_add_radio_spots/migration.sql
│       ├── 20260708133308_add_featured_and_user/migration.sql
│       ├── 20260712190000_recreate_homepage_sections/migration.sql
│       ├── 20260712191500_add_settings_and_password_reset/migration.sql
│       ├── 20260712220000_add_media_folder_dimensions/migration.sql
│       ├── 20260712223000_add_activity_gallery_images/migration.sql
│       ├── 20260713000000_add_project_gallery_images/migration.sql
│       ├── 20260713150000_add_partners_donors_resources_brochures/migration.sql
│       ├── 20260713200000_add_testimonials_subscribers_contact/migration.sql
│       ├── 20260715000000_add_publication_image/migration.sql
│       └── 20260715010000_add_program_content/migration.sql
└── src/
    ├── server.ts                  # app bootstrap: CORS, JSON body parsing, route mounting order, static /uploads, global error handler, app.listen
    ├── loadEnv.ts                 # hand-rolled .env parser, imported first (`import "./loadEnv"`) in server.ts, before any other module reads process.env
    ├── lib/
    │   ├── prisma.ts              # `export const prisma = new PrismaClient()` — the single shared Prisma client instance
    │   └── cloudinary.ts          # ADDED August 2026 — configured Cloudinary v2 client (reads CLOUDINARY_*
    │                              #   env vars, warns to console if any are missing); imported by routes/media.ts
    ├── middleware/
    │   ├── auth.ts                 # requireAuth, requireAuthForMutations, requireAdmin + AuthPayload/req.authUser typing
    │   ├── upload.ts               # multer **memory-storage** config (changed August 2026, was disk storage):
    │   │                            #   mimetype allowlist, 20MB limit; legacy uploadPath still resolved for old files
    │   └── rateLimit.ts            # loginRateLimit, passwordResetRateLimit, publicWriteRateLimit (express-rate-limit instances)
    ├── utils/
    │   ├── auth.ts                 # hashPassword/verifyPassword (PBKDF2-SHA512) + signToken/verifyToken (hand-rolled HMAC-SHA256 JWT)
    │   └── mailer.ts               # sendMail() — reads SMTP config from the SiteSettings DB row at call time; logs to console if unconfigured
    ├── routes/                     # 28 files; ~26 are mounted in server.ts (see §3.2/§4). One Express Router per resource.
    │   ├── auth.ts, contact.ts, subscribers.ts, testimonials.ts        # mounted before the auth gate (partly/fully public)
    │   ├── team.ts, activities.ts, projects.ts, reports.ts, hubs.ts, provinces.ts, seed.ts,
    │   │   media.ts, newsletters.ts, homepage.ts, radioSpots.ts, publications.ts, pressStatements.ts,
    │   │   hubPhotos.ts, hubEvents.ts, settings.ts, users.ts, partners.ts, donors.ts, resources.ts,
    │   │   brochures.ts, programs.ts                                    # mounted after the auth gate (public GET, authenticated writes)
    ├── controllers/                # ONLY homepage.controller.ts is actually wired to a route; the rest are dead code (see §3.2, §16)
    │   ├── homepage.controller.ts       # used by routes/homepage.ts
    │   ├── newsletters.controller.ts    # NOT imported by routes/newsletters.ts (which is inline) — dead code
    │   ├── publications.controller.ts   # NOT imported by routes/publications.ts — dead code
    │   ├── radioSpots.controller.ts     # NOT imported by routes/radioSpots.ts — dead code
    │   └── reports.controller.ts        # NOT imported by routes/reports.ts — dead code
    ├── services/                   # backend-side service layer; only homepage.service.ts is reachable via a route
    │   ├── BaseService.ts                # generic Prisma CRUD class — imported by nothing (dead code; distinct from the frontend file of the same name)
    │   ├── homepage.service.ts           # used by controllers/homepage.controller.ts (the one live layered path)
    │   ├── newsletter.service.ts, pressStatement.service.ts, publication.service.ts, radioSpots.service.ts, report.service.ts   # each only used by its matching dead controller — dead code
    │   └── publicationService.ts         # EMPTY FILE (0 bytes) — leftover/duplicate of publication.service.ts
    ├── types/
    │   ├── activity.ts             # Activity interface — not obviously imported by any route (routes use `any`/inline destructuring)
    │   └── publication.ts          # Publication interface — imported only by services/publicationService.ts (the empty-adjacent, effectively-dead pairing above)
    ├── data/                       # empty directory, no files
    └── uploads/                    # multer's disk-storage destination (UPLOAD_DIR default); contains real uploaded images/PDFs from local development
        ├── documents/, images/     # empty subfolders (present, unused by current multer config, which writes flat into uploads/)
        └── <timestamp>-<random>.<ext>  # actual uploaded files, named by middleware/upload.ts's filename() function
```

**Legend for "optional vs required"**: every file under `src/` in both apps is required for the app to build/run as-is, *except*: `constants/homepage.ts`, `hooks/useScrollReveal.ts`, `types/home.ts` (frontend dead files), and `backend/src/controllers/{newsletters,publications,radioSpots,reports}.controller.ts` + their matching `services/*.service.ts` + `backend/src/services/BaseService.ts` + `backend/src/services/publicationService.ts` + `backend/src/types/*.ts` (backend dead code). Deleting any of these has zero effect on runtime behavior; they are flagged, not deleted, in §16.

---

## 3. Backend Architecture

### 3.1 Express server startup

Entry point: `backend/src/server.ts`, run via `npm run dev` (ts-node-dev, hot-reloading) or `npm run build && npm start` (compiled `dist/server.js`) — both invoked from `backend/`, or from the frontend root via the proxy scripts `npm run backend:dev` / `backend:build` / `backend:start` in the root `package.json`.

Startup sequence, in file order:

1. `import "./loadEnv"` — **must be the first import**. `loadEnv.ts` manually reads `backend/.env` (relative to `process.cwd()`) and copies any key not already present in `process.env` into `process.env`, skipping blank lines/comments and stripping surrounding quotes. This is a hand-rolled substitute for the `dotenv` package (no `dotenv` dependency exists in `backend/package.json`, though `prisma.config.ts` does use `dotenv/config` separately for the Prisma CLI's own process).
2. Express app created; `app.set("trust proxy", 1)` — trusts exactly one reverse-proxy hop so `express-rate-limit` and `req.ip` see the real client IP on hosts like Render/Railway/Fly.io that sit behind a single proxy.
3. CORS configured from `CORS_ORIGIN` (comma-separated list, trimmed, empty entries filtered out). The origin callback allows any request with **no** `Origin` header (server-to-server calls, curl, Postman) and only allows browser cross-origin requests whose `Origin` exactly matches an entry in the allowlist; if `CORS_ORIGIN` is unset, the allowlist is empty and all browser cross-origin requests are rejected (fails closed, not open — see §16 for the historical risk this replaced).
4. `express.json()` — parses JSON request bodies for every route (no size limit override, so it uses Express's default).
5. Routes are mounted (see §3.2 for the exact order — it is load-bearing).
6. `GET /` health check returns the plain-text string `"FPI Zambia API Running"`.
7. The global error-handling middleware is registered **last** (Express identifies it as an error handler purely because it declares 4 parameters: `(err, req, res, next)`).
8. `app.listen(PORT)` — `PORT` defaults to `5000` if unset.

### 3.2 Route registration & middleware execution order

This is the most architecturally significant part of the backend. The mounting order in `server.ts` directly determines which routes are public and which require authentication — there is no per-route `requireAuth` call on most resources; instead, a single blanket gate is positioned partway through the mount list.

```
app.use(cors(...))
app.use(express.json())
app.use("/api/auth", authRoutes)                       ← always public (has its own internal rate limits)

app.use("/api/contact", contactRoutes)                  ┐
app.use("/api/subscribers", subscribersRoutes)          │  public-writable: mounted BEFORE the gate so
app.use("/api/testimonials", testimonialsRoutes)        ┘  anonymous visitors can POST to these 3 resources

app.use("/api", requireAuthForMutations)                ← GATE: everything mounted below this line has its
                                                            non-GET/HEAD/OPTIONS verbs rejected with 401
                                                            unless a valid bearer JWT is presented

app.use("/api/team", ...)             app.use("/api/media", ...)          app.use("/api/settings", ...)
app.use("/api/activities", ...)       app.use("/api/newsletters", ...)    app.use("/api/users", ...)          ← also requireAdmin per-route
app.use("/api/projects", ...)         app.use("/api/homepage", ...)       app.use("/api/partners", ...)
app.use("/api/reports", ...)          app.use("/api/radio-spots", ...)    app.use("/api/donors", ...)
app.use("/api/hubs", ...)             app.use("/api/publications", ...)   app.use("/api/resources", ...)
app.use("/api/provinces", ...)        app.use("/api/press-statements",...) app.use("/api/brochures", ...)
app.use("/api/seed", ...)             app.use("/api/hub-photos", ...)     app.use("/api/program-content", ...)
app.use("/uploads", express.static(uploadPath))          ← static file server, no auth at all
                                       app.use("/api/hub-events", ...)

app.get("/", healthCheck)
app.use(globalErrorHandler)                              ← 4-arg, must stay last
```

Consequences a developer must internalize before adding a new resource:
- **A new "public read, authenticated write" resource** (the vast majority of content types) must be mounted *after* the `requireAuthForMutations` line. This is the default pattern — just add another `app.use("/api/<resource>", newRoutes)` anywhere in that block.
- **A new "public write" resource** (like a second public form) must be mounted *before* the gate, alongside `contact`/`subscribers`/`testimonials`, and should get its own `publicWriteRateLimit` inside its route file (see `routes/contact.ts`, `routes/subscribers.ts`, `routes/testimonials.ts` for the pattern — each also individually wraps its own admin-only GET/PUT/DELETE handlers with `requireAuth` since the blanket gate doesn't cover them).
- **A resource needing admin-only (not just any-authenticated-user) access**, like `routes/users.ts`, wraps every handler individually with `requireAdmin` from `middleware/auth.ts` (checks `role === "admin" || role === "superadmin"`) *in addition to* whatever the blanket gate already does for mutations — `requireAdmin` also independently re-validates the token, so it works correctly even on GET routes the blanket gate wouldn't have touched.

**Two coexisting route implementation styles** (see §16 for why this matters):
- **Inline** (used by ~26 of 27 mounted resource routers): the `Router()` calls `prisma.<model>.findMany/findUnique/create/update/delete` directly inside each handler, with manual `try/catch` → `console.error` → `res.status(500).json({ message })`.
- **Layered** (used only by `routes/homepage.ts`): `router.get("/", getHomepage)` → `controllers/homepage.controller.ts` → `services/homepage.service.ts` → `prisma`. The four other controller/service pairs that exist in the codebase (`newsletters`, `publications`, `radioSpots`, `reports`) were built in this style but their matching route files were never switched over to use them — those route files still call `prisma` inline, making the controllers and services orphaned.

### 3.3 Controllers

Only `backend/src/controllers/homepage.controller.ts` is live. It exports three handlers (`getHomepage`, `getHomepageSection`, `updateHomepageSection`), each a thin wrapper: extract params from `req`, call the matching `homepageService` method, `res.json()` the result or `500` on throw. The other four controller files (`newsletters`, `publications`, `radioSpots`, `reports`) follow the identical shape but are not imported by any route file — see §16.

### 3.4 Services

Only `backend/src/services/homepage.service.ts` is live, called exclusively by `homepage.controller.ts`. It wraps `prisma.homepageSection` (accessed via `(prisma as any).homepageSection` — the `as any` cast exists because at some point the generated Prisma client's typing for this model needed bypassing, likely during a schema migration window) with `getAll`, `getSection`, `create`, `update` (an `upsert` keyed by `section`), and `remove`. The other service files (`newsletter.service.ts`, `pressStatement.service.ts`, `publication.service.ts`, `radioSpots.service.ts`, `report.service.ts`, `BaseService.ts`, and the empty `publicationService.ts`) are dead code, reachable only from the dead controllers above.

### 3.5 Utilities

- `backend/src/utils/auth.ts` — see §9 for full detail. Implements password hashing (PBKDF2-HMAC-SHA512, 120,000 iterations, random 16-byte salt, stored as `pbkdf2$<salt>$<hash>`) and a complete hand-rolled JWT: base64url helpers, HMAC-SHA256 signing (`signToken`), constant-time signature verification + expiry check (`verifyToken`). No third-party JWT or bcrypt/argon2 library is used anywhere in the backend.
- `backend/src/utils/mailer.ts` — `sendMail()` reads SMTP host/port/user/password/from-fields from the **first row of the `SiteSettings` table** (not from environment variables) on every call. If SMTP isn't configured, it logs the would-be email to the server console and returns `{ sent: false }` instead of throwing — callers (password reset, contact form, subscriber broadcast) all handle this gracefully rather than failing the request.

### 3.6 Validation

There is **no schema-validation library** (no Zod/Joi/express-validator) anywhere in the backend. Validation is ad hoc and inconsistent per route:
- Some routes hand-check required fields and return `400` (e.g. `auth.ts` checks `email`/`password` presence; `contact.ts` checks `name`/`email`/`message`; `users.ts` checks password length ≥ 8; `subscribers.ts` checks `email`).
- Most CRUD routes (activities, projects, reports, hubs, etc.) perform **no validation at all** — they pass `req.body` straight to `prisma.<model>.create/update`, relying entirely on Prisma/PostgreSQL to reject bad types (e.g. a non-numeric `participants` would produce a Prisma runtime error, caught by the route's generic `catch` block and turned into a generic 500).
- Numeric IDs from route params are coerced with `Number(req.params.id)` without checking for `NaN` before querying — Prisma will simply fail to find a match (or, for `NaN`, throw, again caught by the generic `catch`).

### 3.7 Error handling

Two layers:
1. **Per-route `try/catch`**: virtually every handler wraps its logic in `try { ... } catch (error) { console.error(error); res.status(500).json({ message: "Failed to ..." }) }`. This means most application errors surface to the client as a generic 500 with a resource-specific message, and the real error/stack trace only exists in server logs (`console.error`).
2. **Global error handler** (`server.ts`, last middleware, 4-arg signature): catches anything thrown/passed to `next(err)` that per-route handlers didn't catch themselves — in practice this is almost exclusively **multer errors**, since `upload.single("file")` in `routes/media.ts` runs as Express middleware *before* the route's own `try/catch` block, so file-related errors (`MulterError` for oversized files/unexpected fields, or the custom `Error("UNSUPPORTED_FILE_TYPE")` thrown by the multer `fileFilter`) bypass the route handler entirely and land here. The global handler translates these into user-facing `400` messages; anything else falls through to a generic `500 "Something went wrong. Please try again."`.

### 3.8 Authentication

Covered in full in §9. Summary: custom JWT bearer tokens, `Authorization: Bearer <token>` header, three middleware functions (`requireAuth`, `requireAuthForMutations`, `requireAdmin`) in `middleware/auth.ts`.

### 3.9 File uploads (Cloudinary — migrated since the July audit)

**This section describes the current implementation. An earlier version of this document (and the file-tree comments in some older commits) described local-disk storage via `multer.diskStorage` — that is no longer accurate.** The migration is tracked in `backend/CLOUDINARY_MIGRATION.md`.

`middleware/upload.ts` configures a single shared Multer instance, but Multer's only job now is to parse the multipart request and hold the file **in memory** — it never touches disk:
- **Storage**: `multer.memoryStorage()`. `uploadPath` (from `UPLOAD_DIR`, default `backend/src/uploads`) is still computed and still statically served (see below) purely so files uploaded *before* the Cloudinary cutover keep resolving — nothing writes new files there anymore.
- **File filter (allowlist)**: unchanged — `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (docx), `audio/mpeg`/`audio/mp3`, `video/mp4`. **SVG is still deliberately excluded** (stored-XSS risk — SVG can carry an embedded `<script>`).
- **Limit**: 20 MB per file (`limits.fileSize`).

`routes/media.ts` (`POST /api/media`) is the only route that runs `upload.single("file")`, then:
1. Picks a Cloudinary `resource_type` from the mimetype: `image/*` → `"image"`, `audio/*` or `video/*` → `"video"` (Cloudinary's catch-all category for non-image binary media — this is how MP3 radio-spot audio is classified), everything else (PDF, Word) → `"raw"`.
2. Streams the in-memory buffer to Cloudinary via `cloudinary.uploader.upload_stream({ folder: "fpi-zambia", resource_type })` (`backend/src/lib/cloudinary.ts` holds the configured client, reading `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`).
3. **Raw uploads deliberately do *not* embed the file extension in the Cloudinary `public_id`** (e.g. `fpi-zambia/1786172601848-425951427`, not `...425951427.pdf`). An earlier version of this code did embed the extension (to work around Cloudinary raw delivery not inferring a Content-Type) — that was found to actively break downloads, see §17.2.
4. Creates a `Media` row: `filename` = Cloudinary `public_id`, `originalName` = the uploaded file's original name, `url` = Cloudinary's `secure_url`, plus `mimeType`/`size`/`alt`/`description`.

**Legacy static serving**: `app.use("/uploads", express.static(uploadPath))` is still mounted (unauthenticated, same as before) purely to keep pre-migration `Media.url` values resolving. Nothing new is ever written there.

**Serving files back out — the `/media/proxy` route**: Cloudinary's `raw` delivery type always sends `Content-Disposition: attachment` and ignores on-the-fly transform params (`fl_attachment` 404s on raw), so the app cannot get Cloudinary to (a) render a PDF inline in an `<iframe>` preview, or (b) set a clean download filename, by editing the Cloudinary URL alone. `GET /api/media/proxy?url=<cloudinary-url>&mode=inline|attachment&filename=<name>` (also in `routes/media.ts`) solves this by having the **backend** fetch the Cloudinary URL server-side and re-stream it to the browser with headers it controls itself:
- Validates the `url` param is `https://res.cloudinary.com/<our cloud name>/...` before fetching anything (prevents this endpoint being used as an open proxy for arbitrary URLs — it has no auth requirement of its own).
- Sets `Content-Type` from Cloudinary's response header (or `application/pdf` as a fallback for `mode=inline` when Cloudinary reports `application/octet-stream`, which happens for legacy assets with no extension in their `public_id`).
- Sets `Content-Disposition: inline` or `attachment` with a sanitized `filename` built from the `filename` query param.
- `src/services/config.ts`'s `getPreviewUrl()`/`getDownloadUrl()` helpers build URLs to this proxy automatically (only for `res.cloudinary.com/` URLs — local `/uploads/...` legacy URLs and plain images pass through unproxied) and are what every document preview modal / download button in the frontend actually links to, not the raw Cloudinary URL. See `src/components/DocumentPreviewModal.tsx`.
- **Known limitation, not yet worked around in code**: this proxy still ultimately fetches from Cloudinary, so it inherits whatever Cloudinary's own delivery restrictions allow — see §17.2 for a real account-level restriction that can make this return `502` for legitimate files.

### 3.10 Complete request lifecycle

Example: an admin editing an Activity's title (`PUT /api/activities/42`) from `EditActivity.tsx`.

```
1. Browser: activityService.update(42, {title: "New title", ...}) 
   → api.put("/activities/42", data)
   → fetch(`${API_BASE_URL}/activities/42`, { method: "PUT", headers: {Content-Type, Authorization: Bearer <jwt>}, body: JSON.stringify(data) })
        (installApiFetchInterceptor() in services/config.ts ALSO intercepts this window.fetch call,
         independently re-attaching the Authorization header — belt-and-suspenders, see §16)

2. Network: HTTPS request hits the Express process at PORT (5000 locally / host-assigned in prod)

3. Express middleware chain, in registration order:
   a. cors()                       → validates Origin header against CORS_ORIGIN allowlist
   b. express.json()               → parses the JSON body into req.body
   c. (routes mounted before /api/activities are skipped — path doesn't match)
   d. app.use("/api", requireAuthForMutations)
        → method is PUT (not GET/HEAD/OPTIONS) → calls requireAuth
        → reads "authorization" header, strips "Bearer " prefix
        → verifyToken(token): recomputes HMAC-SHA256 over header.body using JWT_SECRET,
          compares with crypto.timingSafeEqual, checks payload.exp > now
        → on success: req.authUser = { id, email, role }; next()
        → on failure: 401 {"message": "Authentication required"} — request stops here
   e. app.use("/api/activities", activitiesRoute) → matches, enters routes/activities.ts

4. routes/activities.ts: router.put("/:id", handler)
   → destructures title/description/... from req.body
   → prisma.activity.update({ where: { id: Number(req.params.id) }, data: { ...} })

5. Prisma Client
   → generates parameterized SQL UPDATE for the "Activity" table
   → opens/reuses a connection from its internal pool to the DATABASE_URL target

6. Neon (PostgreSQL, pooled endpoint, TLS)
   → executes the UPDATE, returns the updated row

7. Prisma Client → resolves the update() promise with the typed Activity object

8. routes/activities.ts → res.json(activity)   (default status 200)

9. Browser: services/api.ts's request() helper
   → checks response.status !== 401 → not expired
   → response.ok → response.json() → resolves the promise activityService.update() returned

10. EditActivity.tsx's submit handler → shows a success alert, navigate("/admin/activities")
```

If step 3d fails (missing/expired/invalid token), the browser receives a `401`; both `services/api.ts` and the `installApiFetchInterceptor` in `services/config.ts` react to a 401 by clearing `localStorage`/`sessionStorage` auth keys and hard-redirecting to `/admin/login?expired=1`.

---

## 4. API Documentation

Base URL: `{API_BASE_URL}` = `REACT_APP_API_URL` (default `http://localhost:5000/api`). All endpoints below are relative to this base. "Auth" column: **Public** = no token needed; **Auth (any)** = valid bearer JWT required (any role); **Admin** = `requireAdmin` (role `admin`/`superadmin` only).

Unless noted, all list endpoints return `200` with a JSON array; single-item GET returns `200` with the object or `404 {"message": "... not found"}`; POST returns `201` with the created object; PUT returns `200` with the updated object; DELETE returns `200 {"message": "... deleted successfully"}`. Any unhandled error returns `500 {"message": "Failed to ..."}`. These are **not** documented per-row below unless a route deviates from this default.

### 4.1 Auth — `/api/auth` (always public; mounted first, no blanket gate)

| Method | URL | Purpose | Body | Response | Notes / rate limit |
|---|---|---|---|---|---|
| POST | `/auth/login` | Sign in | `{email, password}` | `200 {token, user:{email,fullName,role}}` / `401` | 10 req / 15 min per IP. Checks `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars first (bootstrap superuser, `id:"env-admin"`), then falls back to the `User` table (`verifyPassword` against `active` users only) |
| POST | `/auth/forgot-password` | Request password reset | `{email}` | `200` generic message always (never reveals whether the email exists) | 5 req / hour. Creates a `PasswordResetToken` (32-byte hex, 1h TTL) and emails a reset link via `sendMail()`; if SMTP isn't configured, the link is only written to server console logs |
| POST | `/auth/reset-password` | Complete a reset | `{token, password}` | `200` / `400` if token invalid/expired/used, password < 8 chars | 5 req / hour. Wraps the user password update + token `usedAt` stamp in `prisma.$transaction` |
| PUT | `/auth/change-password` | Change own password while logged in | `{currentPassword, newPassword}` | `200` / `400` / `401` | Auth (any). Rejects the `env-admin` bootstrap account (must rotate via `ADMIN_PASSWORD` env var instead) |

**DB tables**: `User`, `PasswordResetToken`. **Frontend caller**: `src/services/auth.ts` → `pages/admin/{Login,ForgotPassword,ResetPassword,Settings}.tsx` (change-password lives inside Settings).

### 4.2 Public-writable resources (mounted before the gate)

| Resource | Method | URL | Auth | Purpose | Body / Params | DB table |
|---|---|---|---|---|---|---|
| Contact | GET | `/contact` | Auth (any) | List messages (admin inbox) | — | `ContactMessage` |
| Contact | POST | `/contact` | Public (20/hr) | Submit contact form | `{name, email, subject?, message}` | `ContactMessage` (+ emails org's `SiteSettings.email` if set) |
| Contact | PUT | `/contact/:id` | Auth (any) | Mark read/unread | `{read: boolean}` | `ContactMessage` |
| Contact | DELETE | `/contact/:id` | Auth (any) | Delete a message | — | `ContactMessage` |
| Subscribers | GET | `/subscribers` | Auth (any) | List subscribers | — | `Subscriber` |
| Subscribers | POST | `/subscribers` | Public (20/hr) | Newsletter signup | `{email, name?}` | `Subscriber` (idempotent: existing email returns 200 "already subscribed") |
| Subscribers | DELETE | `/subscribers/:id` | Auth (any) | Unsubscribe/remove | — | `Subscriber` |
| Subscribers | POST | `/subscribers/broadcast` | Auth (any) | Email all active subscribers | `{subject, message}` | reads `Subscriber` (active=true), sends via `sendMail()` per row |
| Testimonials | GET | `/testimonials` or `/testimonials?all=true` | Public (approved only) / Auth (any) for `?all=true` | List testimonials | query `all` | `Testimonial` |
| Testimonials | POST | `/testimonials` | Public (20/hr) | Submit testimonial | `{name, role?, message, photo?, rating?}` | `Testimonial` (`approved:false` by default) |
| Testimonials | PUT | `/testimonials/:id` | Auth (any) | Approve/edit | any field incl. `approved` | `Testimonial` |
| Testimonials | DELETE | `/testimonials/:id` | Auth (any) | Delete | — | `Testimonial` |

**Frontend caller**: `contactService.ts` → `pages/contact/Contact.tsx` (submit) + `pages/admin/ContactMessagesAdmin.tsx`; `subscriberService.ts` → footer signup form in `components/layout/Footer.tsx` + `pages/admin/SubscribersAdmin.tsx`; `testimonialService.ts` → wherever testimonials are displayed publicly + `pages/admin/TestimonialsAdmin.tsx`.

### 4.3 Standard CRUD content resources (mounted after the gate: public GET, authenticated writes)

All of the following share the exact same shape: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`, all inline-Prisma, all backed by one model of the same name (see §5 for fields). Differences are noted in the "Notes" column.

| Resource | Base URL | Model | Frontend service | Admin pages | Notes |
|---|---|---|---|---|---|
| Activities | `/activities` | `Activity` | `activityService` (BaseService) | `Activities`, `CreateActivity`, `EditActivity` | `date` coerced to `Date`; `images` coerced to array or `[]` |
| Projects | `/projects` | `Project` | `projectService` (BaseService) | `Projects`, `CreateProject`, `EditProject` | `startDate`/`endDate` optional, empty string → `null` on update |
| Reports | `/reports` | `Report` | `reportService` (BaseService) | `Report` (list), `CreateReport`, `EditReport` | — |
| Newsletters | `/newsletters` | `Newsletter` | `newsletterService` (BaseService) | `Newsletters`, `CreateNewsletter`, `EditNewsletter` | Only `title`+`fileUrl` accepted on create |
| Publications | `/publications` | `Publication` | `publicationService` (BaseService) | `Publications`, `CreatePublication`, `EditPublication` | — |
| Press Statements | `/press-statements` | `PressStatement` | `pressStatementService` (BaseService) | `PressStatements`, `CreatePressStatement`, `EditPressStatement` | — |
| Radio Spots | `/radio-spots` | `RadioSpot` | `radioSpotService` (BaseService) | `RadioSpots`, `CreateRadioSpot`, `EditRadioSpot` | `broadcastAt` coerced to `Date`; list ordered by `broadcastAt desc` |
| Team members | `/team` | `TeamMember` | `teamService` (BaseService) | `TeamMembers`, `CreateTeam`, `EditTeam` | List ordered by `displayOrder asc` |
| Provinces | `/provinces` | `Province` | `provinceService` (BaseService) | `Provinces` | Includes nested `hubs` on both list & single-item GET |
| Hubs | `/hubs` | `Hub` | `hubService` (BaseService) | `Hubs`, `CreateHub`, `EditHub` | `GET /hubs/:id` accepts **either a numeric id or a slug** (`isNumeric` branch); includes `province`, `photos`, `events` |
| Hub Photos | `/hub-photos` | `HubPhoto` | `hubPhotoService` (plain object) | **`HubPhotos.tsx`** (standalone list+inline-form page, added August 2026 — the route existed since June with no frontend caller at all until this) | Only `GET /`, `POST /`, `DELETE /:id` — no update endpoint. Rendered as a Swiper slideshow (not a static grid) on the public hub detail page |
| Hub Events | `/hub-events` | `HubEvent` | `hubEventService` (plain object) | **`HubEvents.tsx`** (standalone list+inline-form page, added August 2026 — same "route with no frontend" gap as HubPhoto until this) | Full CRUD (no delete-by-hub cascade route; relies on FK). `eventType` field (added August 2026) drives real "Training Sessions"/"Community Events" counts on the public MIL Hubs stats, replacing hardcoded placeholder numbers |
| Media | `/media` | `Media` | `mediaService` (BaseService) | `MediaLibrary`, `UploadMedia`, `EditMedia` | `POST /` is `multipart/form-data` via `upload.single("file")`, not JSON — see §4.5 |
| Partners | `/partners` | `Partner` | `partnerService` (plain object) | `PartnersAdmin` | Ordered by `displayOrder asc, createdAt desc` |
| Donors | `/donors` | `Donor` | `donorService` (plain object) | `DonorsAdmin` | Same ordering pattern |
| Resources | `/resources` | `Resource` | `resourceService` (plain object) | `ResourcesAdmin` | Same ordering pattern |
| Brochures | `/brochures` | `Brochure` | `brochureService` (plain object) | `BrochuresAdmin` | Same ordering pattern |
| Users | `/users` | `User` | `userService` (plain object) | `Users` | **Admin only** (`requireAdmin` on every verb, including GET). See §4.4 |

### 4.4 Users — `/api/users` (Admin only on every verb)

| Method | URL | Purpose | Body | Response |
|---|---|---|---|---|
| GET | `/users` | List all admin/editor accounts | — | `200` array of `{id, fullName, email, role, active, createdAt, updatedAt}` (password never included) |
| POST | `/users` | Create a new CMS user | `{fullName, email, password, role?}` | `201` safe user / `400` (missing fields, password < 8) / `409` (email exists) |
| PUT | `/users/:id` | Update name/role/active flag | `{fullName?, role?, active?}` | `200` safe user |
| POST | `/users/:id/reset-password` | Admin resets another user's password | `{password}` | `200 {message}` / `400` if < 8 chars |
| DELETE | `/users/:id` | Delete a user | — | `200` / `400` if deleting your own logged-in account |

**DB table**: `User`. **Frontend**: `userService.ts` → `pages/admin/Users.tsx`.

### 4.5 Media upload — `POST /api/media` (Cloudinary-backed)

- **Method/URL**: `POST /api/media`
- **Auth**: Auth (any) — behind the blanket gate.
- **Content-Type**: `multipart/form-data` (the one exception to the app's JSON convention).
- **Body fields**: `file` (binary, required — field name matches `upload.single("file")`), `originalName?`, `alt?`, `description?` (all optional text fields alongside the file).
- **What happens**: Multer validates mimetype/size and holds the file in memory (no disk write); the route uploads the buffer to Cloudinary (`folder: "fpi-zambia"`, `resource_type` chosen from the mimetype — see §3.9), then creates a `Media` row with `filename` (Cloudinary `public_id`), `originalName`, `url` (Cloudinary's `secure_url`), `mimeType`, `size`.
- **Response**: `201` with the created `Media` object (including `url`, which every other admin form then stores as its own `image`/`fileUrl`/`audioUrl` string field — usually run through `getAssetUrl()`/`getPreviewUrl()`/`getDownloadUrl()` in `src/services/config.ts` before being used, see §3.9).
- **Status codes**: `400` if no file attached or mimetype/size rejected (surfaces via the global error handler for multer-level failures); `500` on DB or Cloudinary failure.
- **DB table**: `Media`.
- **Frontend callers**: `components/admin/ImageUpload.tsx`, `FileUpload.tsx`, `AudioUpload.tsx` — all three call `fetch(`${API_BASE_URL}/media`, ...)` **directly**, not through `mediaService.ts` (which exists only for list/get/update/delete of already-uploaded media in the Media Library pages).

### 4.5a Media proxy — `GET /api/media/proxy` (Cloudinary raw-file passthrough)

- **Method/URL**: `GET /api/media/proxy?url=<cloudinary-secure-url>&mode=inline|attachment&filename=<name>`
- **Auth**: none (this route has no auth requirement of its own — it's read-only and only proxies our own Cloudinary assets, see below).
- **What happens**: server-side `fetch()` of the given Cloudinary URL, re-streamed to the client with a `Content-Type`/`Content-Disposition` the backend controls. Exists because Cloudinary's `raw` delivery type (used for PDFs/Word docs) always forces `Content-Disposition: attachment` and can't be told to render inline or use a clean filename via URL params alone (see §3.9 for the full rationale).
- **Validation**: rejects (`400`) any `url` that isn't `https://res.cloudinary.com/<CLOUDINARY_CLOUD_NAME>/...` — this is a deliberate allowlist so the endpoint can't be abused as a general-purpose URL proxy.
- **Response**: the file bytes, streamed, with `mode=inline` → `Content-Disposition: inline` (used for in-app document preview modals) or `mode=attachment` (default) → `Content-Disposition: attachment; filename="<sanitized name>.<ext>"` (used for the "Download" button — this is also why downloads get a proper filename instead of Chrome's `Unconfirmed 12345.crdownload`, which is what raw `<a download>` produces for cross-origin URLs).
- **Status codes**: `400` invalid/disallowed URL; `502` if the upstream Cloudinary fetch itself fails or is rejected (see §17.2 for a real-world cause of this).
- **Frontend callers**: `src/services/config.ts`'s `getPreviewUrl()`/`getDownloadUrl()` — used by `DocumentPreviewModal.tsx` and every "download this document" button across the knowledge-centre pages (Reports, Publications, Newsletters, Press Statements, Brochure).

### 4.6 Homepage sections — `/api/homepage` (the one "layered" resource)

| Method | URL | Purpose | Body | Response |
|---|---|---|---|---|
| GET | `/homepage` | List all homepage sections | — | `200` array of `HomepageSection` |
| GET | `/homepage/:section` | Get one section by key (e.g. `hero`, `stats`, `cta`) | — | `200` section or `null` |
| PUT | `/homepage/:section` | Upsert a section's JSON `data` | arbitrary JSON matching that section's shape | `200` upserted `HomepageSection` |

**DB table**: `HomepageSection` (`section` is `@unique`; `data` is a free-form `Json` column — its shape is defined only by convention between `components/admin/homepage/*Editor.tsx` and whatever public component renders it, not by the schema). **Frontend**: `homepageService.ts` → `pages/admin/Homepage.tsx` (writes) / `pages/Home.tsx` (reads some sections; Home.tsx also independently fetches `/activities` directly for its "latest activities" block rather than reading it from a homepage section).

### 4.7 Program content — `/api/program-content`

| Method | URL | Purpose | Body | Response |
|---|---|---|---|---|
| GET | `/program-content` | List all program pages | — | `200` array |
| GET | `/program-content/:slug` | Get one page by slug; **auto-creates** a default row from a hardcoded `DEFAULTS` map (`advocacy`, `media-literacy`, `research`, `capacity-building`) if missing, so public program pages never 404 | — | `200` |
| PUT | `/program-content/:slug` | Upsert page content | `{title?, subtitle?, heroImage?, intro?, sections?, published?}` | `200` |

**DB table**: `ProgramContent`. **Frontend**: `programContentService.ts` → `pages/programs/{Advocacy,MediaLiteracy,Research,CapacityBuilding}.tsx` (read) / `pages/admin/ProgramsAdmin.tsx` (write).

### 4.8 Settings — `/api/settings` (singleton)

| Method | URL | Purpose | Body | Response |
|---|---|---|---|---|
| GET | `/settings` | Get the single `SiteSettings` row (creates a default row on first call if none exists) | — | `200` — `smtpPassword` is **redacted** to `""` with a companion `smtpPasswordSet: boolean` flag so the real secret never round-trips to the browser |
| PUT | `/settings` | Update settings | any subset of `SiteSettings` fields | `200` (redacted) — a **blank** `smtpPassword` in the request body is ignored (does not overwrite the stored one), only a truthy value replaces it |

**DB table**: `SiteSettings`. **Frontend**: `settingsService.ts` → `pages/admin/Settings.tsx` (org info, social links, SEO, maintenance-mode toggle, SMTP). Also read anonymously by `components/MaintenanceGate.tsx` (raw `fetch`, not via the service) to check `maintenanceMode` on every non-admin page load.

### 4.9 Seed — `/api/seed`

| Method | URL | Purpose | Body | Response |
|---|---|---|---|---|
| POST | `/seed/hubs` | Idempotently create the 9 default MIL hub records across 4 named provinces (Lusaka, Southern, Eastern, Copperbelt) if provinces already exist | — | `200 {message}` or `400` if the 4 named provinces don't exist yet |

**DB tables**: reads `Province`, writes `Hub`. **Frontend caller**: none found in `src/` — this is an operator-run, one-off endpoint (call manually via curl/Postman with a bearer token after creating provinces through `pages/admin/Provinces.tsx`).

---

## 5. Database Analysis

Source of truth: `backend/prisma/schema.prisma`. Provider: `postgresql`. 25 models, each mapping 1:1 to a PostgreSQL table of the same name (Prisma's default naming — no `@@map` overrides anywhere in the schema).

### 5.1 Content models (the "standard shape")

Every model in this group follows the same convention: `id Int @id @default(autoincrement())` primary key, a `published Boolean @default(true)` flag gating public visibility, and `createdAt DateTime @default(now())` / `updatedAt DateTime @updatedAt` audit columns maintained automatically by Prisma (the SQL columns are plain `TIMESTAMP(3)`; `updatedAt` is stamped by the Prisma Client on every `update()` call, not by a Postgres trigger).

**`Activity`** — a training/workshop/dialogue/webinar event.
| Field | Type | Constraints |
|---|---|---|
| id | Int | PK, autoincrement |
| title, description, content | String | required |
| image | String | required (a `Media.url` copied in as plain text) |
| images | String[] | default `[]` — gallery of additional `Media.url`s |
| program | String? | optional free-text program tag |
| category | String | required (e.g. training/workshop/webinar/dialogue) |
| location | String | required |
| participants | Int | required |
| date | DateTime | required |
| published | Boolean | default `true` |
| createdAt / updatedAt | DateTime | auto |

**`Project`** — a flagship/ongoing project.
Fields: `title`, `description`, `content` (String, required); `image` (String?), `images` (String[] default []); `category`/`status` (String?); `startDate`/`endDate` (DateTime?); `published`; `featured` (Boolean default false — drives the homepage "featured projects" section); audit columns.

**`Report`**, **`Publication`**, **`PressStatement`**, **`Newsletter`**, **`Brochure`** — five near-identical "document" models, all now the same shape: `{ title, description?, fileUrl, image?, published, createdAt, updatedAt }` (`Brochure` uses `thumbnail` instead of `image`, and has no `description`... actually it does have `description?` — the only real difference is the image field's name and that `Brochure`/`Resource` additionally carry `displayOrder`, see §5.1's directory-entry group below). **As of August 2026 these are no longer inconsistent** — `Newsletter` previously had only `{id, title, fileUrl, createdAt}` (no `image`, no `published`, no `updatedAt`) and was silently always-public with no way to feature a cover image; it was brought in line with the others (`description?`, `image?`, `published`, `updatedAt` added), plus one field the others don't have: `publishDate DateTime?` — lets an admin backdate a newsletter to when it actually went out (e.g. entering last month's issue today), independent of `createdAt`. The public `Newsletters.tsx` page sorts/displays by `publishDate ?? createdAt`. `Report` also gained `image?` in the same round of changes (previously text-only).

**`TeamMember`**: `fullName`, `position`, `category` (String, required); `biography` (`String @db.Text` — explicitly TEXT rather than VARCHAR, for long bios); `responsibilities` (`Json` — stored as a JSON array of strings, though the frontend types it as `string[]`); `image` (String?); `displayOrder` (Int, default 0, drives sort order); `published`; audit columns.

**`RadioSpot`**: `title`, `station` (String, required); `description`/`duration`/`image`/`audioUrl` (String?); `broadcastAt` (DateTime, required); `published`; `featured` (Boolean default false); audit columns.

**`Partner`**, **`Donor`**, **`Resource`** — three near-identical "directory entry" models: `name`/`title`, `description?`, `logo?`/`thumbnail?`, `website?`/`link?`/`fileUrl?`, a categorizing field (`category` default `"Partner"` / `tier` default `"Supporter"` / `category` default `"Resource"`), `displayOrder` (Int default 0), `published`, audit columns.

**`ProgramContent`**: `slug` (String, `@unique`) identifies one of the 4 program pages; `title` (required), `subtitle`/`heroImage`/`intro` (String?); `sections` (`Json?` — an array of `{heading?, body?, image?}` blocks, per the frontend's `ProgramSection` interface); `published`; audit columns.

### 5.2 Geographic / relational models

**`Province`**: `id` (PK), `name` (`String @unique`), `createdAt`. One-to-many → `Hub[]`.

**`Hub`**: `id` (PK), `name`, `slug` (`String @unique` — used for the public `/mil/hub/:slug` route), `location?`, `coordinator?`, `coordinatorImage?` (String — added August 2026, optional headshot for the coordinator card on the public hub detail page), `participants` (Int default 0), `description?`, `image?`, `published`; **`provinceId` (Int, FK)** → `province Province @relation(fields: [provinceId], references: [id])`; audit columns; one-to-many → `HubPhoto[]`, `HubEvent[]`.

**`HubPhoto`**: `id` (PK), `imageUrl` (required), `caption?`; **`hubId` (Int, FK)** → `hub Hub @relation(...)`; `createdAt` only (no `updatedAt`/`published` — photos are add/remove only, never edited in place). As of August 2026 this has a real admin UI (`pages/admin/HubPhotos.tsx`) — previously the route existed but nothing in the frontend called it (see §5.6 and §18.1). Rendered on the public hub detail page as a Swiper slideshow, not a static grid.

**`HubEvent`**: `id` (PK), `title` (required), `description?`, `eventType` (String, default `"Community"` — added August 2026, expected values `"Training"` / `"Community"`, **not** a Prisma enum, just a convention enforced by the admin form's `<select>`), `eventDate` (DateTime, required); **`hubId` (Int, FK)** → `hub`; `createdAt` only. `eventType` is what drives the "Training Sessions" vs "Community Events" counts on the public MIL Hubs "Impact at a Glance" stats — those were previously hardcoded placeholder numbers; they're now computed live from real `HubEvent` rows (`pages/mil/Hubs.tsx` fetches `/hubs` and counts published hubs' events by type). Like `HubPhoto`, this model's route existed with no admin UI until August 2026 (`pages/admin/HubEvents.tsx`).

Relational diagram:
```
Province (1) ──< (many) Hub (1) ──< (many) HubPhoto
                              └──< (many) HubEvent
```
Deleting a `Province` or `Hub` that still has dependent rows will fail at the database level (Prisma's default `onDelete` is `Restrict` when unspecified) — the route handlers do not pre-check for or cascade this, so an admin attempting to delete a Province with Hubs, or a Hub with Photos/Events, will get a generic `500` from the `routes/provinces.ts`/`routes/hubs.ts` catch block rather than a friendly "delete its hubs first" message.

### 5.3 Media library

**`Media`**: `id` (PK); `filename` (the Cloudinary `public_id` since the August 2026 Cloudinary migration — was a local disk filename before that, see §3.9); `originalName` (required); `url` (required — a Cloudinary `secure_url` since the migration; the public-facing URL every other model's `image`/`fileUrl` field actually stores a copy of); `mimeType` (required); `size` (Int, required, bytes); `width?`/`height?` (Int, populated only if something sets them — no route currently computes image dimensions server-side, so these stay `null` in practice); `alt?`/`caption?`/`description?`; `folder?` (default `"General"` — a free-text grouping label, not a relation); audit columns. **No foreign keys to or from any other model** — every content model that "uses" an image or file stores a plain string copy of `Media.url`, not a relation. This means deleting a `Media` row does **not** cascade or warn — other records referencing that URL will silently start pointing at a dead link.

### 5.4 Homepage / settings / auth models

**`HomepageSection`**: `id` (PK), `section` (`String @unique`), `data` (`Json`, required — arbitrary shape per section), `published`, audit columns.

**`SiteSettings`**: a **singleton** table (application-level convention — nothing in the schema itself enforces only one row; `routes/settings.ts` enforces it by always doing `findFirst()` then create-or-update against that one row). Fields: `organisation` (default `"Free Press Initiative Zambia"`), `mission?`, `vision?`, `email?`, `phone?`, `address?`, `logo?`, `favicon?`, five social-link strings (`facebook`/`twitter`/`instagram`/`youtube`/`linkedin`), `seoTitle?`/`seoDescription?`, `footerText?`/`copyrightText?`/`analyticsId?`, `maintenanceMode` (Boolean default `false`), six SMTP fields (`smtpHost?`, `smtpPort? Int`, `smtpUser?`, `smtpPassword?`, `smtpFromEmail?`, `smtpFromName?`), audit columns.

**`User`**: `id` (PK), `fullName` (required), `email` (`String @unique`), `password` (required — PBKDF2 hash string, see §9), `role` (String, default `"admin"` — free-text, not an enum; observed values in code: `"admin"`, `"superadmin"`, `"editor"`), `active` (Boolean default `true`), audit columns; one-to-many → `PasswordResetToken[]`.

**`PasswordResetToken`**: `id` (PK), `token` (`String @unique`, 32-byte hex), **`userId` (Int, FK)** → `user User @relation(...)`, `expiresAt` (DateTime, required), `usedAt` (DateTime?, null until consumed), `createdAt`.

### 5.5 Engagement models

**`Testimonial`**: `id` (PK), `name` (required), `role?`, `message` (required), `photo?`, `rating?` (Int default 5), `approved` (Boolean default `false` — moderation gate distinct from `published`), audit columns.

**`Subscriber`**: `id` (PK), `email` (`String @unique`), `name?`, `active` (Boolean default `true`), `createdAt` only.

**`ContactMessage`**: `id` (PK), `name`/`email` (required), `subject?`, `message` (required), `read` (Boolean default `false`), `createdAt` only.

### 5.6 How each model is used through the application (cross-reference)

| Model | Written by (admin) | Read by (public) | Read by (admin) |
|---|---|---|---|
| Activity | CreateActivity/EditActivity | Home, Activities, ActivityDetail | Activities (list), Dashboard (counts) |
| Project | CreateProject/EditProject | ProjectDetail, Home (featured) | Projects (list) |
| Report/Publication/PressStatement/Newsletter/Brochure | matching Create/Edit pages | matching `knowledge/*` or `mil/Brochure` pages | matching list pages |
| TeamMember | CreateTeam/EditTeam | Team | TeamMembers (list) |
| RadioSpot | CreateRadioSpot/EditRadioSpot | mil/RadioSpots (merged with static `data/radioSpots.ts`) | RadioSpots (list) |
| Partner/Donor/Resource | *Admin pages | Partners/Donors/Resources | matching *Admin list pages |
| ProgramContent | ProgramsAdmin | Programs, Advocacy, MediaLiteracy, Research, CapacityBuilding | ProgramsAdmin |
| Province/Hub/HubPhoto/HubEvent | Provinces/CreateHub/EditHub, HubPhotos, HubEvents | mil/Hubs, AllHubs, ProvinceHubs, HubDetail | Hubs (list), HubPhotos (list), HubEvents (list) |
| Media | UploadMedia, every `ImageUpload`/`FileUpload`/`AudioUpload` widget | indirectly, via URLs copied into other models | MediaLibrary, EditMedia, MediaPicker |
| HomepageSection | Homepage (admin editor) | Home (partially) | Homepage |
| SiteSettings | Settings | MaintenanceGate (maintenanceMode only) | Settings |
| User / PasswordResetToken | Users, Login/ForgotPassword/ResetPassword | — | Users |
| Testimonial | TestimonialsAdmin (approve) | wherever testimonials render publicly | TestimonialsAdmin |
| Subscriber | — (self-service) | Footer (subscribe form) | SubscribersAdmin (list, broadcast) |
| ContactMessage | — (self-service) | Contact (submit) | ContactMessagesAdmin |

---

## 6. Prisma

**What Prisma does here**: it is the *only* data-access layer in the backend — there is no raw SQL anywhere, no query builder, no second ORM. Every route imports `{ prisma } from "../lib/prisma"` (a single shared `PrismaClient` instance, `backend/src/lib/prisma.ts`) and calls its generated, fully-typed model delegates (`prisma.activity.findMany(...)`, etc.).

**Prisma Client generation**: the `generator client { provider = "prisma-client-js" }` block in `schema.prisma` produces the client into the default location (`node_modules/@prisma/client`) — there is no custom `output` path. It is (re)generated by:
- `npx prisma generate` — run manually, or implicitly by `npm install` in `backend/` (the `prisma` devDependency runs a `postinstall` hook by default in modern Prisma versions).
- Must be re-run any time `schema.prisma` changes and after every fresh `npm install`, or `import { PrismaClient } from "@prisma/client"` will fail to compile/resolve the current model shapes.

**Migrations**: stored in `backend/prisma/migrations/`, one timestamped folder per migration (`YYYYMMDDHHMMSS_description/migration.sql`), plus `migration_lock.toml` pinning the provider to `postgresql` (this file prevents accidentally applying a migration history generated for a different database provider). 16 migrations exist, tracing the schema's evolution from the initial `Activity`/`Report`/`Newsletter` tables (2026-06-04) through team members, projects, the hub system, media library, publications, homepage sections, radio spots, users/featured flags, settings/password-reset, media folder/dimensions, activity/project gallery images, partners/donors/resources/brochures, testimonials/subscribers/contact, and finally publication images and program content (2026-07-15). Prisma tracks which migrations have been applied in a `_prisma_migrations` table it manages automatically inside the target database.
- **Local development**: `npx prisma migrate dev` — creates a new migration from any schema diff, applies it, and regenerates the client, all in one step. Requires a database the developer can freely reset.
- **Production**: `npx prisma migrate deploy` — applies any pending migrations in order, without generating new ones or touching the schema; safe for CI/CD and production because it never prompts or mutates the migration history.

**How Prisma communicates with PostgreSQL**: via the `datasource db { provider = "postgresql"; url = env("DATABASE_URL") }` block. At runtime, `PrismaClient` reads `DATABASE_URL` from `process.env` (populated by `loadEnv.ts` before `lib/prisma.ts` is ever imported, since `server.ts`'s first line is `import "./loadEnv"`), opens a connection pool over the Postgres wire protocol (with TLS, since the Neon connection string specifies `sslmode=require`), and issues parameterized SQL for every query.

**Which files use Prisma**: `backend/src/lib/prisma.ts` (the client instance) is imported by every file under `routes/` except `routes/homepage.ts` (which goes through `services/homepage.service.ts`, itself importing `lib/prisma.ts`), by `middleware/upload.ts`'s sibling files indirectly, by `utils/mailer.ts` (to read `SiteSettings`), and by the dead `backend/src/services/BaseService.ts` (which oddly instantiates its **own** second `new PrismaClient()` rather than importing the shared instance — harmless only because it's unused dead code; if it were ever wired up, running two separate `PrismaClient` instances in one process would double the connection pool for no benefit).

---

## 7. Neon Database

This project's PostgreSQL is hosted on **Neon**, a managed serverless-Postgres provider. Confirmed directly from `backend/.env`'s `DATABASE_URL`, which targets a hostname of the form `ep-<name>-pooler.<region>.aws.neon.tech` — the `-pooler` suffix specifically routes through **Neon's PgBouncer-based connection pooler** rather than connecting straight to the Postgres instance.

### 7.1 Connection flow

```
Backend process starts
   → loadEnv.ts populates process.env from backend/.env (DATABASE_URL, etc.)
   → lib/prisma.ts: `new PrismaClient()` constructed (lazy — no connection opened yet)
   → first Prisma query anywhere in the app (e.g. the very first request that hits any route)
        → Prisma Client opens a connection to the DATABASE_URL host over TCP/TLS
        → Neon's pooler (PgBouncer) accepts the connection and multiplexes it onto
          Neon's actual Postgres compute (which may itself be auto-suspended and
          "wake up" transparently on first connection — a Neon platform behavior,
          invisible to Prisma/the app; this can add a one-time latency spike to the
          very first query after a period of inactivity)
        → subsequent queries reuse pooled connections from Prisma's own internal pool
```

### 7.2 `DATABASE_URL`

Format: `postgresql://<user>:<password>@<pooler-host>/<database>?sslmode=require&channel_binding=require`. Set in `backend/.env` (gitignored — never committed) for local development; must be set as a real environment variable (not a committed file) on whatever host runs the backend in production. `backend/.env.example` documents the expected shape without real credentials.

### 7.3 Connection pooling

Two pooling layers are in play simultaneously:
1. **Neon's own pooler** (PgBouncer, transaction-pooling mode, indicated by the `-pooler` hostname) — sits between the app and Neon's actual Postgres compute, letting many short-lived client connections share a small number of real backend connections. This is the recommended mode for serverless/many-instance workloads and is what this project's connection string already uses.
2. **Prisma Client's internal connection pool** — `PrismaClient` itself maintains a pool of connections to whatever `DATABASE_URL` points at (here, the Neon pooler). Since `lib/prisma.ts` creates exactly **one** `PrismaClient` per running Node process and this is a traditional long-running Express server (not a serverless function that cold-starts per request), there is no risk here of the classic "Prisma + serverless = connection exhaustion" problem — that problem arises when a new `PrismaClient` (and thus a new pool) is created on every function invocation, which does not happen in this architecture.

### 7.4 SSL

Enforced by the connection string itself: `sslmode=require` (TLS mandatory) plus `channel_binding=require` (a stronger TLS binding Neon supports to harden against certain MITM/downgrade classes). Nothing in application code configures TLS — it is entirely delegated to the connection string, which `pg`/Prisma's driver parses and honors automatically.

### 7.5 Environment variables involved

Only **`DATABASE_URL`** is Neon-specific. No other Neon-branded env var (API keys, project IDs, branch names) is referenced anywhere in the codebase — this project uses Neon purely as a standard Postgres connection string target, not through Neon's management API or branching features.

### 7.6 What happens when the backend starts

Nothing Neon-specific happens at startup beyond normal Prisma initialization (§7.1) — `PrismaClient` doesn't eagerly connect on construction. The first real connection attempt happens lazily, on the first query any request triggers.

### 7.7 What happens when a query is executed

```
Route handler calls prisma.<model>.<operation>(...)
   → Prisma Client's query engine translates this into parameterized SQL
   → sent over the existing (or newly opened) pooled TLS connection to the Neon pooler host
   → Neon's PgBouncer forwards it to the underlying Postgres compute
   → Postgres executes the query, returns rows
   → response flows back through the pooler → Prisma Client → deserialized into typed
     JS objects matching the Prisma schema → returned to the route handler
```

### 7.8 Full request-to-database flow

```
Frontend (React SPA)
   ↓  fetch()/api.ts, JSON over HTTPS, bearer JWT
Express (backend/src/server.ts + routes/*.ts)
   ↓  prisma.<model>.<op>(...)
Prisma Client (backend/src/lib/prisma.ts)
   ↓  parameterized SQL over TLS (sslmode=require, channel_binding=require)
Neon connection pooler (PgBouncer, "-pooler" endpoint)
   ↓
Neon-managed PostgreSQL compute
```

---

## 8. Environment Variables

### 8.1 Backend (`backend/.env`, template in `backend/.env.example`)

| Variable | Purpose | Used in | What breaks if missing | Safe to expose publicly? |
|---|---|---|---|---|
| `DATABASE_URL` | Postgres/Neon connection string | `schema.prisma` (`env("DATABASE_URL")`), `prisma.config.ts` | Every DB query fails immediately; Prisma throws on first query | **No** — full DB credentials |
| `PORT` | Port the Express server listens on | `server.ts` (`Number(process.env.PORT \|\| 5000)`) | Falls back to `5000` | Yes (not sensitive) |
| `APP_BASE_URL` | Public URL of the backend itself | `routes/media.ts` (`mediaUrl()` prefixes uploaded-file URLs) | Media URLs become relative (`/uploads/...`) instead of absolute — can break `<img>` tags in contexts expecting an absolute URL | Yes |
| `APP_PUBLIC_URL` | Public URL of the **frontend** | `routes/auth.ts` (builds the password-reset link); falls back to `CORS_ORIGIN`, then hardcoded `http://localhost:3000` | Password-reset emails link to the wrong (or dev) frontend URL | Yes |
| `UPLOAD_DIR` | Filesystem path — **legacy only** since the Cloudinary migration (§3.9): no new uploads are written here, it's kept solely so pre-migration `Media.url` values (pointing at local `/uploads/...` paths) keep resolving | `middleware/upload.ts` | Falls back to `backend/src/uploads`. Missing/wrong value only breaks *old* uploaded files, not new ones | Yes (it's just a path) |
| `CORS_ORIGIN` | Comma-separated allowlist of frontend origins | `server.ts` (CORS config), `routes/auth.ts` (reset-link fallback) | If unset: `allowedOrigins` is empty, so **all** browser cross-origin requests are rejected — the deployed frontend simply cannot talk to the API at all | Yes |
| `JWT_SECRET` | HMAC key signing/verifying auth tokens | `utils/auth.ts` (`getSecret()`) | Falls back to `process.env.AUTH_SECRET`, then the **hardcoded literal** `"change-this-secret-before-production"` — a critical, silent security hole if never set | **No** — must stay secret |
| `JWT_EXPIRES_IN_SECONDS` | Token lifetime override | `utils/auth.ts` | Falls back to `28800` (8 hours) | Yes, but low sensitivity to disclose |
| `AUTH_SECRET` | Alternate name `getSecret()` also checks | `utils/auth.ts` | Only relevant if `JWT_SECRET` is unset — **not documented in `.env.example`**, effectively an undocumented fallback | **No** |
| `ADMIN_EMAIL` | Bootstrap superuser email | `routes/auth.ts` (`/login`) | If unset alongside `ADMIN_PASSWORD`, the env-based login path is simply skipped (falls through to the `User` table) | No (identifies the break-glass account) |
| `ADMIN_PASSWORD` | Bootstrap superuser password, compared **in plaintext** to the request body | `routes/auth.ts` (`/login`) | Same as above | **No** — this is a live credential, currently a weak-ish generated string in the dev `.env`; must be rotated for any real deployment |
| `ADMIN_NAME` | Display name for the bootstrap account | `routes/auth.ts` | Falls back to `"Administrator"` | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier | `lib/cloudinary.ts`, `routes/media.ts`'s `/media/proxy` URL allowlist | Every upload fails; a startup console warning is logged (see §3.9) | Yes — cloud name alone isn't a secret |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `lib/cloudinary.ts` | Same as above | **No** |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `lib/cloudinary.ts` | Same as above | **No** — full upload/delete credential |

**Not env-configured (a common misconception to flag)**: SMTP is **not** set via environment variables at all — it's configured at runtime through the CMS itself (`Settings → SMTP`, stored in the `SiteSettings` table, read live by `utils/mailer.ts` on every send). There is no `SMTP_HOST`/`SMTP_USER`/etc. env var anywhere in this codebase, despite that being a common pattern elsewhere — don't add one without also updating `mailer.ts`, or the two configuration sources will silently diverge.

**Referenced in code but absent from `.env.example`**: `AUTH_SECRET` (see table above) — a developer copying `.env.example` verbatim would never learn this fallback exists.

### 8.2 Frontend (`fpi/.env`, template in `fpi/.env.example`)

| Variable | Purpose | Used in | What breaks if missing | Safe to expose publicly? |
|---|---|---|---|---|
| `REACT_APP_API_URL` | Base URL of the backend API | `services/config.ts` (`API_BASE_URL`/`API_ORIGIN` derivation) | Falls back to `http://localhost:5000/api` — works locally, breaks entirely once deployed unless explicitly set at build time | **Yes, must be public** — CRA inlines all `REACT_APP_*` vars into the static JS bundle at build time; there is no way to keep this secret in a client-side app, and it isn't sensitive (it's just a URL) |

No other `REACT_APP_*` variables are referenced anywhere in `src/`.

### 8.3 Unused / dead environment variables

None found beyond `AUTH_SECRET` being an undocumented-but-functional fallback (not literally "unused" — it's read, just not documented). No env var is declared in either `.env.example` file and then never read by code, and no env var is read by code but entirely absent from both example files, other than `AUTH_SECRET`.

---

## 9. Authentication

There is a complete, custom-built (not library-based) authentication system. No `jsonwebtoken`, `bcrypt`, `argon2`, `passport`, or session-store package exists in `backend/package.json` — everything is implemented with Node's built-in `crypto` module in `backend/src/utils/auth.ts`.

### 9.1 Password hashing

`hashPassword(password)`: generates a random 16-byte hex salt, derives a key via `crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512")`, and stores the result as the string `pbkdf2$<salt>$<hash>`. `verifyPassword(password, storedPassword)`: if the stored value doesn't start with `pbkdf2$`, it falls back to a **constant-time plain-string comparison** (`crypto.timingSafeEqual`) — a defensive branch for any legacy/manually-inserted row that isn't PBKDF2-hashed, not a mechanism actively used anywhere in current routes. Otherwise it re-derives the PBKDF2 hash with the stored salt and compares in constant time.

### 9.2 JWT (hand-rolled, HS256-equivalent)

`signToken({id, email, role})`: builds a standard three-part JWT (`base64url(header).base64url(payload).base64url(signature)`), `alg: "HS256"`, payload includes `exp` (now + `JWT_EXPIRES_IN_SECONDS`, default 8 hours), signature = `HMAC-SHA256(header + "." + payload, secret)`. `verifyToken(token)`: splits the token, recomputes the expected signature, compares with `crypto.timingSafeEqual` (mitigates timing attacks), parses the payload, and rejects if `exp` is missing or in the past. The secret comes from `JWT_SECRET` → falls back to `AUTH_SECRET` → falls back to the literal string `"change-this-secret-before-production"` (see §8.1 — this fallback is a real production risk if the env var is ever left unset).

### 9.3 Login flow

```
POST /api/auth/login  {email, password}
  → loginRateLimit (10 / 15min / IP)
  → if email/password match ADMIN_EMAIL/ADMIN_PASSWORD env vars exactly (plaintext compare):
        return signToken({id: "env-admin", email, role: "admin"})   ← bootstrap superuser, bypasses the User table entirely
  → else: look up User by email
        → if missing, inactive, or verifyPassword() fails → 401 "Invalid email or password"
        → else → signToken({id: user.id, email: user.email, role: user.role})
  → response: {token, user: {email, fullName, role}}
```
Frontend (`services/auth.ts` `login()`): calls `POST /auth/login`, then stores `token`+`user` in **either** `localStorage` (if `remember=true`, the default) **or** `sessionStorage` — never both, and any previous entry in the other storage isn't proactively cleared by `login()` itself (only `logout()` and the 401-handlers clear both).

### 9.4 Registration

There is **no public self-registration endpoint**. New CMS users are created exclusively by an existing admin via `POST /api/users` (`requireAdmin`), from `pages/admin/Users.tsx`. The very first account in any fresh deployment is the env-var-based bootstrap account (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), which is expected to log in once and then create real, named `User` rows for ongoing use.

### 9.5 Sessions

There are no server-side sessions at all — the JWT itself is the entire auth state, verified statelessly on every request. There is no token revocation/blacklist mechanism: a token remains valid until its `exp` passes, even if the user is deleted or deactivated after issuance (the only way to invalidate all outstanding tokens is to rotate `JWT_SECRET`, which logs out every user simultaneously — noted explicitly in `HANDOVER.md`).

### 9.6 Authorization middleware (`backend/src/middleware/auth.ts`)

- **`requireAuth`**: extracts and verifies the bearer token; on success attaches `req.authUser = {id, email, role}` and calls `next()`; on failure, `401`.
- **`requireAuthForMutations`**: passes GET/HEAD/OPTIONS straight through; delegates everything else to `requireAuth`. This is the function mounted globally at `app.use("/api", requireAuthForMutations)` (§3.2).
- **`requireAdmin`**: independently re-verifies the token (duplicated logic from `requireAuth` rather than composed from it) and additionally checks `role === "admin" || role === "superadmin"`, returning `403 "Administrator access required"` otherwise. Used only in `routes/users.ts`.

### 9.7 Protected routes (frontend)

`components/admin/ProtectedRoute.tsx` wraps individual `<Route element={...}>` values in `App.tsx` (via the local `admin(element)` helper) — every `/admin/*` route **except** `/admin/login`, `/admin/forgot-password`, `/admin/reset-password` is wrapped. It calls `isAuthenticated()` (decodes the JWT client-side, checks `exp` against the current time, **fails closed** — an undecodable token is treated as unauthenticated rather than assumed valid) and redirects to `/admin/login` (preserving the attempted path in router state) if the check fails. This is purely a UX gate — the real security boundary is always the backend's `requireAuth`/`requireAdmin` middleware; a modified/bypassed frontend cannot obtain data it isn't authorized for, because every write and every admin-only read is re-checked server-side.

### 9.8 Two independent client-side 401 handlers

`src/services/api.ts`'s `request()` function and `src/services/config.ts`'s `installApiFetchInterceptor()` (installed once, globally, in `src/index.tsx` before `<App/>` mounts) **both** independently: attach the bearer token to outgoing mutating requests, and on a `401` response clear both storages and hard-redirect to `/admin/login?expired=1`. They overlap in coverage (`api.ts` covers everything routed through the `api.*` helpers; the fetch interceptor additionally catches any `raw fetch()` call a page makes directly, of which there are many — see §16).

---

## 10. Frontend to Backend Communication

Every API call originates from one of two patterns, both ultimately hitting `API_BASE_URL` (`services/config.ts`):

**Pattern A — service layer** (`src/services/*.ts` → `api.ts` → `fetch`): used consistently by admin CRUD pages. Example chain: `pages/admin/CreateActivity.tsx` → `activityService.create(payload)` → `BaseService.create()` → `api.post("/activities", data)` → `fetch(`${API_BASE_URL}/activities`, {method:"POST", headers:{Authorization: Bearer <jwt>}, body: JSON.stringify(data)})` → `routes/activities.ts` `POST /` → `prisma.activity.create()` → `Activity` table.

**Pattern B — direct `fetch()`**: used by most **public-facing** pages (confirmed by grep: 37 files under `src/pages` call `API_BASE_URL` directly via raw `fetch`, versus 29 files that go through a `*Service`) and by a few upload widgets that intentionally bypass the service layer for multipart uploads (`ImageUpload.tsx`, `FileUpload.tsx`, `AudioUpload.tsx` — see §4.5). Example: `pages/Activities.tsx` → `fetch(`${API_BASE_URL}/activities`)` → `routes/activities.ts` `GET /` → `prisma.activity.findMany()` → filters `.filter(a => a.published)` **client-side** (the backend returns all activities regardless of `published` status on this endpoint — every list route in this API returns unfiltered data and relies on the frontend to hide unpublished items on public pages; this is a real, if low-severity, information-exposure gap — see §16).

### 10.1 Call map (representative — not exhaustive; every resource follows one of the two patterns above)

| Public page | Component | Endpoint(s) | Backend handler | DB table(s) |
|---|---|---|---|---|
| `pages/Home.tsx` | inline | `GET /activities`, `GET /homepage/:section` (some sections) | `routes/activities.ts`, `controllers/homepage.controller.ts` | `Activity`, `HomepageSection` |
| `pages/Activities.tsx` | inline | `GET /activities` | `routes/activities.ts` | `Activity` |
| `pages/ActivityDetail.tsx` | inline | `GET /activities/:id` | `routes/activities.ts` | `Activity` |
| `pages/Projects/ProjectDetail.tsx` | inline | `GET /projects/:id` | `routes/projects.ts` | `Project` |
| `pages/team/Team.tsx` | `teamService` | `GET /team` | `routes/team.ts` | `TeamMember` |
| `pages/mil/Hubs/{AllHubs,ProvinceHubs,HubDetail}.tsx` | `hubService` / inline | `GET /hubs`, `GET /hubs/:slug` | `routes/hubs.ts` | `Hub`, `Province`, `HubPhoto`, `HubEvent` |
| `pages/contact/Contact.tsx` | `contactService` | `POST /contact` | `routes/contact.ts` | `ContactMessage` |
| `components/layout/Footer.tsx` | `subscriberService` | `POST /subscribers` | `routes/subscribers.ts` | `Subscriber` |
| `components/MaintenanceGate.tsx` | inline | `GET /settings` | `routes/settings.ts` | `SiteSettings` |
| **Admin page** | | | | |
| `pages/admin/CreateActivity.tsx` / `EditActivity.tsx` | `activityService` | `POST /activities`, `PUT /activities/:id` | `routes/activities.ts` | `Activity` |
| `pages/admin/media/UploadMedia.tsx`, and every `ImageUpload`/`FileUpload`/`AudioUpload` instance | direct `fetch` | `POST /media` | `routes/media.ts` | `Media` |
| `pages/admin/Settings.tsx` | `settingsService` | `GET/PUT /settings` | `routes/settings.ts` | `SiteSettings` |
| `pages/admin/Users.tsx` | `userService` | `GET/POST/PUT/DELETE /users`, `POST /users/:id/reset-password` | `routes/users.ts` | `User` |
| `pages/admin/Login.tsx` | `services/auth.ts` | `POST /auth/login` | `routes/auth.ts` | `User` |

---

## 11. Data Flow — worked examples

### 11.1 Activities (public read path)

```
Browser (visitor opens /activities)
  ↓
React Component: pages/Activities.tsx mounts, useEffect fires
  ↓
API Call: fetch(`${API_BASE_URL}/activities`)   [no auth header — public GET]
  ↓
Express Route: GET /api/activities  (routes/activities.ts, router.get("/"))
  ↓  (requireAuthForMutations passes it through unchecked — method is GET)
Controller: none — inline handler
  ↓
Prisma: prisma.activity.findMany({ orderBy: { createdAt: "desc" } })
  ↓
Neon: SELECT * FROM "Activity" ORDER BY "createdAt" DESC  (over the pooled TLS connection)
  ↓
Database: returns all rows, published and unpublished alike
  ↓
JSON Response: res.json(activities) — full array, 200
  ↓
React Rendering: Activities.tsx filters `data.filter(a => a.published)` client-side,
                 renders a card grid; unpublished activities are fetched over the wire
                 but never rendered (see §16 for the implication of this)
```

### 11.2 Team Members (admin write path)

```
Browser (admin fills out CreateTeam form, clicks Save)
  ↓
React Component: pages/admin/CreateTeam.tsx builds a form object
  ↓
API Call: teamService.create(payload) → BaseService.create() → api.post("/team", payload)
          → fetch(`${API_BASE_URL}/team`, {method:"POST", headers:{Authorization:"Bearer <jwt>",
            "Content-Type":"application/json"}, body: JSON.stringify(payload)})
  ↓
Express Route: app.use("/api", requireAuthForMutations) → verifies JWT → req.authUser set
             → POST /api/team (routes/team.ts, router.post("/"))
  ↓
Controller: none — inline handler
  ↓
Prisma: prisma.teamMember.create({ data: req.body })
  ↓
Neon: INSERT INTO "TeamMember" (...) VALUES (...) RETURNING *
  ↓
Database: new row created, id/createdAt/updatedAt generated
  ↓
JSON Response: res.status(201).json(member)
  ↓
React Rendering: CreateTeam.tsx shows a success alert, navigate("/admin/team");
                 pages/admin/TeamMembers.tsx re-fetches teamService.getAll() and re-renders
                 the list; the public pages/team/Team.tsx will show the new member on its
                 next load (no real-time push — purely request/response)
```

### 11.3 Media upload feeding into a Project's gallery

```
Browser (admin on CreateProject/EditProject, uses ProjectGalleryPicker → ImageUpload)
  ↓
React Component: components/admin/ImageUpload.tsx handleFileChange()
  ↓
API Call: raw fetch(`${API_BASE_URL}/media`, {method:"POST",
          headers:{Authorization:"Bearer <jwt>"}, body: FormData{file}})
          [multipart — bypasses services/api.ts and its JSON Content-Type default]
  ↓
Express Route: POST /api/media (routes/media.ts) — Multer's upload.single("file") middleware
             runs FIRST (disk storage, mimetype/size validation), THEN the route handler runs
  ↓
Prisma: prisma.media.create({ data: { filename, originalName, url, mimeType, size, alt, description } })
  ↓
Neon: INSERT INTO "Media" (...) RETURNING *
  ↓
Database: new Media row; the physical file already sits on disk at UPLOAD_DIR/<filename>
  ↓
JSON Response: res.status(201).json(media)   — includes `media.url`
  ↓
React Rendering: ImageUpload.tsx calls onChange(media.url), which the parent ProjectForm
                 stores into form.images[]; only on the SEPARATE, later "Save Project" submit
                 does projectService.update(id, {..., images}) persist that URL array onto
                 the Project row itself — the file upload and the project save are two
                 independent round trips, not one atomic operation
```

### 11.4 Homepage sections (the layered path)

```
Browser (admin edits the "Statistics" section in pages/admin/Homepage.tsx)
  ↓
React Component: components/admin/homepage/StatisticsEditor.tsx collects field values
  ↓
API Call: homepageService.updateSection("statistics", data) → api.put("/homepage/statistics", data)
  ↓
Express Route: PUT /api/homepage/:section (routes/homepage.ts) → updateHomepageSection
  ↓
Controller: controllers/homepage.controller.ts → homepageService.update(section, req.body)
  ↓
Service: services/homepage.service.ts → homepageSection.upsert({where:{section}, update:data, create:{section,...data}})
  ↓
Prisma → Neon → Database: UPSERT into "HomepageSection" WHERE section = 'statistics'
  ↓
JSON Response: res.json(updatedSection)
  ↓
React Rendering: Homepage.tsx admin editor reflects the save; pages/Home.tsx will pick up
                 the new data.section value on its next fetch of that section
```

---

## 12. Hosting Guide

The two apps are deployed **independently** and do not need to share a host.

### 12.1 Frontend build & deploy

```bash
# from fpi/ (repo root)
npm install
npm run build            # produces static output in fpi/build/
```
- Deploy the contents of `build/` to any static host (Vercel, Netlify, S3+CloudFront, etc.). `vercel.json` already provides the SPA rewrite rule (`/(.*) → /index.html`) needed so client-side routes like `/admin/login` don't 404 on a hard refresh — replicate the equivalent rule on any non-Vercel static host (Netlify: a `_redirects` file with `/* /index.html 200`).
- **Required env var at build time**: `REACT_APP_API_URL` — set to the deployed backend's URL plus `/api` (e.g. `https://api.example.org/api`). Because CRA inlines this at build time, changing it requires a full rebuild, not just a redeploy of the same artifact.

### 12.2 Backend build & deploy

```bash
# from fpi/backend/
npm install
npx prisma migrate deploy    # applies all pending migrations against DATABASE_URL
npx prisma generate          # regenerate the Prisma Client (npm install's postinstall usually already does this)
npm run build                 # tsc → backend/dist/
npm start                     # node dist/server.js
```
- Needs a **long-running Node process host** (Render, Railway, Fly.io, a VPS, etc.) — it is a persistent Express server, not compatible with a pure serverless-function host without rearchitecting (file uploads to local disk, in particular, assume a persistent filesystem across requests).
- **Required environment variables** (see §8.1 for full detail): `DATABASE_URL`, `PORT` (often auto-injected by the host), `APP_BASE_URL`, `APP_PUBLIC_URL`, `UPLOAD_DIR`, `CORS_ORIGIN`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.
- **Static assets / uploads**: new uploads already go to Cloudinary (§3.9), so this is no longer the deployment landmine it used to be — the object-store migration `HANDOVER.md`/this section previously called for is **done**. The only remaining local-disk dependency is legacy pre-migration files still referenced by old `Media.url` values (a persistent `UPLOAD_DIR` volume, or accepting those specific old links will 404 on a fresh host, is the only decision left here).
- **Database connection**: point `DATABASE_URL` at the production Neon database (or any other Postgres instance — Prisma is provider-agnostic here, only `migration_lock.toml`'s `provider = "postgresql"` pins the SQL dialect, not the specific host). If keeping Neon, prefer its pooled (`-pooler`) connection string for a normal Express deployment.
- **Domain / SSL / reverse proxy**: this app does not terminate TLS itself and does not need an in-process reverse proxy — standard practice is to put the Node process behind whatever the host provides (Render/Railway/Fly all terminate TLS and reverse-proxy to the app automatically; on a bare VPS, put Nginx or Caddy in front for TLS termination and forward to `PORT`). `app.set("trust proxy", 1)` is already configured for exactly this single-hop-reverse-proxy scenario — do not add a second proxy layer in front of that without adjusting the trust-proxy hop count, or `req.ip`/rate-limiting will see the wrong client IP.

### 12.3 First-boot checklist for a brand-new database

1. `npx prisma migrate deploy` (creates all 25 tables).
2. Start the backend; log in once with `ADMIN_EMAIL`/`ADMIN_PASSWORD` (bootstrap account — no DB row needed).
3. Create at least one Province via `pages/admin/Provinces.tsx` (or `POST /api/provinces`) for each of Lusaka/Southern/Eastern/Copperbelt if you intend to use `POST /api/seed/hubs`.
4. Optionally call `POST /api/seed/hubs` (authenticated) to populate the 9 default MIL hubs.
5. Configure SMTP under Admin → Settings so "Forgot password" actually sends email (until then, reset links only appear in server logs).
6. Create named `User` accounts under Admin → Users; treat the env-based bootstrap account as break-glass only going forward.

---

## 13. Production Checklist

- [ ] Set a strong, unique `ADMIN_PASSWORD` (the committed dev value is a throwaway and must not reach production).
- [ ] Set `JWT_SECRET` to a long random value — never rely on the hardcoded fallback.
- [ ] Set `CORS_ORIGIN` explicitly to the real frontend domain(s), comma-separated if more than one (e.g. `https://example.org,https://www.example.org`) — leaving it unset makes the API unreachable from any browser, not "open," but still must be set correctly for the real site to work.
- [ ] Set `APP_BASE_URL` and `APP_PUBLIC_URL` to the real backend/frontend URLs respectively (affects media URLs and password-reset links).
- [ ] Set the three `CLOUDINARY_*` env vars (§8.1) **before** the first real content upload — new uploads go straight to Cloudinary now, not local disk (§3.9), so this replaces the old "provision a persistent volume" step. `UPLOAD_DIR` only still matters for pre-migration files.
- [ ] Run `npx prisma migrate deploy` against the production database before first boot.
- [ ] Log in with the bootstrap admin, configure SMTP under Settings, then create named admin/editor accounts and stop using the bootstrap account day-to-day.
- [ ] Consider closing the SVG-upload-adjacent and unpublished-content-exposure gaps noted in §16 before a public launch.
- [ ] Add `helmet` (or equivalent) for baseline security headers — not currently installed.
- [ ] Decide on monitoring/uptime/error-tracking and database backup ownership — none of this is currently wired up in the codebase.
- [ ] Verify `REACT_APP_API_URL` was set correctly **before** the production frontend build (it's baked in at build time, not runtime-configurable).
- [ ] Confirm the SPA rewrite rule (`vercel.json` or host equivalent) is active so deep-linked/refreshed admin routes don't 404.

---

## 14. Dependencies

### 14.1 Frontend (`fpi/package.json`)

| Package | Type | Why it's here |
|---|---|---|
| `react`, `react-dom` | runtime | UI framework |
| `react-router-dom` | runtime | client-side routing (`App.tsx`'s entire route tree) |
| `react-scripts` | runtime (CRA's build toolchain is technically a dependency, not devDependency, in CRA projects) | build/dev/test tooling (webpack, Jest, ESLint config, etc., all internal to CRA) |
| `typescript` | runtime (same CRA convention) | type checking during CRA build |
| `framer-motion` | runtime | scroll/entrance animations across public pages (Home, Navbar, etc.) |
| `swiper` | runtime | image/gallery carousels (ActivityDetail gallery, Home hero, radio spots) |
| `lucide-react`, `react-icons` | runtime | icon sets used throughout both public and admin UI |
| `react-countup` | runtime | animated number counters (homepage stats) |
| `@testing-library/*`, `@types/jest` | runtime (CRA bundles these as regular deps by convention) | testing utilities for `App.test.tsx` |
| `@types/node`, `@types/react`, `@types/react-dom` | runtime (CRA convention) | TypeScript ambient types |
| `web-vitals` | runtime | powers `reportWebVitals.ts` (present but not wired to any analytics sink — effectively inert) |
| `tailwindcss`, `postcss`, `autoprefixer` | devDependency | CSS build pipeline |

No frontend dependency appears entirely unused — `web-vitals` is installed and imported but its callback is never given a real destination, which is a "does nothing useful yet" state rather than dead code per se.

### 14.2 Backend (`backend/package.json`)

| Package | Type | Why it's here |
|---|---|---|
| `express` | runtime | the HTTP server framework |
| `@prisma/client` | runtime | generated database client |
| `cors` | runtime | CORS middleware (§3.1) |
| `express-rate-limit` | runtime | login/reset/public-write throttling (`middleware/rateLimit.ts`) |
| `multer` | runtime | multipart parsing into an in-memory buffer (`middleware/upload.ts`) — since the Cloudinary migration this no longer writes to disk, see §3.9 |
| `cloudinary` | runtime | media hosting SDK — `lib/cloudinary.ts` config + `routes/media.ts`'s `uploader.upload_stream` call |
| `dotenv` | runtime | used directly by `prisma.config.ts` for the Prisma CLI's own process; the app itself still uses the separate hand-rolled `loadEnv.ts` (both coexist — see §3.1) |
| `nodemailer` | runtime | SMTP email sending (`utils/mailer.ts`) |
| `uuid` | runtime | **declared but not imported anywhere in `backend/src`** — appears unused; file naming in `middleware/upload.ts` uses `Date.now()` + `Math.random()` instead of `uuid` (still true as of the August 2026 update) |
| `prisma` | devDependency | the Prisma CLI (`migrate`, `generate`, `studio`) |
| `ts-node-dev` | devDependency | hot-reloading dev server (`npm run dev`) |
| `typescript` | devDependency | compiles `src/` → `dist/` for production |
| `@types/*` (`cors`, `express`, `multer`, `node`, `nodemailer`, `uuid`) | devDependency | TypeScript ambient types matching the runtime deps above |

**Notably absent** (referenced in `HANDOVER.md` as recommended additions, not currently installed): `helmet` (security headers), `jsonwebtoken`/`bcrypt` (would replace the hand-rolled equivalents), any validation library (Zod/Joi), any test framework, any logger beyond `console`.

---

## 15. Code Walkthrough — from `npm start`/`npm run dev` to first paint

### 15.1 Backend (`npm run backend:dev` from repo root, or `npm run dev` from `backend/`)

1. Root `package.json`'s `backend:dev` script runs `npm --prefix backend run dev`, which runs `ts-node-dev --respawn --transpile-only src/server.ts` inside `backend/`.
2. `ts-node-dev` transpiles and executes `backend/src/server.ts` in-memory (no `dist/` output in dev mode), watching for file changes to auto-restart.
3. `server.ts`'s first import, `import "./loadEnv"`, synchronously reads `backend/.env` and populates `process.env` (see §3.1 step 1).
4. Express app is constructed, CORS/JSON/route/error-handler middleware wired in the exact order in §3.2.
5. `app.listen(PORT)` binds the HTTP server; `"Server running on http://localhost:5000"` is logged. The process now sits idle, event-loop-driven, waiting for incoming HTTP connections — no database connection has been opened yet (Prisma connects lazily on first query).

### 15.2 Frontend (`npm start` from repo root)

1. `react-scripts start` boots CRA's dev server (webpack-dev-server under the hood), compiling `src/index.tsx` and its full import graph, and injects `process.env.REACT_APP_API_URL` (read from `fpi/.env` at this point, since CRA's dev server, unlike a production build, re-reads env on each start) into the bundle.
2. Browser requests `http://localhost:3000/` → CRA serves `public/index.html`, which loads the compiled JS bundle.
3. `src/index.tsx` executes: `installApiFetchInterceptor()` runs first (patches `window.fetch` globally, before any component has a chance to make a request), then `ReactDOM.createRoot(...).render(<React.StrictMode><App/></React.StrictMode>)`.
4. `App.tsx`'s default export wraps everything in `<BrowserRouter>`, renders `<AppContent/>` + `<ScrollToTop/>`. `AppContent` reads the current URL via `useLocation()`, computes `isAdmin = pathname.startsWith("/admin")`.
5. For a visitor landing on `/` (not admin): `isAdmin` is `false`, so the tree renders wrapped in `<MaintenanceGate>` → `<Navbar/>` + `<Routes>...<Route path="/" element={<Home/>}/>...</Routes>` + `<Footer/>`.
6. `MaintenanceGate` immediately fires a `fetch(`${API_BASE_URL}/settings`)` and renders `null` until that resolves (avoiding a maintenance-mode flash), then either renders the maintenance placeholder or the actual children.
7. `Home.tsx` mounts, its own `useEffect` fires a `fetch(`${API_BASE_URL}/activities`)` for its "latest activities" section (and reads certain `HomepageSection` rows for other blocks), setting local state as responses resolve — this is the first real network round-trip to the backend, and the moment the visible page becomes "first meaningful paint" complete (everything before this is static/loading-skeleton markup).
8. For an admin visiting `/admin/activities` cold (no valid token): `ProtectedRoute` immediately `<Navigate to="/admin/login"/>`s before `Activities.tsx` (the admin list page) ever mounts or makes a request — the redirect happens client-side, instantly, with no network round trip.

---

## 16. Developer Notes

### 16.1 Architectural strengths

- **Consistent CRUD conventions**: the overwhelming majority of resources follow one predictable shape (5 REST verbs, `published`/`createdAt`/`updatedAt` columns, `BaseService` on the frontend) — a new developer who understands one resource (e.g. Activities) can predict the shape of a dozen others without reading their code.
- **Auth boundary is centralized, not scattered**: one line (`app.use("/api", requireAuthForMutations)`) gates the vast majority of write access, rather than requiring every route file to remember to add its own middleware — reduces the chance of a forgotten-auth-check bug on a new resource, provided the developer understands the mounting-order contract (§3.2).
- **Graceful SMTP degradation**: `sendMail()` never throws or blocks a user-facing flow (contact form, password reset, broadcast) just because SMTP isn't configured — it logs and returns a status flag instead, which is a genuinely good defensive pattern for an NGO site that may go through periods without an SMTP provider set up.
- **Fails-closed auth checks**: both `isAuthenticated()` (frontend, undecodable token ⇒ treated as logged out) and CORS (unset `CORS_ORIGIN` ⇒ nothing allowed, not everything) default to the safer failure mode rather than the more permissive one.

### 16.2 Weaknesses, technical debt, and dead code (concrete, file-referenced)

- **Orphaned controller/service layer**: `backend/src/controllers/{newsletters,publications,radioSpots,reports}.controller.ts`, their matching `backend/src/services/*.service.ts`, `backend/src/services/BaseService.ts`, and `backend/src/services/publicationService.ts` (which is a literal 0-byte file) are entirely unreachable from any mounted route. A future developer might reasonably assume these represent the "real" implementation and edit them, with zero effect on the running app, unless someone explains that `routes/{newsletters,publications,radioSpots,reports}.ts` are the actual live code. Recommendation: either finish wiring the layered style everywhere (matching `routes/homepage.ts`) or delete the orphaned files to remove the trap.
- **Two unrelated `BaseService` classes with the same name**: `frontend src/services/BaseService.ts` (wraps `fetch`) and `backend/src/services/BaseService.ts` (wraps Prisma, and is dead code) share a class name and CRUD-method shape but nothing else — easy to confuse when grepping across the whole repo.
- **Inconsistent frontend data-fetching pattern**: public pages mix raw `fetch(API_BASE_URL + ...)` (37 files) with the `*Service` layer (29 files), sometimes within the same admin page (e.g. `admin/EditActivity.tsx`, `admin/Hubs.tsx`, `admin/CreateHub.tsx` use both patterns). This means the "single source of truth" for how to call the API is really two sources, and a bug fix to `services/api.ts` (e.g. a new header, better error messages) will not automatically apply to every `fetch()` call site.
- **List endpoints return unpublished content**: every `GET /` list route (activities, projects, reports, etc.) returns *all* rows regardless of `published`, relying on the frontend to filter (`pages/Activities.tsx`'s `.filter(a => a.published)` is representative). A visitor who opens browser devtools' Network tab, or calls the API directly, can see draft/unpublished content that was never meant to be public. This is a real, if modest, content-exposure issue — fixing it means adding `where: { published: true }` to every public-facing list/detail query, or adding a query-param-gated variant the way `routes/testimonials.ts` already does for its own `?all=true` pattern.
- **No input validation library**: as detailed in §3.6, most routes trust `req.body` completely, relying on Prisma/Postgres to reject malformed data as an opaque 500. There's no consistent 400-with-field-errors experience for the admin UI to build on.
- **Hand-rolled JWT and password hashing**: functionally correct (HMAC-SHA256 with constant-time comparison, PBKDF2 with a reasonable iteration count) but carries the maintenance and audit burden of custom crypto code rather than a widely-reviewed library. `HANDOVER.md` already flags this as a "should fix soon" item.
- **No cascading delete guardrails**: deleting a `Province` with `Hub`s, or a `Hub` with `HubPhoto`/`HubEvent` rows, or a `Media` row still referenced elsewhere by URL, all fail ungracefully (generic 500, or a silently-broken URL for the Media case) rather than surfacing a clear "delete children first" message.
- **Dead/placeholder files**: `src/constants/homepage.ts`, `src/hooks/useScrollReveal.ts`, `src/types/home.ts` (frontend) are all explicitly empty, with comments pointing at a `PROJECT_AUDIT.md` file that does not exist anywhere in the repository — a stale cross-reference from some earlier, now-missing documentation pass.
- **`uuid` dependency is installed but unused** in the backend (§14.2) — either remove it or use it for upload filenames instead of the current `Date.now()+Math.random()` scheme.
- **Two competing 401-handling code paths** (`services/api.ts` and the global fetch interceptor in `services/config.ts`, §9.8) — functionally redundant rather than complementary; consolidating to one would reduce the surface a future auth-flow bug could hide in.
- **`role` is a free-text string, not an enum**: `User.role` has no `@db.Enum` or check constraint — `"admin"`, `"superadmin"`, `"editor"` are all conventions enforced only by application code (`requireAdmin`'s hardcoded string comparison), so a typo'd role value (`"Admin"` vs `"admin"`) would silently fail authorization checks rather than erroring at write time.

### 16.3 Security concerns (cross-reference to `HANDOVER.md`, confirmed against source)

1. Rotate `ADMIN_PASSWORD` before any public launch (currently a generated-but-real dev credential sits in `backend/.env`, which is correctly gitignored but must not be reused in production).
2. `CORS_ORIGIN` must always be set correctly in production — confirmed fails closed, but a misconfigured value (wrong domain) silently breaks the entire frontend rather than erroring loudly.
3. No rate limiting exists on the standard CRUD write endpoints (only login/reset/public-writes are throttled) — an authenticated-but-compromised token could be used to hammer the API without any backend throttle.
4. SVG is correctly excluded from uploads (confirmed in `middleware/upload.ts`) — the stored-XSS vector `HANDOVER.md` warns about has already been mitigated in the current code, not merely flagged as a to-do (this HANDOVER.md item appears to be already resolved).
5. `helmet` is not installed — no `X-Content-Type-Options`, `HSTS`, etc.

### 16.4 Performance improvements worth considering

- The public list endpoints (§16.2) fetch entire tables with no pagination anywhere in the API — fine at current NGO-content-scale, but `Activity`/`Project`/`TeamMember` etc. will eventually need `take`/`skip` (Prisma supports this natively) plus corresponding frontend pagination UI.
- No caching layer (HTTP cache headers, CDN, or in-memory) exists for read-heavy public endpoints — every page load re-queries Neon directly.
- `Media.width`/`height` are schema fields that no upload path currently populates — computing and storing these at upload time would let the frontend reserve image space and reduce layout shift, without a schema change.

### 16.5 Refactoring opportunities

- Pick one data-fetching pattern (service layer vs raw fetch) and migrate the other, rather than maintaining both indefinitely.
- Either delete or finish wiring the orphaned controller/service files (§16.2) — as-is they are a maintenance trap.
- Extract the near-identical CRUD boilerplate repeated across `routes/{activities,projects,reports,newsletters,publications,pressStatements,radioSpots,team,provinces,partners,donors,resources,brochures}.ts` into a small generic router factory (the backend already has the *shape* of this in the dead `services/BaseService.ts` — reviving and properly wiring that idea, rather than the current copy-pasted pattern per file, would shrink the routes folder substantially and reduce the chance of one resource's route accidentally omitting a check the others have).

---

## 17. Hosting Handover Checklist

For whoever takes over hosting/operating this project:

**Required files** (already in the repo, nothing to author from scratch):
- [ ] `fpi/` (frontend) and `fpi/backend/` (backend) — both required, deployed as two separate apps.
- [ ] `backend/prisma/schema.prisma` + `backend/prisma/migrations/*` — required for any database setup.
- [ ] `backend/.env.example` and `fpi/.env.example` — templates to copy into real `.env` files (never commit the real ones).

**Environment variables to set on the new host** (see §8 for full detail):
- [ ] Backend: `DATABASE_URL`, `PORT`, `APP_BASE_URL`, `APP_PUBLIC_URL`, `UPLOAD_DIR`, `CORS_ORIGIN`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- [ ] Frontend: `REACT_APP_API_URL` (set **before** running the build — it's compiled in, not read at runtime).

**Build commands**:
- [ ] Frontend: `npm install && npm run build` (from `fpi/`).
- [ ] Backend: `npm install && npm run build` (from `fpi/backend/`, or `npm run backend:build` from `fpi/`).

**Start commands**:
- [ ] Backend: `npm start` (from `fpi/backend/`, runs `node dist/server.js`), or `npm run backend:start` from `fpi/`.
- [ ] Frontend: no start command needed in production — serve the static `build/` directory from any static host.

**Database requirements**:
- [ ] A PostgreSQL instance reachable from the backend host (Neon or otherwise) — connection string in `DATABASE_URL`.
- [ ] Run `npx prisma migrate deploy` against it before first boot.
- [ ] Run `npx prisma generate` (usually automatic via `npm install`'s postinstall, but verify).

**Manual setup steps after first deploy**:
- [ ] Log in once with the `ADMIN_EMAIL`/`ADMIN_PASSWORD` bootstrap account.
- [ ] Create at least one `Province` per name (Lusaka, Southern, Eastern, Copperbelt) if using the hub-seeding endpoint, then `POST /api/seed/hubs` (authenticated) to populate default hubs.
- [ ] Configure SMTP under Admin → Settings so password-reset emails actually send (otherwise reset links only ever reach the server console log — the new host needs log access for the very first reset).
- [ ] Create named `User` accounts under Admin → Users; stop relying on the bootstrap env-based account for daily use.
- [ ] Set the `CLOUDINARY_*` env vars before the first real content upload — uploads go to Cloudinary now (§3.9), not local disk, so this has replaced "provision persistent storage" as the thing to get right before launch. Also confirm the Cloudinary account has **"Allow delivery of PDF and ZIP files"** enabled under Settings → Security — without it, `raw`-type uploads (PDFs/Word docs) 401 on delivery even though they uploaded successfully; see §18.2.
- [ ] Confirm the SPA rewrite rule is active on the frontend host so deep links into `/admin/*` don't 404 on refresh.

---

## 18. August 2026 Update Log

Everything in this section happened after the original 2026-07-19 audit, in a single extended session. It's grouped by area, most consequential first, so a reader can skim to what matters to them without re-reading the whole document.

### 18.0 Summary of feature/content changes

- **Media pipeline moved to Cloudinary** (§3.9, §4.5) — was planned/in-progress at audit time (`backend/CLOUDINARY_MIGRATION.md`), is now live: uploads go straight to Cloudinary, `Media.filename`/`Media.url` store Cloudinary identifiers, and a new `/api/media/proxy` route makes Cloudinary's `raw` (PDF/doc) delivery behave like a normal same-origin download/preview.
- **Hub Photos and Hub Events got real admin UI** (§5.2, §4.3) — both models and their `/api/hub-photos`/`/api/hub-events` routes existed since the original hub system was built, but nothing in the frontend ever called them. `HubPhotos.tsx` and `HubEvents.tsx` (both new) close that gap. The public hub detail page's photo grid is now a Swiper slideshow instead of a static grid, and gained a `coordinatorImage` field for the hub coordinator's photo.
- **`HubEvent.eventType`** (new field, default `"Community"`) — the public MIL Hubs "Impact at a Glance" stats for "Training Sessions" and "Community Events" were previously hardcoded placeholder numbers; they're now computed live from real `HubEvent` rows filtered by this field.
- **Newsletter model brought in line with the other document models** — gained `description`, `image`, `published`, `updatedAt`, and a new `publishDate` field (lets an admin backdate an issue to when it actually went out, independent of `createdAt`). `Report` gained `image` too.
- **Program page sections gained image galleries and reordering** — `ProgramSection` (the JSON shape stored in `ProgramContent.sections`) gained an `images: string[]` field, reusing `ProjectGalleryPicker` (generalized with configurable label/help text) for the admin UI and `Lightbox` for the public gallery viewer. The admin "Add Section" button now **prepends** new sections to the front of the array instead of appending — this simultaneously fixed two complaints: new sections used to land at the bottom of a long admin form (requiring a scroll to find what you just added), and newest content used to display *last* on the public page (since the public renderer just walks the array in order). The 4 existing program pages' stored section order was also reversed once, retroactively, to match.
- **Homepage gained a "Knowledge Centre" slideshow** — shows the latest published item from Reports/Newsletters/Publications/Press Statements, positioned right after the Media Highlights section, using the same Swiper pattern as the existing "Recent Activities" carousel.
- **Homepage "Recent Activities" section reworked** — the category filter chip row above the carousel used to be a single non-functional "📋 All" pill (decorative only, nothing to filter by); it's now real, clickable category chips derived from actual activity data.
- **`Resources.tsx` (public `/resources` page) fixed twice in this round**: first, its "Latest Resources" cards opened the raw Cloudinary URL directly in a new tab (forcing a download instead of using `DocumentPreviewModal` like every other knowledge-centre page); then, its no-live-data fallback content (3 hardcoded placeholder cards) all linked to a `/documents/resource.pdf` file that doesn't exist in `public/documents/` — a real dead end reported by a site visitor. Both are fixed: it uses `DocumentPreviewModal` now, and the empty state is a plain "No resources have been added yet" message matching every other knowledge-centre page, not fake data.
- **Two latent field-name bugs fixed on `pages/mil/Hubs/HubDetail.tsx`**: the photo gallery read `photo.url` when the `HubPhoto` model's field is `imageUrl` (so photos silently never rendered, ever — this predates the August 2026 work and was only caught while building the new gallery slideshow), and the events list read `event.date` when the `HubEvent` model's field is `eventDate` (so event dates silently never rendered either).

### 18.1 Hub Photos/Hub Events: orphaned routes are no longer orphaned

The 2026-07-19 audit's "list of admin pages" implicitly assumed every mounted route had a frontend caller. `HubPhoto`/`HubEvent` were the one exception — real database models, real Express routes (`routes/hubPhotos.ts`, `routes/hubEvents.ts`), zero frontend code calling them, going back to whenever the hub system was originally built. If you're diffing this document against an older copy or against memory of the codebase, this is the one place where "no admin UI exists for X" flips to "it does now" — `pages/admin/HubPhotos.tsx` and `pages/admin/HubEvents.tsx`, both standalone list+inline-form pages (not nested inside `EditHub.tsx`), linked from the sidebar under "Media & Hubs".

### 18.2 New known issue: Cloudinary account-level PDF/ZIP delivery restriction

**Symptom**: a press statement (or any freshly-uploaded PDF) fails to preview or download, with the app's own `/media/proxy` route returning `502 {"message": "Failed to fetch file"}`.

**Root cause, confirmed by direct testing**: Cloudinary has an account-level security setting ("Restricted media types" / "Allow delivery of PDF and ZIP files", under the Cloudinary Console → Settings → Security) that, when off, blocks **unauthenticated delivery of `raw`-type resources** — the exact resource type this app uses for PDFs/Word docs (§3.9). A blocked request comes back `401 Unauthorized` with header `X-Cld-Error: deny or ACL failure`, which the backend's `/media/proxy` route (itself doing a server-side `fetch()` to Cloudinary) turns into a `502` for the browser.

This is **not** related to the file's extension or its Cloudinary `public_id` — that was the first, incorrect hypothesis during investigation (an earlier version of `routes/media.ts` embedded the file extension into the `public_id` for raw uploads, e.g. `.../abc123.pdf`; removing that embedding, which is now the shipped behavior described in §3.9, was a reasonable independent cleanup but **does not** fix this issue). The real signal: an older asset uploaded before this restriction was toggled on for the account still returns `200` (served from Cloudinary's CDN edge cache — confirmed via the `Server-Timing` response header showing a cache `hit`), while an identical fresh upload — with or without an extension in its URL — reliably returns `401` direct from origin.

**This is unresolved as of this document's last update.** Two ways to fix it, neither implemented yet:
1. **(Simplest)** Toggle "Allow delivery of PDF and ZIP files" on in the Cloudinary Console for this account. Zero code changes; takes effect immediately for both old and new files once toggled.
2. **(More robust, more work)** Switch raw-file delivery to Cloudinary's signed/authenticated URLs (`type: "authenticated"` + `cloudinary.utils.private_download_url()` or a signed delivery URL generated server-side per request) so delivery doesn't depend on this account-wide toggle at all. Not started.

Whoever operates the Cloudinary account for this project should check that setting before assuming "PDF preview is broken" is a code bug — it likely isn't.

### 18.3 New known issue: `tsc` does not actually run against `tsconfig.json` as committed

**Symptom**: running `npx tsc --noEmit -p .` from the frontend root fails immediately with:
```
tsconfig.json(15,25): error TS6046: Argument for '--moduleResolution' option must be: 'node', 'classic', 'node16', 'nodenext'.
tsconfig.json(17,5): error TS5070: Option '--resolveJsonModule' cannot be specified without 'node' module resolution strategy.
```
before checking a single file.

**Root cause**: `tsconfig.json`'s `moduleResolution: "bundler"` is a TypeScript 5.0+ feature; `typescript` in `package.json` is pinned to `4.9.5` (confirmed via `node_modules/.bin/tsc --version`). The installed compiler doesn't recognize the value at all and refuses to run.

**Practical implication**: any command that shells out to the frontend's own `tsc` — including a plain `npx tsc --noEmit` a developer might run to sanity-check their work — fails at the config-parsing stage, before it evaluates any source file. It is easy to mistake this for "no errors" if you only check the exit code or grep the output for a specific filename (the error is about `tsconfig.json` itself, not about any `.ts`/`.tsx` file, so a filename-scoped grep finds nothing and looks clean). **This does not necessarily mean type errors go completely unnoticed** — `react-scripts start`/`build` bundles its own `fork-ts-checker-webpack-plugin` wiring that may behave differently, and this was not independently verified either way during this session — but it does mean **a direct `tsc` invocation is not a trustworthy verification step in this repo today**, contrary to what a developer would normally assume.

**Not fixed as of this document's last update**, to avoid bundling an unrelated toolchain upgrade into unrelated feature work. Two ways to fix it:
1. Change `moduleResolution` in `tsconfig.json` to `"node"` (matches what CRA itself typically expects for TS 4.x) — smallest possible change, but should be verified against a real `npm run build` afterward in case anything in the codebase actually relies on `"bundler"` resolution semantics.
2. Upgrade `typescript` to `^5.x` — larger change, needs a full `npm run build` + manual smoke test afterward since CRA/react-scripts 5.0.1's own TypeScript support has known version-compatibility edges.

Either way: **before doing a large refactor or claiming "no type errors" anywhere in this codebase, verify which of the two is true first.**
