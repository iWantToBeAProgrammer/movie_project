import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  const favorites = await prisma.favoriteMovie.findMany({
    where: { userId },
    include: {
      movie: true,
    },
  });

  return NextResponse.json(favorites);
}
