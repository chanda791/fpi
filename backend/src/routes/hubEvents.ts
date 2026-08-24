import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL HUB EVENTS
 */
router.get("/", async (req, res) => {
  try {
    const events = await prisma.hubEvent.findMany({
      include: {
        hub: true,
      },
      orderBy: {
        eventDate: "desc",
      },
    });

    res.json(events);
  } catch (error) {
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
    const {
      title,
      description,
      eventType,
      eventDate,
      hubId,
    } = req.body;

    const event = await prisma.hubEvent.create({
      data: {
        title,
        description,
        eventType,
        eventDate: new Date(eventDate),
        hubId,
      },
    });

    res.status(201).json(event);
  } catch (error) {
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
    const {
      title,
      description,
      eventType,
      eventDate,
      hubId,
      completed,
    } = req.body;

    const data: Record<string, unknown> = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (eventType !== undefined) data.eventType = eventType;
    if (eventDate !== undefined) data.eventDate = new Date(eventDate);
    if (hubId !== undefined) data.hubId = hubId;
    if (completed !== undefined) data.completed = completed;

    const event = await prisma.hubEvent.update({
      where: {
        id: Number(req.params.id),
      },
      data,
    });

    res.json(event);
  } catch (error) {
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
    await prisma.hubEvent.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete event",
    });
  }
});

export default router;