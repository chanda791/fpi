import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await prisma.donor.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch donors" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.donor.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch item" });
  }
});

router.post("/", async (req, res) => {
  try {
    const item = await prisma.donor.create({ data: req.body });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create item" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const item = await prisma.donor.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update item" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.donor.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

export default router;
