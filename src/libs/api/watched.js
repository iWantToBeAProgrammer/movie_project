export const fetchWatchedStatus = async (movieId) => {
    const res = await fetch(`/api/watched?movieId=${movieId}`);
    if (!res.ok) throw new Error("Failed to fetch watched status");
    return res.json();
  };
  
  export const markAsWatched = async (movieId) => {
    const res = await fetch(`/api/watched`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId }),
    });
  
    if (!res.ok) throw new Error("Failed to update watched status");
    return res.json();
  };
  