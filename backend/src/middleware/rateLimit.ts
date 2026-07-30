import rateLimit from "express-rate-limit";

/**
 * Guards the admin login endpoint against password brute-forcing.
 * Keyed by IP; deliberately strict since a legitimate user rarely
 * needs more than a handful of attempts.
 */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

/**
 * Guards forgot/reset-password against email-bombing an account and
 * against brute-forcing reset tokens.
 */
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
});

/**
 * Guards anonymous public-write endpoints (contact form, newsletter
 * subscribe, testimonials) against spam/abuse.
 */
export const publicWriteRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});
