export const fetchMovieDetails = async (movieId) => {
    const res = await fetch(`/api/movie-details?movieId=${movieId}`);
    if (!res.ok) throw new Error("Failed to fetch movie details");
    return res.json();
  };
  