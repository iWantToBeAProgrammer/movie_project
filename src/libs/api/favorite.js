export const toggleFavorite = async (movieId) => {
    const res = await fetch(`/api/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId }),
    });
  
    if (!res.ok) throw new Error("Failed to update favorite status");
    return res.json();
  };
  