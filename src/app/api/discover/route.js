import { NextResponse } from "next/server";

export async function GET(req) {
  const baseURL = process.env.NEXT_APP_BASE_URL || "https://api.themoviedb.org/3";
  const apiKey = process.env.NEXT_APP_APIKEY;
  const searchParams = req.nextUrl.searchParams;

  try {
    const url = new URL(`${baseURL}/discover/movie`);
    
    // Copy all search params from request to TMDB URL
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Ensure language and region are set if not provided
    if (!url.searchParams.has("language")) url.searchParams.append("language", "en-US");
    if (!url.searchParams.has("region")) url.searchParams.append("region", "ID");
    if (!url.searchParams.has("sort_by")) url.searchParams.append("sort_by", "popularity.desc");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from TMDB Discover");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Discover API error:", error);
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0 });
  }
}
