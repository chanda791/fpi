"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma_1 = require("../lib/prisma");
/**
 * Attempts to send an email using the SMTP settings stored in SiteSettings.
 * If SMTP isn't configured, logs the message to the server console instead
 * of failing, and returns { sent: false } so the caller can tell the admin
 * to retrieve the link manually (see PASSWORD_RECOVERY.md).
 */
async function sendMail(options) {
    const settings = await prisma_1.prisma.siteSettings.findFirst();
    if (!settings?.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
        console.log("[mailer] SMTP is not configured -- not sending email. " +
            "Message that would have been sent:\n" +
            `To: ${options.to}\nSubject: ${options.subject}\n\n${options.text}`);
        return { sent: false, reason: "SMTP is not configured" };
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: settings.smtpHost,
            port: settings.smtpPort || 587,
            secure: settings.smtpPort === 465,
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPassword,
            },
        });
        await transporter.sendMail({
            from: settings.smtpFromEmail
                ? `"${settings.smtpFromName || settings.organisation}" <${settings.smtpFromEmail}>`
                : settings.smtpUser,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        return { sent: true };
    }
    catch (error) {
        console.error("[mailer] Failed to send email:", error);
        return { sent: false, reason: "SMTP send failed" };
    }
}
//# sourceMappingURL=mailer.js.map