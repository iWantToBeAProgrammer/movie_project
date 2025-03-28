export const fetchWatchlistData = async (watchlistId) => {
  const res = await fetch(`/api/watchlist?watchlistId=${watchlistId}`);
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
};

export const createWatchlist = async (watchlistData) => {
  const formData = new FormData();
  if (watchlistData.watchlistId)
    formData.append("watchlistId", watchlistData.watchlistId);
  if (watchlistData.name) formData.append("name", watchlistData.name);
  if (watchlistData.movieId) formData.append("movieId", watchlistData.movieId);
  if (watchlistData.description)
    formData.append("description", watchlistData.description);
  if (watchlistData.picture) formData.append("picture", watchlistData.picture);
  if (watchlistData.tmdbId) formData.append("tmdbId", watchlistData.tmdbId);

  const res = await fetch("/api/watchlist", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Something went wrong");
  }

  return res.json();
};
