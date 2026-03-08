import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = await params;
  const baseURL = process.env.NEXT_APP_BASE_URL || "https://api.themoviedb.org/3";
  const apiKey = process.env.NEXT_APP_APIKEY;

  try {
    const url = `${baseURL}/movie/${id}/watch/providers`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch watch providers from TMDB");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Watch Providers API error:", error);
    return NextResponse.json({ results: {} });
  }
}
