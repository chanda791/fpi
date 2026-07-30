/*
  This migration fixes a real defect found in the existing migration history:
  migration `20260625124240_add_homepage_sections` created a "HomepageSection"
  table shaped (section, title, subtitle, content, image, buttonText, buttonLink).
  The very next schema change, `20260708133308_add_featured_and_user`, dropped
  that table entirely while adding the User table -- and no later migration
  ever recreated it. The current schema.prisma has always continued to declare
  a `HomepageSection` model (now shaped as section/data-json/published), so
  Prisma Client generates fully-typed methods for it, but any database that
  has applied every migration in order has NO "HomepageSection" table at all.
  Every call to GET/PUT /api/homepage (and therefore all five Homepage CMS
  section editors) fails at the database level with "relation does not exist"
  until this migration is applied.
*/

-- CreateTable
CREATE TABLE "HomepageSection" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSection_section_key" ON "HomepageSection"("section");
