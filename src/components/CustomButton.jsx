"use client";

import { useState } from "react";
import { PlusCircle, Eye } from "@phosphor-icons/react";
import { IoStarOutline, IoStar } from "react-icons/io5";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWatchlist,
  fetchMovieDetails,
  markAsWatched,
  toggleFavorite,
} from "@/libs/api";
import WatchlistModal from "./Watchlist/WatchlistModal";
import WatchlistDropdown from "./Watchlist/WatchlistDropdown";
import { useAuth } from "@/app/contexts/AuthContext";
import { useWatchlistMutation } from "@/hooks/useFormMutation";

const CustomButton = ({ type, size = "medium", className = "", movieId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    // Hapus suspense: true jika menyebabkan masalah hydration di Next.js app router
    // suspense: true,
  });

  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(data?.favoriteMovie || false);
  const [isWatched, setIsWatched] = useState(data?.watched || false);

  // --- PERBAIKAN: Definisi mutation langsung di sini ---

  // Helper untuk konfigurasi mutation (bukan hook, cuma object config)
  const getMutationConfig = (queryKey) => ({
    onMutate: async () => {
      await queryClient.cancelQueries([queryKey, movieId]);
      const previousState = queryClient.getQueryData([queryKey, movieId]);

      // Optimistic update state lokal query
      queryClient.setQueryData([queryKey, movieId], (old) => {
        // Logika update sesuaikan dengan struktur data return API
        return old;
      });

      return { previousState };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([queryKey, movieId], context.previousState);
      toast.error(err.message || "Something went wrong");
    },
    onSettled: () => {
      queryClient.invalidateQueries([queryKey, movieId]);
      // Invalidate juga movie-details agar sinkron
      queryClient.invalidateQueries(["movie-details", movieId]);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
  });

  // 1. Mutation Watched
  const watchedMutation = useMutation({
    mutationFn: () => markAsWatched(movieId),
    ...getMutationConfig("watched"),
  });

  // 2. Mutation Favorite
  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite(movieId),
    ...getMutationConfig("favorite"),
  });

  // --- Form Mutation Hook (Sudah benar) ---
  const {
    formData: watchlistData,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleSubmitWithId,
  } = useWatchlistMutation({
    initialData: {
      watchlistId: null,
      name: "",
      description: "",
      picture: null,
      movieId: movieId,
    },
    mutationFn: createWatchlist,
    queryKey: "watchlist",
    modalId: "watchlist_modal",
  });

  const handleSubmitToExistingWatchlist = (watchlistId) => {
    handleSubmitWithId(watchlistId);
  };

  const handleAddToWatchlistClick = () => {
    !user
      ? document.getElementById("error-notification").showModal()
      : document.getElementById("watchlist_modal").showModal();
  };

  const handleFavoriteClick = () => {
    if (!user) {
      document.getElementById("error-notification").showModal();
    } else {
      setIsFavorite((prev) => !prev);
      favoriteMutation.mutate();
    }
  };

  const handleWatchedClick = () => {
    if (!user) {
      document.getElementById("error-notification").showModal();
    } else {
      setIsWatched((prev) => !prev);
      watchedMutation.mutate();
    }
  };

  const getFavoriteIcon = () => {
    // Gunakan data realtime dari server jika ada, fallback ke local state
    const isFav = data?.favoriteMovie ?? isFavorite;

    return isFav || isFavoriteHovered ? (
      <IoStar size={28} className="inline-block" />
    ) : (
      <IoStarOutline size={28} className="inline-block" />
    );
  };

  // Gunakan data realtime untuk status watched juga
  const isWatchedStatus = data?.watched ?? isWatched;

  const buttonConfig = {
    add: {
      text: "Add To Watchlist",
      icon: <PlusCircle size={20} className="mr-2 inline-block" />,
      className: "bg-white text-black hover:bg-secondary hover:text-white",
      renderAsDropdown: true,
    },
    watched: {
      text: isWatchedStatus ? "Didn't Watch It" : "Watched It",
      icon: <Eye size={20} className="mr-2 inline-block" />,
      className:
        "bg-transparent border border-secondary border-4 text-secondary hover:bg-secondary hover:text-white",
      onClick: handleWatchedClick,
      renderAsDropdown: false,
    },
    favorite: {
      icon: getFavoriteIcon(),
      className: "bg-transparent text-yellow-400 border border-4 border-white",
      onClick: handleFavoriteClick,
      renderAsDropdown: false,
      onMouseEnter: () => setIsFavoriteHovered(true),
      onMouseLeave: () => setIsFavoriteHovered(false),
    },
  };

  const config = buttonConfig[type] || buttonConfig.add;

  const sizeClasses = {
    small: "py-1 w-14 text-base",
    medium: "py-2 w-20 text-base",
    large: "py-1 w-52 text-2xl",
  };

  if (!config.renderAsDropdown) {
    return (
      <button
        onClick={config.onClick}
        onMouseEnter={config.onMouseEnter}
        onMouseLeave={config.onMouseLeave}
        className={`flex items-center justify-center rounded-xl font-bebas_neue transition-colors duration-200 ${config.className} ${sizeClasses[size]} ${className}`}
      >
        {config.icon}
        {config.text}
      </button>
    );
  }

  return (
    <>
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          role="button"
          className={`flex h-12 items-center justify-center rounded-lg font-bebas_neue transition-colors duration-200 ${config.className} ${sizeClasses[size]} ${className}`}
        >
          {config.icon}
          {config.text}
        </div>
        {/* Pastikan WatchlistDropdown support props ini */}
        <WatchlistDropdown
          showModal={handleAddToWatchlistClick}
          handleSubmitToExistingWatchlist={handleSubmitToExistingWatchlist}
          watchlists={data?.watchlists || []} // Default array kosong biar gak error map
        />
      </div>

      <dialog id="watchlist_modal" className="modal">
        <WatchlistModal
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          watchlistData={watchlistData}
        />
      </dialog>
    </>
  );
};

export default CustomButton;
