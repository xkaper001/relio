/*
  Warnings:

  - A unique constraint covering the columns `[userId,slug]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Portfolio_userId_key";

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'My Portfolio';

-- CreateIndex
CREATE INDEX "Portfolio_userId_idx" ON "Portfolio"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_slug_key" ON "Portfolio"("userId", "slug");
