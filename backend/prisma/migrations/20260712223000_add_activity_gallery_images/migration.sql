/*
  Adds real multi-image gallery support to Activities. Previously the public
  Activity Detail page's "Activity Gallery" section was hardcoded to repeat
  the single `image` field three times ([1, 2, 3].map(() => <img src={heroImage} />)),
  since there was nowhere in the database to store more than one image per
  activity. This adds a proper array column so admins can attach any number
  of additional gallery images.
*/

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
