import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  const saved = await prisma.savedWatchlist.findMany({
    where: { userId },
    include: {
      watchlist: {
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
          members: {
            include: {
              user: {
                select: {
                  username: true,
                  profilePicture: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(saved);
}
