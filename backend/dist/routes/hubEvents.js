"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
/**
 * GET ALL HUB EVENTS
 */
router.get("/", async (req, res) => {
    try {
        const events = await prisma_1.prisma.hubEvent.findMany({
            include: {
                hub: true,
            },
            orderBy: {
                eventDate: "desc",
            },
        });
        res.json(events);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch events",
        });
    }
});
/**
 * CREATE EVENT
 */
router.post("/", async (req, res) => {
    try {
        const { title, description, eventDate, hubId, } = req.body;
        const event = await prisma_1.prisma.hubEvent.create({
            data: {
                title,
                description,
                eventDate: new Date(eventDate),
                hubId,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create event",
        });
    }
});
/**
 * UPDATE EVENT
 */
router.put("/:id", async (req, res) => {
    try {
        const { title, description, eventDate, hubId, } = req.body;
        const event = await prisma_1.prisma.hubEvent.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                title,
                description,
                eventDate: new Date(eventDate),
                hubId,
            },
        });
        res.json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update event",
        });
    }
});
/**
 * DELETE EVENT
 */
router.delete("/:id", async (req, res) => {
    try {
        await prisma_1.prisma.hubEvent.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Event deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete event",
        });
    }
});
exports.default = router;
//# sourceMappingURL=hubEvents.js.map