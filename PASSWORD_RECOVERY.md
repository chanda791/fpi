# Password Recovery — How It Actually Works

Explains the CMS's "Forgot password" flow end to end: what triggers it, where the email comes from, and what to check when it doesn't seem to be working. Referenced from `README.md`.

## The short version

1. Admin clicks "Forgot password" on `/admin/login`, enters their email.
2. Backend creates a one-hour reset token and emails a link to `/admin/reset-password?token=...`.
3. Admin opens the link, sets a new password.

**SMTP is not configured via environment variables.** It's set inside the CMS itself, under `Admin → Settings → SMTP`, stored in the `SiteSettings` database table. There is no `SMTP_HOST`/`SMTP_USER`/etc. environment variable anywhere in this codebase — if you go looking for one to set on your hosting provider, it doesn't exist, and adding one won't do anything unless you also change `backend/src/utils/mailer.ts` to read it.

## Step by step

**1. Request** — `POST /api/auth/forgot-password`, body `{email}` (`src/pages/admin/ForgotPassword.tsx` → `services/auth.ts`).
- Rate-limited to 5 requests/hour per IP.
- Always returns the same generic success message, whether or not the email matches a real account — this is deliberate, so the endpoint can't be used to check which emails have admin accounts.
- If the email *does* match an active `User`: generates a 32-byte random hex token, stores it in the `PasswordResetToken` table with a 1-hour expiry, and calls `sendMail()`.

**2. The email** — built in `backend/src/routes/auth.ts`. The link is:
```
{APP_PUBLIC_URL or CORS_ORIGIN, first entry if comma-separated, or http://localhost:3000}/admin/reset-password?token={the token}
```
So **`APP_PUBLIC_URL` must be set to your real frontend domain in production**, or the reset link in the email will point at the wrong place (or `localhost`, which is useless to anyone but a local developer).

**3. If SMTP isn't configured** — `sendMail()` (`backend/src/utils/mailer.ts`) reads its config from the `SiteSettings` table on every call, not from env vars. If `smtpHost` isn't set, it doesn't throw or fail the request — it logs the would-be email to the **server console** and returns `{sent: false}`. The `/forgot-password` route handles this gracefully (still returns its generic success message either way), which means:
- The requesting admin sees no error, even though no email was actually sent.
- **The only way to get the reset link in that state is to read the backend's server logs**, where it's printed as: `[auth] Password reset link for <email>: <link>`.
- This is why, on a brand-new deployment before SMTP is configured, "forgot password" quietly does nothing visible — check the logs, or configure SMTP first.

**4. Configuring SMTP** — `Admin → Settings → SMTP`, fields: host, port, username, password, from-email, from-name. Any standard SMTP provider (Gmail app password, SendGrid, Mailgun, etc.) works — nothing in the code is provider-specific. Once saved, `sendMail()` picks it up on the very next call; no restart needed (it reads the `SiteSettings` row fresh each time, not a cached value).

**5. Completing the reset** — `POST /api/auth/reset-password`, body `{token, password}` (`src/pages/admin/ResetPassword.tsx`).
- Rate-limited to 5 requests/hour per IP.
- Rejects if the token doesn't exist, has already been used (`usedAt` is set), or has expired (`expiresAt` passed) — `400` in all three cases, with the same generic-ish error so as not to leak which specific reason applied.
- Rejects passwords under 8 characters.
- On success: updates the user's password (hashed with PBKDF2, see `ARCHITECTURE_AND_HANDOVER.md` §9.1) and stamps the token's `usedAt`, in a single `prisma.$transaction` so a crash mid-way can't leave the token consumed without the password actually changing (or vice versa).

## The bootstrap admin account is a special case

If you're logged in (or trying to log in) as the `ADMIN_EMAIL`/`ADMIN_PASSWORD` env-var-based bootstrap account rather than a real `User` row in the database, **this whole flow doesn't apply to you** — that account isn't a database row, so there's nothing for `forgot-password` to find or reset. To "reset" the bootstrap account's password, change the `ADMIN_PASSWORD` environment variable on the backend host and redeploy/restart. This is also why `PUT /api/auth/change-password` (the logged-in "change my password" flow, distinct from the forgot-password flow) explicitly rejects the bootstrap account — it has no password hash in the database to change.

## Troubleshooting checklist

- **"Forgot password" seems to do nothing**: check `Admin → Settings → SMTP` is actually filled in. If not, check the backend server console logs for the `[auth] Password reset link for ...` line instead.
- **Reset link points to the wrong domain / localhost**: `APP_PUBLIC_URL` (or `CORS_ORIGIN` as its fallback) isn't set to your real frontend URL on the backend host.
- **"This link is invalid or expired" on a link that looks recent**: links expire after exactly 1 hour, and a token can only be used once (a second click on the same email link, after already resetting, will show this too).
- **Trying to reset the bootstrap admin's password**: you can't, via this flow — see above. Change `ADMIN_PASSWORD` on the host instead.
