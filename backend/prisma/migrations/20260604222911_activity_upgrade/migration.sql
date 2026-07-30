/*
  Warnings:

  - Made the column `participants` on table `Activity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "program" TEXT,
ALTER COLUMN "participants" SET NOT NULL;
