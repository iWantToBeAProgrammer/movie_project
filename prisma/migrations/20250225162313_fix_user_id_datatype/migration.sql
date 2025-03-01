/*
  Warnings:

  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WatchedMovie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,movieId]` on the table `WatchedMovie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `WatchedMovie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedMovie" DROP CONSTRAINT "WatchedMovie_userId_fkey";

-- DropIndex
DROP INDEX "WatchedMovie_userId_idx";

-- DropIndex
DROP INDEX "WatchedMovie_userId_movieId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WatchedMovie" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "WatchedMovie_user_id_idx" ON "WatchedMovie"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedMovie_user_id_movieId_key" ON "WatchedMovie"("user_id", "movieId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
