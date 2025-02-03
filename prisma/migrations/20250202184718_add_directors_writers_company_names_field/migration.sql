/*
  Warnings:

  - The `directors` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "companyNames" TEXT[],
ADD COLUMN     "writers" TEXT[],
DROP COLUMN "directors",
ADD COLUMN     "directors" TEXT[];
