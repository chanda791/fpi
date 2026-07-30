/*
  Fixes a second instance of the same defect found in the HomepageSection
  migration (see 20260712190000_recreate_homepage_sections): schema.prisma
  has declared `width`, `height`, `caption`, and `folder` on the Media model,
  but no migration in this project's history ever actually added these
  columns to the database. `folder` has a @default value, which Prisma
  applies on every insert -- so every media upload was failing with:

    PrismaClientKnownRequestError: The column `folder` does not exist in
    the current database. (P2022)

  `width`/`height`/`caption` have no default and are nullable, and nothing
  currently writes to them, so they hadn't yet caused a visible error -- but
  they were equally missing and would fail the same way the moment any code
  path (e.g. a future Media Library caption/rename feature) writes to them.
*/

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "width" INTEGER,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "caption" TEXT,
ADD COLUMN     "folder" TEXT DEFAULT 'General';
