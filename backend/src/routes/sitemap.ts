import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const STATIC_PATHS = [
  "/",
  "/about",
  "/team",
  "/contact",
  "/resources",
  "/partners",
  "/donors",
  "/sponsors",
  "/activities",
  "/programs",
  "/programs/advocacy",
  "/programs/media-literacy",
  "/programs/research",
  "/programs/capacity-building",
  "/knowledge/newsletters",
  "/knowledge/reports",
  "/knowledge/publications",
  "/knowledge/press-statements",
  "/mil/about",
  "/mil/brochure",
  "/mil/hubs",
  "/mil/hubs-overview",
  "/mil/radio-spots",
  "/projects/sherise",
  "/projects/funsani",
  "/projects/claim-your-space",
];

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });
}

function urlEntry(baseUrl: string, path: string, lastmod?: Date) {
  const loc = escapeXml(`${baseUrl}${path}`);
  const lastmodTag = lastmod
    ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
    : "";
  return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = (
      process.env.APP_PUBLIC_URL ||
      process.env.CORS_ORIGIN ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    const [activities, projects, hubs, provinces] = await Promise.all([
      prisma.activity.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.project.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.hub.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.province.findMany({
        select: { name: true },
      }),
    ]);

    const entries = [
      ...STATIC_PATHS.map((path) => urlEntry(baseUrl, path)),
      ...activities.map((a) =>
        urlEntry(baseUrl, `/activities/${a.id}`, a.updatedAt)
      ),
      ...projects.map((p) =>
        urlEntry(baseUrl, `/projects/${p.id}`, p.updatedAt)
      ),
      ...hubs.map((h) => urlEntry(baseUrl, `/mil/hub/${h.slug}`, h.updatedAt)),
      ...provinces.map((p) =>
        urlEntry(baseUrl, `/mil/province/${encodeURIComponent(p.name)}`)
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
      "\n"
    )}\n</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate sitemap" });
  }
});

export default router;
