/*
  Warnings:

  - You are about to drop the column `posterPath` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "posterPath",
DROP COLUMN "rating",
ADD COLUMN     "poster_path" TEXT,
ADD COLUMN     "vote_average" INTEGER;
