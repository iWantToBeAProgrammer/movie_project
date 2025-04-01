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
import ErrorNotification from "./Auth/ErrorNotification";
import { useWatchlistMutation } from "@/hooks/useFormMutation";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CustomButton = ({ type, size = "medium", className = "", movieId }) => {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    suspense: true,
  });
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(data?.favoriteMovie || false);
  const [isWatched, setIsWatched] = useState(data?.watched || false);

  const createToggleMutation = (actionFn, queryKey) => {
    return useMutation({
      mutationFn: () => actionFn(movieId),

      onMutate: async () => {
        await queryClient.cancelQueries([queryKey, movieId]);

        const previousState = queryClient.getQueryData([queryKey, movieId]);

        queryClient.setQueryData([queryKey, movieId], {
          [queryKey]: !previousState?.[queryKey],
        });

        return { previousState };
      },

      onError: (err, _, context) => {
        // Rollback UI if mutation fails
        queryClient.setQueryData([queryKey, movieId], context.previousState);
        toast.error(err.message || "Something went wrong");
      },

      onSettled: () => {
        queryClient.invalidateQueries([queryKey, movieId]);
      },

      onSuccess: (data) => {
        toast.success(data?.message);
      },
    });
  };

  const watchedMutation = createToggleMutation(markAsWatched, "watched");
  const favoriteMutation = createToggleMutation(toggleFavorite, "favorite");

  const {
    formData: watchlistData,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleSubmitWithId,
    isLoading,
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
      setIsFavorite((prev) => !prev); // Instantly update local state
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
    return isFavorite || isFavoriteHovered ? (
      <IoStar size={28} className="inline-block" />
    ) : (
      <IoStarOutline size={28} className="inline-block" />
    );
  };

  const buttonConfig = {
    add: {
      text: "Add To Watchlist",
      icon: <PlusCircle size={20} className="mr-2 inline-block" />,
      className: "bg-white text-black hover:bg-secondary hover:text-white",
      renderAsDropdown: true,
    },
    watched: {
      text: isWatched ? "Didn't Watch It" : "Watched It",
      icon: <Eye size={20} className="mr-2 inline-block" />,
      className:
        "bg-transparent border border-secondary border-4 text-secondary hover:bg-secondary hover:text-white",
      onClick: handleWatchedClick,
      renderAsDropdown: false,
    },
    favorite: {
      icon: getFavoriteIcon(),
      className: "bg-transparent  text-yellow-400 border border-4 border-white",
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
        <WatchlistDropdown
          showModal={handleAddToWatchlistClick}
          handleSubmitToExistingWatchlist={handleSubmitToExistingWatchlist}
          watchlists={data?.watchlists}
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
