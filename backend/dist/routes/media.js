"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
const appBaseUrl = process.env.APP_BASE_URL || "";
function mediaUrl(filename) {
    const relativeUrl = `/uploads/${filename}`;
    return appBaseUrl ? `${appBaseUrl}${relativeUrl}` : relativeUrl;
}
/**
 * GET ALL MEDIA
 */
router.get("/", async (_req, res) => {
    try {
        const media = await prisma_1.prisma.media.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(media);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch media",
        });
    }
});
/**
 * GET SINGLE MEDIA
 */
router.get("/:id", async (req, res) => {
    try {
        const media = await prisma_1.prisma.media.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!media) {
            return res.status(404).json({
                message: "Media not found",
            });
        }
        res.json(media);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch media",
        });
    }
});
/**
 * UPLOAD MEDIA
 */
router.post("/", upload_1.upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }
        const media = await prisma_1.prisma.media.create({
            data: {
                filename: req.file.filename,
                originalName: req.body.originalName ||
                    req.file.originalname,
                url: mediaUrl(req.file.filename),
                mimeType: req.file.mimetype,
                size: req.file.size,
                alt: req.body.alt || "",
                description: req.body.description || "",
            },
        });
        res.status(201).json(media);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to upload media",
        });
    }
});
/**
 * UPDATE MEDIA
 */
router.put("/:id", async (req, res) => {
    try {
        const media = await prisma_1.prisma.media.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                originalName: req.body.originalName,
                alt: req.body.alt,
                description: req.body.description,
            },
        });
        res.json(media);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update media",
        });
    }
});
/**
 * DELETE MEDIA
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.media.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Media deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete media",
        });
    }
});
exports.default = router;
//# sourceMappingURL=media.js.map