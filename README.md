# FPI Zambia Website and CMS

Full-stack website and content management system for Free Press Initiative Zambia.

## Stack

- Frontend: React, TypeScript, Tailwind CSS, Create React App
- Backend: Express, TypeScript, Prisma
- Database: PostgreSQL
- Uploads: local backend `src/uploads` directory in development

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL database

## Environment Setup

Create the frontend environment file:

```bash
cp .env.example .env
```

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with your real database URL and admin login:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=use-a-long-random-secret
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

For local development, keep:

```env
REACT_APP_API_URL=http://localhost:5000/api
APP_BASE_URL=http://localhost:5000
APP_PUBLIC_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

`APP_PUBLIC_URL` is used to build password-reset links (falls back to `CORS_ORIGIN` if unset). SMTP for password-reset emails is configured from within the CMS itself (**Settings → SMTP**), not via environment variables — see `PASSWORD_RECOVERY.md`.

For production, set those values to your deployed frontend and backend URLs.

## Install

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Database

Run Prisma migrations from the backend folder:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

For a local development database, you can use:

```bash
npx prisma migrate dev
```

## Run Locally

Start the backend:

```bash
npm run backend:dev
```

In another terminal, start the frontend:

```bash
npm start
```

Open:

- Website: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- API health: `http://localhost:5000`

Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env` to sign in.

## Build

Build the frontend:

```bash
npm run build
```

Build the backend:

```bash
npm run backend:build
```

Run the compiled backend:

```bash
npm run backend:start
```

## Deployment Notes

The frontend and backend are separate apps.

Frontend:

- Deploy the root project to Vercel, Netlify, or similar.
- Set `REACT_APP_API_URL` to your backend URL, for example `https://api.example.com/api`.

Backend:

- Deploy the `backend` folder to Render, Railway, Fly.io, a VPS, or another Node host.
- Set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `APP_BASE_URL`, and `CORS_ORIGIN`.
- Use persistent storage or external object storage for uploads in production.

## Security

- Admin create/update/delete/upload API requests require a bearer token.
- Public read-only API requests remain open.
- Change `JWT_SECRET` and `ADMIN_PASSWORD` before production.
- Restrict `CORS_ORIGIN` to the real frontend domain in production.
"# fpi" 
"# fpi" 
