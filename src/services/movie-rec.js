import { getMovieData } from "@/libs/api-libs";

export async function getRecDetails(tmdbId) {
  try {
    const tmdbRec = await getMovieData(
      tmdbId,
      "&language=en-US&append_to_response=recommendations"
    );
    return tmdbRec.recommendations?.results || [];
  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    return [];
  }
}
