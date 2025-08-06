-- CreateTable
CREATE TABLE "SavedWatchlist" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "watchlistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedWatchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedWatchlist_user_id_watchlistId_key" ON "SavedWatchlist"("user_id", "watchlistId");

-- AddForeignKey
ALTER TABLE "SavedWatchlist" ADD CONSTRAINT "SavedWatchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWatchlist" ADD CONSTRAINT "SavedWatchlist_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "Watchlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
