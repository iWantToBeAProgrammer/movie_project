const { prisma } = require("@/libs/prisma");
const { createClient } = require("@/libs/supabaseServer");
const { NextResponse } = require("next/server");

export const GET = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;

    const userData = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        profilePicture: true,
        username: true,
        email: true,
      },
    });

    const watchlists = await prisma.watchlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            movie: {
              select: {
                posterPath: true,
              },
            },
          },
        },
      },
    });

    const watchedMovies = await prisma.watchedMovie.findMany({
      select: {
        movie: true,
      },
      where: {
        userId: userId,
      },
    });

    const favoriteMovies = await prisma.favoriteMovie.findMany({
      select: {
        movie: true,
      },
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({
      profile: {
        watchlists,
        watchedMovies,
        favoriteMovies,
      },

      user: userData,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
