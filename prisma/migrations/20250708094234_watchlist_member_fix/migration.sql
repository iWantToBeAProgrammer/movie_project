/*
  Warnings:

  - A unique constraint covering the columns `[watchlistId]` on the table `watchlistMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "watchlistMember_userId_watchlistId_key";

-- CreateIndex
CREATE UNIQUE INDEX "watchlistMember_watchlistId_key" ON "watchlistMember"("watchlistId");
