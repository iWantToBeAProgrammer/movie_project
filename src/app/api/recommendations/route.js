import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabaseServer";
import { prisma } from "@/libs/prisma";
import { getRecDetails } from "@/services/movie-rec";

export async function GET(req) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;

    // Fetch latest favorite `movies`
    const favorites = await prisma.favoriteMovie.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
      take: 2,
      include: { movie: true }
    });

    // Fetch latest watchlist items
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: {
        watchlist: {
          members: {
            some: { userId }
          }
        }
      },
      orderBy: { addedAt: 'desc' },
      take: 2,
      include: { movie: true }
    });

    // Extract unique tmdbIds
    const tmdbIds = new Set();
    favorites.forEach(f => {
      if (f.movie?.tmdbId) tmdbIds.add(f.movie.tmdbId);
    });
    watchlistItems.forEach(w => {
      if (w.movie?.tmdbId) tmdbIds.add(w.movie.tmdbId);
    });

    if (tmdbIds.size === 0) {
      return NextResponse.json({ results: [] });
    }

    // Fetch recommendations for these movies
    let allRecommendations = [];
    for (const tmdbId of tmdbIds) {
      const recs = await getRecDetails(tmdbId);
      allRecommendations = [...allRecommendations, ...recs];
    }

    // Deduplicate and sort
    const uniqueMap = new Map();
    allRecommendations.forEach(movie => {
      if (!uniqueMap.has(movie.id) && !tmdbIds.has(movie.id.toString())) {
        uniqueMap.set(movie.id, movie);
      }
    });

    // Convert map to array and sort by popularity (descending)
    let finalResults = Array.from(uniqueMap.values());
    finalResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    return NextResponse.json({ results: finalResults.slice(0, 20) });
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    return NextResponse.json({ error: "Internal Server Error", results: [] }, { status: 500 });
  }
}
