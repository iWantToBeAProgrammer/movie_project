import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    const { searchParams } = new URL(req.url);
    const movieId = parseInt(searchParams.get("movieId"), 10);

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    if (!movieId)
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );

    const watchedMovie = await prisma.watchedMovie.findFirst({
      where: { userId: user.id, movieId },
    });

    return NextResponse.json({
      watched: !!watchedMovie,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    const { movieId } = await req.json();

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existingEntry = await prisma.watchedMovie.findFirst({
      where: { userId: user.id, movieId: movieId },
    });

    if (existingEntry) {
      await prisma.watchedMovie.delete({
        where: { id: existingEntry.id },
      });

      return NextResponse.json({
        message: "Movie unmarked as watched",
        watched: false,
      });
    }

    const newEntry = await prisma.watchedMovie.create({
      data: { userId: user.id, movieId: movieId},
    });

    return NextResponse.json({
      message: "Movie marked as watched",
      watched: true,
      item: newEntry,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
