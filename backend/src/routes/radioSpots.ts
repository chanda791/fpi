import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL RADIO SPOTS
 */
router.get("/", async (req, res) => {
  try {
    const radioSpots = await prisma.radioSpot.findMany({
      orderBy: {
        broadcastAt: "desc",
      },
    });

    res.json(radioSpots);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch radio spots",
    });
  }
});

/**
 * GET SINGLE RADIO SPOT
 */
router.get("/:id", async (req, res) => {
  try {
    const radioSpot = await prisma.radioSpot.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!radioSpot) {
      return res.status(404).json({
        message: "Radio spot not found",
      });
    }

    res.json(radioSpot);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch radio spot",
    });
  }
});

/**
 * CREATE RADIO SPOT
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      station,
      duration,
      image,
      audioUrl,
      published,
      broadcastAt,
    } = req.body;

    const radioSpot = await prisma.radioSpot.create({
      data: {
        title,
        description,
        station,
        duration,
        image,
        audioUrl,
        published,
        broadcastAt: new Date(broadcastAt),
      },
    });

    res.status(201).json(radioSpot);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create radio spot",
    });
  }
});

/**
 * UPDATE RADIO SPOT
 */
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      station,
      duration,
      image,
      audioUrl,
      published,
      broadcastAt,
    } = req.body;

    const radioSpot = await prisma.radioSpot.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title,
        description,
        station,
        duration,
        image,
        audioUrl,
        published,
        broadcastAt: new Date(broadcastAt),
      },
    });

    res.json(radioSpot);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update radio spot",
    });
  }
});

/**
 * DELETE RADIO SPOT
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.radioSpot.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Radio spot deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete radio spot",
    });
  }
});

export default router;