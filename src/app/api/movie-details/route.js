import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");
    const tmdbId = searchParams.get("tmdbId");

    if (!movieId && !tmdbId) {
      return NextResponse.json(
        { error: "Either Movie ID or TMDB ID is required" },
        { status: 400 },
      );
    }

    // Auth check
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({
        watchlists: [],
        watched: false,
        favoriteMovie: false,
      });
    }

    const userId = data.user.id;
    const watchlists = await prisma.watchlistMember.findMany({
      where: { userId: userId, role: { not: "VIEWER" } },
      select: {
        watchlist: true,
      },
    });

    // If we have a direct movieId, use it
    if (movieId) {
      const watchedMovie = await prisma.watchedMovie.findFirst({
        where: {
          userId: userId,
          movieId: parseInt(movieId, 10),
        },
      });

      const favoriteMovie = await prisma.favoriteMovie.findFirst({
        where: {
          userId: userId,
          movieId: parseInt(movieId, 10),
        },
      });

      return NextResponse.json({
        watchlists,
        watched: !!watchedMovie,
        favoriteMovie: !!favoriteMovie,
      });
    }
    // If we only have tmdbId, we need to first find or create the movie
    else if (tmdbId) {
      // First check if the movie already exists in your database by tmdbId
      let movie = await prisma.movie.findFirst({
        where: { tmdbId: tmdbId },
      });

      // If the movie doesn't exist yet, we'll know there's no watched/favorite status
      if (!movie) {
        return NextResponse.json({
          watchlists,
          watched: false,
          favoriteMovie: false,
          movieExists: false,
        });
      }

      // If movie exists, check watched and favorite status
      const watchedMovie = await prisma.watchedMovie.findFirst({
        where: {
          userId: userId,
          movieId: movie.id,
        },
      });

      const favoriteMovie = await prisma.favoriteMovie.findFirst({
        where: {
          userId: userId,
          movieId: movie.id,
        },
      });

      return NextResponse.json({
        watchlists,
        watched: !!watchedMovie,
        favoriteMovie: !!favoriteMovie,
        movieExists: true,
        movieId: movie.id, // Return the internal movie ID for future operations
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
