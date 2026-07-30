import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL PROVINCES
 */
router.get("/", async (req, res) => {
  try {
    const provinces = await prisma.province.findMany({
      include: {
        hubs: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(provinces);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch provinces",
    });
  }
});

/**
 * GET SINGLE PROVINCE
 */
router.get("/:id", async (req, res) => {
  try {
    const province = await prisma.province.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        hubs: true,
      },
    });

    if (!province) {
      return res.status(404).json({
        message: "Province not found",
      });
    }

    res.json(province);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch province",
    });
  }
});

/**
 * CREATE PROVINCE
 */
router.post("/", async (req, res) => {
  try {
    const province = await prisma.province.create({
      data: {
        name: req.body.name,
      },
    });

    res.status(201).json(province);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create province",
    });
  }
});

/**
 * UPDATE PROVINCE
 */
router.put("/:id", async (req, res) => {
  try {
    const province = await prisma.province.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
      },
    });

    res.json(province);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update province",
    });
  }
});

/**
 * DELETE PROVINCE
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.province.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Province deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete province",
    });
  }
});

export default router;