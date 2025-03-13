-- CreateTable
CREATE TABLE "favoriteMovie" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "movieId" INTEGER NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoriteMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favoriteMovie_user_id_idx" ON "favoriteMovie"("user_id");

-- CreateIndex
CREATE INDEX "favoriteMovie_movieId_idx" ON "favoriteMovie"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "favoriteMovie_user_id_movieId_key" ON "favoriteMovie"("user_id", "movieId");

-- AddForeignKey
ALTER TABLE "favoriteMovie" ADD CONSTRAINT "favoriteMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoriteMovie" ADD CONSTRAINT "favoriteMovie_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
