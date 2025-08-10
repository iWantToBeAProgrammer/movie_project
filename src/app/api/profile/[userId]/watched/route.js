import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  const watched = await prisma.watchedMovie.findMany({
    where: { userId },
    include: {
      movie: true,
    },
  });

  return NextResponse.json(watched);
}
