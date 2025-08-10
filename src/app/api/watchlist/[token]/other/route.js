import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";

export async function GET(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const currentToken = searchParams.get("currentToken");

    const otherWatchlists = await prisma.watchlist.findMany({
      where: {
        AND: [
          {
            members: {
              some: {
                userId: user.id,
                role: {
                  in: ["OWNER", "COLLABORATOR"],
                },
              },
            },
          },
          currentToken
            ? {
                token: {
                  not: currentToken,
                },
              }
            : {},
        ],
      },
      include: {
        members: {
          where: {
            userId: user.id,
          },
          select: {
            role: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(otherWatchlists);
  } catch (error) {
    console.error("Error fetching watchlists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
