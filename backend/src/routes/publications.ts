import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL PUBLICATIONS
 */
router.get("/", async (req, res) => {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(publications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch publications",
    });
  }
});

/**
 * GET SINGLE PUBLICATION
 */
router.get("/:id", async (req, res) => {
  try {
    const publication = await prisma.publication.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!publication) {
      return res.status(404).json({
        message: "Publication not found",
      });
    }

    res.json(publication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch publication",
    });
  }
});

/**
 * CREATE PUBLICATION
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, fileUrl, image, published } = req.body;

    const publication = await prisma.publication.create({
      data: {
        title,
        description,
        fileUrl,
        image,
        published,
      },
    });

    res.status(201).json(publication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create publication",
    });
  }
});

/**
 * UPDATE PUBLICATION
 */
router.put("/:id", async (req, res) => {
  try {
    const { title, description, fileUrl, image, published } = req.body;

    const publication = await prisma.publication.update({
      where: {
        id: Number(req.params.id),
      },
      data: { title, description, fileUrl, image, published },
    });

    res.json(publication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update publication",
    });
  }
});

/**
 * DELETE PUBLICATION
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.publication.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Publication deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete publication",
    });
  }
});

export default router;