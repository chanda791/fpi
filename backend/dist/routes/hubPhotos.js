"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL HUB PHOTOS
 */
router.get("/", async (req, res) => {
    try {
        const photos = await prisma_1.prisma.hubPhoto.findMany({
            include: {
                hub: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(photos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch photos" });
    }
});
/**
 * CREATE PHOTO
 */
router.post("/", async (req, res) => {
    try {
        const photo = await prisma_1.prisma.hubPhoto.create({
            data: req.body,
        });
        res.status(201).json(photo);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create photo" });
    }
});
/**
 * DELETE PHOTO
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.hubPhoto.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Photo deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete photo" });
    }
});
exports.default = router;
//# sourceMappingURL=hubPhotos.js.map