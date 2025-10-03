/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Portfolio_userId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_slug_key" ON "Portfolio"("slug");

-- CreateIndex
CREATE INDEX "Portfolio_slug_idx" ON "Portfolio"("slug");
