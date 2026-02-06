// hooks/useWatchlistQueries.js
import { fetchWatchlistData } from "@/libs/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ==========================================
// 1. QUERIES (GET DATA) - Kode Lama Kamu
// ==========================================

// Query untuk detail satu watchlist
export function useWatchlist(token) {
  return useQuery({
    queryKey: ["watchlist", token],
    queryFn: () => fetchWatchlistData(token),
    enabled: !!token,
  });
}

// Query untuk list watchlist lainnya
export function useOtherWatchlists(currentToken) {
  return useQuery({
    queryKey: ["watchlists", currentToken, "other"],
    queryFn: () => fetchOtherWatchlists(currentToken),
    enabled: !!currentToken,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetcher function (helper)
async function fetchOtherWatchlists(currentToken) {
  // Menggunakan relative path agar aman di client-side
  const response = await fetch(`/api/watchlist/${currentToken}/other`);

  if (!response.ok) {
    throw new Error("Failed to fetch other watchlists");
  }

  return response.json();
}

// ==========================================
// 2. MUTATIONS (UPDATE/DELETE DATA) - Baru
// ==========================================

export function useWatchlistMutations() {
  const queryClient = useQueryClient();

  // A. DELETE WATCHLIST
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete watchlist");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Watchlist deleted successfully");
      // Refresh semua data yang berkaitan dengan watchlists
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["watchlists"] });
      // Jika user sedang di halaman profile, list-nya akan update otomatis
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // B. TOGGLE PRIVACY (PATCH)
  const privacyMutation = useMutation({
    mutationFn: async ({ token, isPublic }) => {
      // isPublic disini adalah status BARU yang diinginkan
      const res = await fetch(`/api/watchlist?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update privacy");
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Privacy updated");

      // 1. Refresh list watchlist di profile
      queryClient.invalidateQueries({ queryKey: ["watchlists"] });

      // 2. Refresh detail watchlist spesifik (jika sedang dibuka)
      queryClient.invalidateQueries({
        queryKey: ["watchlist", variables.token],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    deleteWatchlist: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    togglePrivacy: privacyMutation.mutate,
    isUpdatingPrivacy: privacyMutation.isPending,
  };
}
