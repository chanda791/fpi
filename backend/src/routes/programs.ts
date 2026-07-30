import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const DEFAULTS: Record<string, any> = {
  advocacy: { title: "Advocacy", subtitle: "Championing media freedom and access to information" },
  "media-literacy": { title: "Media & Information Literacy", subtitle: "Building critical media skills across Zambia" },
  research: { title: "Research", subtitle: "Evidence to inform policy and practice" },
  "capacity-building": { title: "Capacity Building", subtitle: "Strengthening journalists and civil society" },
};

// List all
router.get("/", async (req, res) => {
  try {
    const items = await prisma.programContent.findMany({ orderBy: { id: "asc" } });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch programs" });
  }
});

// Get one by slug (auto-creates a default if missing so pages never break)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    let item = await prisma.programContent.findUnique({ where: { slug } });

    if (!item && DEFAULTS[slug]) {
      item = await prisma.programContent.create({
        data: { slug, title: DEFAULTS[slug].title, subtitle: DEFAULTS[slug].subtitle, sections: [] },
      });
    }

    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch program" });
  }
});

// Update by slug (upsert)
router.put("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { id, createdAt, updatedAt, ...data } = req.body;

    const item = await prisma.programContent.upsert({
      where: { slug },
      update: data,
      create: { slug, title: data.title || slug, ...data },
    });

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update program" });
  }
});

export default router;
