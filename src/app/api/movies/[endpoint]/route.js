import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { endpoint } = await params; // e.g., top_rated, now_playing
  const baseURL = process.env.NEXT_APP_BASEURL; // Ensure this is set correctly
  const apiKey = process.env.NEXT_APP_APIKEY;
  const searchParams = req.nextUrl.searchParams;

  try {
    const url = `${baseURL}/movie/${endpoint}?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from TMDB");
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the data as JSON
  } catch (error) {
    console.error("Server-side fetch error:", error);
    return NextResponse.json(error.message);
  }
}