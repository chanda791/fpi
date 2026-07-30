"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL ACTIVITIES
 */
router.get("/", async (req, res) => {
    try {
        const activities = await prisma_1.prisma.activity.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(activities);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch activities",
        });
    }
});
/**
 * GET SINGLE ACTIVITY
 */
router.get("/:id", async (req, res) => {
    try {
        const activity = await prisma_1.prisma.activity.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!activity) {
            return res.status(404).json({
                message: "Activity not found",
            });
        }
        res.json(activity);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch activity",
        });
    }
});
/**
 * CREATE ACTIVITY
 */
router.post("/", async (req, res) => {
    try {
        const { title, description, content, image, images, date, location, participants, category, program, published, } = req.body;
        const activity = await prisma_1.prisma.activity.create({
            data: {
                title,
                description,
                content,
                image,
                images: Array.isArray(images) ? images : [],
                date: new Date(date),
                location,
                participants,
                category,
                program,
                published,
            },
        });
        res.status(201).json(activity);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create activity",
        });
    }
});
/**
 * UPDATE ACTIVITY
 */
router.put("/:id", async (req, res) => {
    try {
        const { title, description, content, image, images, date, location, participants, category, program, published, } = req.body;
        const activity = await prisma_1.prisma.activity.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                title,
                description,
                content,
                image,
                images: Array.isArray(images) ? images : undefined,
                date: new Date(date),
                location,
                participants,
                category,
                program,
                published,
            },
        });
        res.json(activity);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update activity",
        });
    }
});
/**
 * DELETE ACTIVITY
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.activity.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Activity deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete activity",
        });
    }
});
exports.default = router;
//# sourceMappingURL=activities.js.map