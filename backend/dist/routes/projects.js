"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL PROJECTS
 */
router.get("/", async (req, res) => {
    try {
        const projects = await prisma_1.prisma.project.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(projects);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch projects",
        });
    }
});
/**
 * GET SINGLE PROJECT
 */
router.get("/:id", async (req, res) => {
    try {
        const project = await prisma_1.prisma.project.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch project",
        });
    }
});
/**
 * CREATE PROJECT
 */
router.post("/", async (req, res) => {
    try {
        const { title, description, content, image, images, category, status, startDate, endDate, published, } = req.body;
        const project = await prisma_1.prisma.project.create({
            data: {
                title,
                description,
                content,
                image,
                images: Array.isArray(images) ? images : [],
                category,
                status,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                published,
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create project",
        });
    }
});
/**
 * UPDATE PROJECT
 */
router.put("/:id", async (req, res) => {
    try {
        const { id, createdAt, updatedAt, startDate, endDate, ...rest } = req.body;
        const data = { ...rest };
        // Coerce date fields: empty string -> null, otherwise a real Date
        if (startDate !== undefined) {
            data.startDate = startDate ? new Date(startDate) : null;
        }
        if (endDate !== undefined) {
            data.endDate = endDate ? new Date(endDate) : null;
        }
        const project = await prisma_1.prisma.project.update({
            where: {
                id: Number(req.params.id),
            },
            data,
        });
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update project",
        });
    }
});
/**
 * DELETE PROJECT
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.project.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Project deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete project",
        });
    }
});
exports.default = router;
//# sourceMappingURL=projects.js.map