import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    const { movieId } = await req.json();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingEntry = await prisma.favoriteMovie.findFirst({
      where: { userId: user.id, movieId: movieId },
    });

    if (existingEntry) {
      await prisma.favoriteMovie.delete({
        where: { id: existingEntry.id },
      });

      return NextResponse.json({
        message: "Movie removed as favorite",
      });
    }

    const newEntry = await prisma.favoriteMovie.create({
      data: { userId: user.id, movieId: movieId },
    });

    return NextResponse.json({
      message: "Movie added as favorite",
      favorite: newEntry,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
