import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL HUBS
 */
router.get("/", async (req, res) => {
  try {
    const hubs = await prisma.hub.findMany({
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
  } catch (error) {
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

    const hub = await prisma.hub.findUnique({
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
  } catch (error) {
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
    const hub = await prisma.hub.create({
      data: req.body,
    });

    res.status(201).json(hub);
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "A hub with that slug already exists. Please choose a different slug.",
      });
    }

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
    const hub = await prisma.hub.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.json(hub);
  } catch (error) {
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
    await prisma.hub.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Hub deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete hub",
    });
  }
});

export default router;