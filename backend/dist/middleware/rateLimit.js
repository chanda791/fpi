"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicWriteRateLimit = exports.passwordResetRateLimit = exports.loginRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Guards the admin login endpoint against password brute-forcing.
 * Keyed by IP; deliberately strict since a legitimate user rarely
 * needs more than a handful of attempts.
 */
exports.loginRateLimit = (0, express_rate_limit_1.default)({
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
exports.passwordResetRateLimit = (0, express_rate_limit_1.default)({
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
exports.publicWriteRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again later." },
});
//# sourceMappingURL=rateLimit.js.map