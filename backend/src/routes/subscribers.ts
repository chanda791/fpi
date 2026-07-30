import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sendMail } from "../utils/mailer";
import { requireAuth } from "../middleware/auth";
import { publicWriteRateLimit } from "../middleware/rateLimit";

const router = Router();

// Admin: list subscribers
router.get("/", requireAuth, async (req, res) => {
  try {
    const items = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

// Public: subscribe (footer form)
router.post("/", publicWriteRateLimit, async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return res.json({ message: "You're already subscribed. Thank you!" });
    }

    await prisma.subscriber.create({ data: { email, name } });
    res.status(201).json({ message: "Subscribed successfully. Thank you!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.subscriber.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove" });
  }
});

// Admin: broadcast a message to all active subscribers
router.post("/broadcast", requireAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const subscribers = await prisma.subscriber.findMany({ where: { active: true } });
    if (subscribers.length === 0) {
      return res.json({ message: "No active subscribers to send to.", sent: 0 });
    }

    let sent = 0;
    let smtpConfigured = true;

    for (const sub of subscribers) {
      const result = await sendMail({
        to: sub.email,
        subject,
        text: message,
        html: `<div style="font-family:sans-serif;line-height:1.6">${message.replace(/\n/g, "<br/>")}</div>`,
      });
      if (result.sent) sent++;
      else smtpConfigured = false;
    }

    if (!smtpConfigured) {
      return res.json({
        message: "SMTP is not configured, so no emails were sent. Configure SMTP in Settings to enable broadcasts.",
        sent: 0,
        total: subscribers.length,
      });
    }

    res.json({ message: `Broadcast sent to ${sent} subscriber(s).`, sent, total: subscribers.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to broadcast" });
  }
});

export default router;
