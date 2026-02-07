export const fetchWatchlistData = async (token) => {
  const res = await fetch(`/api/watchlist?token=${token}`);
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

export const updateWatchlist = async (data) => {
  const formData = new FormData();

  formData.append("id", data.id);
  formData.append("name", data.name);
  formData.append("description", data.description || "");

  if (data.picture instanceof File) {
    formData.append("picture", data.picture);
  } else if (typeof data.picture === "string") {
    formData.append("picture", data.picture);
  }

  const response = await fetch("/api/watchlist", {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update watchlist");
  }

  return response.json();
};

export const togglePrivacy = async ({ token, isPublic }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist?token=${token}`,
    {
      method: "PATCH",
      body: JSON.stringify({ isPublic }),
    },
  );

  if (!response.ok) throw new Error("Failed to toggle visibility");
  return response.json();
};
