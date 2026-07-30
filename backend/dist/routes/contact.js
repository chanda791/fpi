"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const mailer_1 = require("../utils/mailer");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Admin: list messages
router.get("/", auth_1.requireAuth, async (req, res) => {
    try {
        const items = await prisma_1.prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
        res.json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});
// Public: send a contact message
router.post("/", rateLimit_1.publicWriteRateLimit, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email and message are required" });
        }
        // Always store the message so it's never lost, even if email fails
        await prisma_1.prisma.contactMessage.create({ data: { name, email, subject, message } });
        // Try to email the org's configured contact address
        const settings = await prisma_1.prisma.siteSettings.findFirst();
        const to = settings?.email;
        if (to) {
            await (0, mailer_1.sendMail)({
                to,
                subject: subject ? `Contact form: ${subject}` : `New contact form message from ${name}`,
                text: `From: ${name} <${email}>\n\n${message}`,
                html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
            });
        }
        res.status(201).json({ message: "Thank you! Your message has been received." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send message" });
    }
});
router.put("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        const item = await prisma_1.prisma.contactMessage.update({
            where: { id: Number(req.params.id) },
            data: { read: req.body.read },
        });
        res.json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update" });
    }
});
router.delete("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        await prisma_1.prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete" });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map