/*
  Warnings:

  - You are about to drop the column `user_id` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the `WatchlistCollaborator` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'COLLABORATOR');

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistCollaborator" DROP CONSTRAINT "WatchlistCollaborator_userId_fkey";

-- DropForeignKey
ALTER TABLE "WatchlistCollaborator" DROP CONSTRAINT "WatchlistCollaborator_watchlistId_fkey";

-- DropIndex
DROP INDEX "Watchlist_user_id_idx";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "user_id",
ADD COLUMN     "token" TEXT NOT NULL;

-- DropTable
DROP TABLE "WatchlistCollaborator";

-- DropEnum
DROP TYPE "CollaboratorRole";

-- CreateTable
CREATE TABLE "watchlistMember" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "watchlistId" INTEGER NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'COLLABORATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "watchlistMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "watchlistMember_watchlistId_idx" ON "watchlistMember"("watchlistId");

-- CreateIndex
CREATE INDEX "watchlistMember_userId_idx" ON "watchlistMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "watchlistMember_userId_watchlistId_key" ON "watchlistMember"("userId", "watchlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_token_key" ON "Watchlist"("token");

-- AddForeignKey
ALTER TABLE "watchlistMember" ADD CONSTRAINT "watchlistMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlistMember" ADD CONSTRAINT "watchlistMember_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
