/*
  Warnings:

  - Made the column `user_id` on table `Watchlist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Watchlist" ALTER COLUMN "user_id" SET NOT NULL;
