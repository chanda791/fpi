/*
  Adds real multi-image gallery support to Projects, matching the same fix
  already applied to Activities (20260712223000_add_activity_gallery_images).
  The public Project Detail page's "Project Gallery" section is hardcoded to
  repeat the single `image` field three times; this column gives it
  somewhere real to read from.
*/

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
