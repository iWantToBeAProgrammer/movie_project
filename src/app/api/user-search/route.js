import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        total_pages: 0,
        total_results: 0,
        page: 1,
      });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        profilePicture: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        username: "asc",
      },
    });

    const totalResults = await prisma.user.count({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    const totalPages = Math.ceil(totalResults / limit);

    return NextResponse.json({
      results: users,
      total_pages: totalPages,
      total_results: totalResults,
      page: page,
    });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      {
        results: [],
        total_pages: 0,
        total_results: 0,
        error: "Failed to search users",
      },
      { status: 500 },
    );
  }
}
