/*
  Warnings:

  - You are about to drop the column `userId` on the `Watchlist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_userId_fkey";

-- DropIndex
DROP INDEX "Watchlist_userId_idx";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE INDEX "Watchlist_user_id_idx" ON "Watchlist"("user_id");

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
