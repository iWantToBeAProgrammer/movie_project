export const fetchMovieDetails = async (movieId, tmdbId) => {
  let url = "/api/movie-details?";

  if (movieId) {
    url += `movieId=${movieId}`;
  } else if (tmdbId) {
    url += `tmdbId=${tmdbId}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch movie details");
  }
  return response.json();
};
