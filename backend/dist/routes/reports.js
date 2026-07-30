"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL REPORTS
 */
router.get("/", async (req, res) => {
    try {
        const reports = await prisma_1.prisma.report.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(reports);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch reports",
        });
    }
});
/**
 * GET SINGLE REPORT
 */
router.get("/:id", async (req, res) => {
    try {
        const report = await prisma_1.prisma.report.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        if (!report) {
            return res.status(404).json({
                message: "Report not found",
            });
        }
        res.json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch report",
        });
    }
});
/**
 * CREATE REPORT
 */
router.post("/", async (req, res) => {
    try {
        const { title, description, fileUrl, published } = req.body;
        const report = await prisma_1.prisma.report.create({
            data: {
                title,
                description,
                fileUrl,
                published,
            },
        });
        res.status(201).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create report",
        });
    }
});
/**
 * UPDATE REPORT
 */
router.put("/:id", async (req, res) => {
    try {
        const report = await prisma_1.prisma.report.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });
        res.json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update report",
        });
    }
});
/**
 * DELETE REPORT
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.report.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Report deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete report",
        });
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map