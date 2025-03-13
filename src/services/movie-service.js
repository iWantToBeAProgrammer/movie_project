import { getMovieData } from "../libs/api-libs";
import { prisma } from "../libs/prisma";

export async function getMovieDetails(tmdbId) {
  const movie = await prisma.movie.findUnique({
    where: { tmdbId },
  });

  if (!movie) {
    const tmdbMovie = await getMovieData(
      tmdbId,
      "&language=en-US&append_to_response=release_dates,credits,videos"
    );

    if (!tmdbMovie || !tmdbMovie.id) {
      throw new Error(`Movie with ID ${tmdbId} not found on TMDB.`);
    }

    const cast = tmdbMovie.credits.cast.map((actor) => ({
      name: actor.name,
      profile_path: actor.profile_path,
      character: actor.character,
    }));

    const genres = tmdbMovie.genres.map((genre) => genre.name);

    const certification =
      tmdbMovie.release_dates?.results.find(
        (result) => result.iso_3166_1 === "ID"
      )?.release_dates[0]?.certification || "";

    const directors = tmdbMovie.credits.crew
      .filter((member) => member.job === "Director")
      .map((director) => director.name);

    const writers = tmdbMovie.credits.crew
      .filter((member) => member.department === "Writing")
      .map((writer) => writer.name);

    const companyNames = tmdbMovie.production_companies.map(
      (company) => company.name
    );

    const movieTrailer = tmdbMovie.videos.results
      .filter((result) => result.type === "Trailer")
      .slice(0, 1);

    const vote_average = parseInt(tmdbMovie.vote_average.toFixed(2), 10);

    const releaseDates = tmdbMovie.release_dates?.results.find(
      (result) => result.iso_3166_1 === "ID"
    )?.release_dates[0]?.release_date;

    return await prisma.movie.create({
      data: {
        tmdbId: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        posterPath: tmdbMovie.poster_path,
        backdropPath: tmdbMovie.backdrop_path,
        overview: tmdbMovie.overview,
        genres: genres,
        certification: certification,
        releaseDates: releaseDates || null,
        runtime: tmdbMovie.runtime || null,
        cast: cast,
        directors: directors,
        writers: writers,
        companyNames: companyNames,
        movieTrailer: movieTrailer,
        vote_average: vote_average,
      },
    });
  }

  return movie;
}
