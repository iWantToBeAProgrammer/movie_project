-- CreateTable
CREATE TABLE "WatchedMovie" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WatchedMovie_userId_movieId_key" ON "WatchedMovie"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedMovie" ADD CONSTRAINT "WatchedMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
