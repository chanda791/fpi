"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL NEWSLETTERS
 */
router.get("/", async (req, res) => {
    try {
        const newsletters = await prisma_1.prisma.newsletter.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(newsletters);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch newsletters",
        });
    }
});
/**
 * GET SINGLE NEWSLETTER
 */
router.get("/:id", async (req, res) => {
    try {
        const newsletter = await prisma_1.prisma.newsletter.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!newsletter) {
            return res.status(404).json({
                message: "Newsletter not found",
            });
        }
        res.json(newsletter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch newsletter",
        });
    }
});
/**
 * CREATE NEWSLETTER
 */
router.post("/", async (req, res) => {
    try {
        const { title, fileUrl } = req.body;
        const newsletter = await prisma_1.prisma.newsletter.create({
            data: {
                title,
                fileUrl,
            },
        });
        res.status(201).json(newsletter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create newsletter",
        });
    }
});
/**
 * UPDATE NEWSLETTER
 */
router.put("/:id", async (req, res) => {
    try {
        const newsletter = await prisma_1.prisma.newsletter.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });
        res.json(newsletter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update newsletter",
        });
    }
});
/**
 * DELETE NEWSLETTER
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.newsletter.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Newsletter deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete newsletter",
        });
    }
});
exports.default = router;
//# sourceMappingURL=newsletters.js.map