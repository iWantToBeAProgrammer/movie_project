export const createSavedWatchlist = async (token) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/${token}/save`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Failed to save watchlist");

  return response.json();
};

export const deleteSavedWatchlist = async (token) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/${token}/save`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("Failed to remove saved watchlist");

  return response.json();
};
