export const fetchWatchlistData = async (watchlistId) => {
  const res = await fetch(`/api/watchlist?watchlistId=${watchlistId}`);
  if (!res.ok) throw new Error("Failed to fetch watchlist");
  return res.json();
};

export const addToWatchlist = async (watchlistData) => {
  const res = await fetch(`/api/watchlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(watchlistData),
  });

  if (!res.ok) throw new Error("Failed to add to watchlist");
  return res.json();
};
