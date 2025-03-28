import { NextResponse } from "next/server";

const TMDB_API = {
  baseUrl: process.env.NEXT_APP_BASE_URL || "https://api.themoviedb.org/3",
  apiKey: process.env.NEXT_APP_APIKEY,

  // Updated to fetch release dates which contain certification
  getMovieDetailUrl: (movieId) =>
    `${TMDB_API.baseUrl}/movie/${movieId}/release_dates?api_key=${TMDB_API.apiKey}`,
};

async function fetchMovieCertification(movie) {
  try {
    const response = await fetch(TMDB_API.getMovieDetailUrl(movie.id));

    if (!response.ok) {
      console.warn(`Failed to fetch certification for movie ID: ${movie.id}`);
      return { ...movie, certification: null };
    }

    const data = await response.json();

    const certification =
      data.results.find((result) => result.iso_3166_1 === "ID")
        ?.release_dates[0]?.certification || "";

    console.log(certification);
    return {
      ...movie,
      certification,
    };
  } catch (error) {
    console.error(`Certification fetch error for movie ${movie.id}:`, error);
    return { ...movie, certification: "" };
  }
}

export async function GET(req) {
  const { searchParams } = req.nextUrl;

  try {
    const url = `${TMDB_API.baseUrl}/search/movie?api_key=${
      TMDB_API.apiKey
    }&${searchParams.toString()}&page=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch data from TMDB");
    }

    const data = await response.json();

    const moviesWithCertification = await Promise.all(
      data.results.map(fetchMovieCertification)
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
