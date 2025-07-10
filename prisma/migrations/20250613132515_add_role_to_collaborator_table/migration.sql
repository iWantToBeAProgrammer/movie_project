-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('OWNER', 'COLLABORATOR');

-- AlterTable
ALTER TABLE "Watchlist" ALTER COLUMN "isPublic" SET DEFAULT true;

-- AlterTable
ALTER TABLE "WatchlistCollaborator" ADD COLUMN     "role" "CollaboratorRole" NOT NULL DEFAULT 'COLLABORATOR';
