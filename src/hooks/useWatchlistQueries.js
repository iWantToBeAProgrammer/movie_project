// hooks/useWatchlistQueries.ts
import { fetchWatchlistData } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";

// Your existing watchlist detail query
export function useWatchlist(token) {
  return useQuery({
    queryKey: ["watchlist", token],
    queryFn: () => fetchWatchlistData(token),
    enabled: !!token,
  });
}

// New query for other watchlists
export function useOtherWatchlists(currentToken) {
  return useQuery({
    queryKey: ["watchlists", currentToken, "other"],
    queryFn: () => fetchOtherWatchlists(currentToken),
    enabled: !!currentToken,
    staleTime: 5 * 60 * 1000, // 5 minutes - since watchlists don't change often
  });
}

// Fetch function for other watchlists
async function fetchOtherWatchlists(currentToken) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/${currentToken}/other`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch other watchlists");
  }

  return response.json();
}
