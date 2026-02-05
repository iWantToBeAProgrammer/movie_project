import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const movieId = parseInt(searchParams.get("movieId"), 10);

  if (!movieId) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 },
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true, // Penting: Frontend butuh foto profil
          },
        },
      },
      // Kita urutkan berdasarkan waktu dibuat
      orderBy: {
        createdAt: "desc", // Komentar baru di atas
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ambil parentId dari body request
  const { movieId, content, parentId } = await req.json();

  if (!movieId || !content) {
    return NextResponse.json(
      { error: "Movie ID and content are required" },
      { status: 400 },
    );
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        movieId: parseInt(movieId, 10),
        content,
        // Masukkan parentId jika ada (untuk reply), null jika tidak (root comment)
        parentId: parentId ? parseInt(parentId, 10) : null,
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Comment posted successfully", ...comment },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
