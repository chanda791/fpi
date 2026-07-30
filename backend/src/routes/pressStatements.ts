import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL PRESS STATEMENTS
 */
router.get("/", async (req, res) => {
  try {
    const statements = await prisma.pressStatement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(statements);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch press statements",
    });
  }
});

/**
 * GET SINGLE PRESS STATEMENT
 */
router.get("/:id", async (req, res) => {
  try {
    const statement = await prisma.pressStatement.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!statement) {
      return res.status(404).json({
        message: "Press statement not found",
      });
    }

    res.json(statement);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch press statement",
    });
  }
});

/**
 * CREATE PRESS STATEMENT
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, fileUrl, published } = req.body;

    const statement = await prisma.pressStatement.create({
      data: {
        title,
        description,
        fileUrl,
        published,
      },
    });

    res.status(201).json(statement);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create press statement",
    });
  }
});

/**
 * UPDATE PRESS STATEMENT
 */
router.put("/:id", async (req, res) => {
  try {
    const statement = await prisma.pressStatement.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.json(statement);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update press statement",
    });
  }
});

/**
 * DELETE PRESS STATEMENT
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.pressStatement.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Press statement deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete press statement",
    });
  }
});

export default router;