import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { publicWriteRateLimit } from "../middleware/rateLimit";

const router = Router();

// Public: only approved testimonials. ?all=true additionally returns
// unapproved ones, so that variant requires an authenticated admin --
// enforced here rather than unconditionally, since the base route must
// stay open to anonymous visitors.
router.get(
  "/",
  (req, res, next) => {
    if (req.query.all === "true") {
      return requireAuth(req, res, next);
    }

    next();
  },
  async (req, res) => {
    try {
      const showAll = req.query.all === "true";
      const items = await prisma.testimonial.findMany({
        where: showAll ? {} : { approved: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  }
);

// Public: submit a testimonial (starts unapproved)
router.post("/", publicWriteRateLimit, async (req, res) => {
  try {
    const { name, role, message, photo, rating } = req.body;
    if (!name || !message) {
      return res.status(400).json({ message: "Name and message are required" });
    }
    const item = await prisma.testimonial.create({
      data: { name, role, message, photo, rating: rating || 5, approved: false },
    });
    res.status(201).json({ message: "Thank you! Your comment will appear once approved.", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const item = await prisma.testimonial.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete" });
  }
});

export default router;
