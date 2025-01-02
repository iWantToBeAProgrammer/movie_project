import { getMovieData } from "./api-libs";
import { prisma } from "./prisma";
export async function getMovieDetails(tmdbId) {
  const movie = await prisma.movie.findUnique({
    where: { tmdbId },
  });

  if (!movie) {
    // Fetch from TMDB if not in database
    const tmdbMovie = await getMovieData(tmdbId, "&language=en-US");

    if (!tmdbMovie || !tmdbMovie.id) {
      throw new Error(`Movie with ID ${tmdbId} not found on TMDB.`);
    }

    return await prisma.movie.create({
      data: {
        tmdbId: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        posterPath: tmdbMovie.poster_path,
      },
    });
  }

  return movie;
}
