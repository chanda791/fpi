import { Router } from "express";
import { prisma } from "../lib/prisma";
import { sendMail } from "../utils/mailer";
import { requireAuth } from "../middleware/auth";
import { publicWriteRateLimit } from "../middleware/rateLimit";

const router = Router();

// Admin: list messages
router.get("/", requireAuth, async (req, res) => {
  try {
    const items = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Public: send a contact message
router.post("/", publicWriteRateLimit, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    // Always store the message so it's never lost, even if email fails
    await prisma.contactMessage.create({ data: { name, email, subject, message } });

    // Try to email the org's configured contact address
    const settings = await prisma.siteSettings.findFirst();
    const to = settings?.email;

    if (to) {
      await sendMail({
        to,
        subject: subject ? `Contact form: ${subject}` : `New contact form message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
      });
    }

    res.status(201).json({ message: "Thank you! Your message has been received." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const item = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { read: req.body.read },
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;
