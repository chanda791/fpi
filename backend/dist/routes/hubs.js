"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL HUBS
 */
router.get("/", async (req, res) => {
    try {
        const hubs = await prisma_1.prisma.hub.findMany({
            include: {
                province: true,
                photos: true,
                events: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(hubs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch hubs",
        });
    }
});
/**
 * GET SINGLE HUB (by numeric id, or by slug for the public site)
 */
router.get("/:id", async (req, res) => {
    try {
        const idParam = req.params.id;
        const numericId = Number(idParam);
        const isNumeric = !Number.isNaN(numericId);
        const hub = await prisma_1.prisma.hub.findUnique({
            where: isNumeric ? { id: numericId } : { slug: idParam },
            include: {
                province: true,
                photos: true,
                events: true,
            },
        });
        if (!hub) {
            return res.status(404).json({
                message: "Hub not found",
            });
        }
        res.json(hub);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch hub",
        });
    }
});
/**
 * CREATE HUB
 */
router.post("/", async (req, res) => {
    try {
        const hub = await prisma_1.prisma.hub.create({
            data: req.body,
        });
        res.status(201).json(hub);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create hub",
        });
    }
});
/**
 * UPDATE HUB
 */
router.put("/:id", async (req, res) => {
    try {
        const hub = await prisma_1.prisma.hub.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });
        res.json(hub);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update hub",
        });
    }
});
/**
 * DELETE HUB
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.hub.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Hub deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete hub",
        });
    }
});
exports.default = router;
//# sourceMappingURL=hubs.js.map