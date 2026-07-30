/*
  Warnings:

  - You are about to drop the column `bio` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `TeamMember` table. All the data in the column will be lost.
  - Added the required column `biography` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `TeamMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsibilities` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "bio",
DROP COLUMN "email",
DROP COLUMN "linkedin",
DROP COLUMN "name",
DROP COLUMN "order",
ADD COLUMN     "biography" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "responsibilities" JSONB NOT NULL;
