import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";

interface SendResult {
  sent: boolean;
  reason?: string;
}

/**
 * Attempts to send an email using the SMTP settings stored in SiteSettings.
 * If SMTP isn't configured, logs the message to the server console instead
 * of failing, and returns { sent: false } so the caller can tell the admin
 * to retrieve the link manually (see PASSWORD_RECOVERY.md).
 */
export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<SendResult> {
  const settings = await prisma.siteSettings.findFirst();

  if (!settings?.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
    console.log(
      "[mailer] SMTP is not configured -- not sending email. " +
        "Message that would have been sent:\n" +
        `To: ${options.to}\nSubject: ${options.subject}\n\n${options.text}`
    );

    return { sent: false, reason: "SMTP is not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    console.error("[mailer] Failed to send email:", error);

    return { sent: false, reason: "SMTP send failed" };
  }
}
