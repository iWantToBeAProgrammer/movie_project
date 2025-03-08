import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;

    const watchlists = await prisma.watchlist.findMany({
      where: { userId: userId },
    });

    const watchedMovie = await prisma.watchedMovie.findFirst({
      where: {
        userId: userId,
        movieId: parseInt(movieId, 10),
      },
    });

    return NextResponse.json({
      watchlists,
      watched: !!watchedMovie,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
