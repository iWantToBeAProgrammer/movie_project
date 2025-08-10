import { NextResponse } from "next/server";

const TMDB_API = {
  baseUrl: process.env.NEXT_APP_BASE_URL || "https://api.themoviedb.org/3",
  apiKey: process.env.NEXT_APP_APIKEY,

  getMovieDetailUrl: (movieId) =>
    `${TMDB_API.baseUrl}/movie/${movieId}?append_to_response=release_dates`,
};

async function fetchMovieDetails(movie) {
  try {
    const response = await fetch(TMDB_API.getMovieDetailUrl(movie.id), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TMDB_API.apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch certification for movie ID: ${movie.id}`);
      return { ...movie, certification: null };
    }

    const data = await response.json();
    const certification =
      data?.release_dates?.results?.find((result) => result.iso_3166_1 === "ID")
        ?.release_dates[0]?.certification || "N/A";

    const genres = data?.genres.map((genre) => genre.name);

    function formatRuntime(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }

    const runtime = formatRuntime(data?.runtime);

    return {
      ...movie,
      certification,
      genres,
      runtime,
    };
  } catch (error) {
    console.error(`Certification fetch error for movie ${movie.id}:`, error);
    return { ...movie, certification: "" };
  }
}

export async function GET(req) {
  const { searchParams } = req.nextUrl;

  try {
    const page = searchParams.get("page") || "1";

    const url = new URL(`${TMDB_API.baseUrl}/search/movie`);
    url.searchParams.append("query", searchParams.get("query"));
    url.searchParams.append("page", page);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TMDB_API.apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from TMDB");
    }

    const data = await response.json();

    const moviesWithCertification = await Promise.all(
      data.results.map(fetchMovieDetails),
    );

    return NextResponse.json({
      ...data,
      results: moviesWithCertification,
    });
  } catch (error) {
    console.error("Server-side fetch error:", error);
    return NextResponse.json({ results: [] });
  }
}
