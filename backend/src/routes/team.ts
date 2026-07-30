import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

/**
 * GET ALL TEAM MEMBERS
 */
router.get("/", async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch team members",
    });
  }
});

/**
 * GET SINGLE TEAM MEMBER
 */
router.get("/:id", async (req, res) => {
  try {
    const member = await prisma.teamMember.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch team member",
    });
  }
});

/**
 * CREATE TEAM MEMBER
 */
router.post("/", async (req, res) => {
  try {
    const member = await prisma.teamMember.create({
      data: req.body,
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create team member",
    });
  }
});

/**
 * UPDATE TEAM MEMBER
 */
router.put("/:id", async (req, res) => {
  try {
    const member = await prisma.teamMember.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update team member",
    });
  }
});

/**
 * DELETE TEAM MEMBER
 */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.teamMember.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete team member",
    });
  }
});

export default router;