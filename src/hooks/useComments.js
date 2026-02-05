import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// --- API FUNCTIONS (Logic Fetching Murni) ---

const fetchComments = async (movieId) => {
  const res = await fetch(`/api/comment?movieId=${movieId}`);
  if (!res.ok) {
    throw new Error("Failed to load comments");
  }
  return res.json();
};

const postComment = async ({ movieId, content, parentId }) => {
  const res = await fetch("/api/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieId, content, parentId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to post comment");
  }
  return res.json();
};

// --- CUSTOM HOOKS ---

/**
 * Hook untuk mengambil data komentar berdasarkan movieId
 */
export const useComments = (movieId) => {
  return useQuery({
    queryKey: ["comments", movieId], // Key unik per movie
    queryFn: () => fetchComments(movieId),
    enabled: !!movieId, // Hanya jalan jika movieId ada
    staleTime: 1000 * 60, // Data dianggap segar selama 1 menit (opsional)
  });
};

/**
 * Hook untuk posting komentar atau balasan
 */
export const useAddComment = (movieId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postComment,

    // Ketika sukses post:
    onSuccess: (data) => {
      // 1. Refresh data komentar otomatis
      queryClient.invalidateQueries({ queryKey: ["comments", movieId] });

      // 2. Tampilkan notifikasi
      const message = data.parentId ? "Reply posted!" : "Review posted!";
      toast.success(message);
    },

    // Ketika gagal:
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
