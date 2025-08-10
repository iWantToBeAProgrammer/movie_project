import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  const watchlists = await prisma.watchlistMember.findMany({
    where: {
      userId,
      role: { not: "VIEWER" },
    },
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

  return NextResponse.json(watchlists);
}
