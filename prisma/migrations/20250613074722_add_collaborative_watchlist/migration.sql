/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "inviteToken" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "WatchlistCollaborator" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "watchlistId" INTEGER NOT NULL,

    CONSTRAINT "WatchlistCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WatchlistCollaborator_watchlistId_idx" ON "WatchlistCollaborator"("watchlistId");

-- CreateIndex
CREATE INDEX "WatchlistCollaborator_userId_idx" ON "WatchlistCollaborator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistCollaborator_userId_watchlistId_key" ON "WatchlistCollaborator"("userId", "watchlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_inviteToken_key" ON "Watchlist"("inviteToken");

-- AddForeignKey
ALTER TABLE "WatchlistCollaborator" ADD CONSTRAINT "WatchlistCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistCollaborator" ADD CONSTRAINT "WatchlistCollaborator_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
