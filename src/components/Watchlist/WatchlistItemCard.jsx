"use client";

import { useOtherWatchlists } from "@/hooks/useWatchlistQueries";
import { EyeSlash, Plus, Star, Trash } from "@phosphor-icons/react";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { TbStar, TbStarOff } from "react-icons/tb";
import WatchlistModal from "./WatchlistModal";
import { useWatchlistMutation } from "@/hooks/useFormMutation";
import { createWatchlist, markAsWatched, toggleFavorite } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const WatchlistItemCard = ({ watchlistItem = [], token }) => {
  const [movieStates, setMovieStates] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (watchlistItem.length > 0) {
      const initialState = {};
      watchlistItem.forEach((item) => {
        initialState[item.id] = {
          isWatched: item.isWatched || false,
          isFavorite: item.isFavorite || false,
        };
      });
      setMovieStates(initialState);
    }
  }, [watchlistItem]);

  const {
    data: otherWatchlists,
    isLoading: otherWatchlistsLoading,
    error: otherWatchlistsError,
  } = useOtherWatchlists(token);

  const {
    formData,
    setFormData,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleSubmitWithId,
  } = useWatchlistMutation({
    initialData: {
      movieId: null,
      watchlistId: null,
      name: "",
      description: "",
      picture: null,
    },
    mutationFn: createWatchlist,
    queryKey: "watchlist",
    modalId: "watchlist_modal",
  });

  // --- PERBAIKAN DISINI ---
  // Definisikan helper konfigurasi (bukan hook)
  const getMutationConfig = (queryKey) => ({
    onMutate: async ({ movieId }) => {
      // Terima movieId dari variables
      await queryClient.cancelQueries([queryKey, movieId]);
      const previousState = queryClient.getQueryData([queryKey, movieId]);

      queryClient.setQueryData([queryKey, movieId], (old) => {
        // Logika optimistik (sesuaikan struktur data jika perlu)
        return !old;
      });

      return { previousState };
    },
    onError: (err, { movieId }, context) => {
      // Akses movieId dari variables
      if (err.code === 401) {
        document.getElementById("error-notification").showModal();
        return;
      }
      queryClient.setQueryData([queryKey, movieId], context.previousState);
      toast.error(err.message || "Something went wrong");
    },
    onSettled: (_, __, { movieId }) => {
      // Akses movieId dari variables
      queryClient.invalidateQueries([queryKey, movieId]);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
  });

  // 1. Watched Mutation
  const watchedMutation = useMutation({
    mutationFn: ({ movieId }) => markAsWatched(movieId),
    ...getMutationConfig("watched"),
  });

  // 2. Favorite Mutation
  const favoriteMutation = useMutation({
    mutationFn: ({ movieId }) => toggleFavorite(movieId),
    ...getMutationConfig("favorite"),
  });

  // --- END PERBAIKAN ---

  const handleWatchedClick = (movieId) => {
    // Panggil mutate dengan object { movieId }
    watchedMutation.mutate({ movieId });

    // Optimistic UI update lokal
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: { ...prev[movieId], isWatched: !prev[movieId]?.isWatched },
    }));
  };

  const handleFavoriteClick = (movieId) => {
    // Panggil mutate dengan object { movieId }
    favoriteMutation.mutate({ movieId });

    // Optimistic UI update lokal
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: { ...prev[movieId], isFavorite: !prev[movieId]?.isFavorite },
    }));
  };

  const removeFromWatchlist = async (movieId) => {
    const response = await fetch(`/api/watchlist/${token}/items/${movieId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove item from watchlist");
    queryClient.invalidateQueries(["watchlist", token]);
  };

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId)
      .then(() => toast.success("Movie removed from watchlist"))
      .catch((error) => toast.error(error.message));
  };

  const handleSubmitToExistingWatchlist = (watchlistId, movieId) => {
    handleSubmitWithId(watchlistId, "watchlistId", { movieId });
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {watchlistItem.map((item, key) => {
          const isWatched = movieStates[item.id]?.isWatched;
          const isFavorite = movieStates[item.id]?.isFavorite;

          return (
            <div
              key={key}
              className="group relative flex items-start gap-3 border-b border-white/5 bg-transparent p-3 transition-colors hover:bg-white/5 md:gap-6 md:p-4"
            >
              {/* Numbering */}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-bold text-white/30 md:h-full md:w-8 md:text-base">
                {key + 1}
              </span>

              {/* Poster Image */}
              <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-md bg-gray-900 shadow-md md:w-32">
                <Image
                  src={`${process.env.NEXT_APP_BASEIMG}${
                    item?.poster_path || item?.posterPath
                  }`}
                  fill
                  sizes="(max-width: 768px) 80px, 128px"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  alt={item.title || "Movie poster"}
                />

                {/* Play Overlay (Desktop) */}
                <Link
                  href={`/movies/${item?.id}`}
                  className="absolute inset-0 hidden items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex"
                >
                  <IoPlayCircleOutline className="text-4xl text-white drop-shadow-lg" />
                </Link>
              </div>

              {/* Content Details */}
              <div className="flex min-w-0 flex-1 flex-col gap-1 md:gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <Link
                      href={`/movies/${item?.id}`}
                      className="transition-colors hover:text-primary"
                    >
                      <h3 className="line-clamp-1 font-raleway text-base leading-tight font-bold text-white md:text-xl">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400 md:text-xs">
                      <span className="font-medium text-secondary">
                        {item.vote_average?.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{formatRuntime(item.runtime)}</span>
                      <span className="hidden md:inline">
                        • {item.genres?.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="dropdown dropdown-end">
                    <button
                      type="button"
                      tabIndex={0}
                      role="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, movieId: item.id }));
                      }}
                      className="btn btn-circle text-white/50 btn-ghost btn-xs hover:bg-white/10 hover:text-white md:btn-sm"
                    >
                      <HiOutlineDotsVertical size={18} className="md:size-5" />
                    </button>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu z-50 mt-1 w-56 rounded-xl border border-white/10 bg-[#1a1a1a] p-2 text-xs font-medium shadow-2xl md:w-64 md:text-sm"
                    >
                      <li>
                        <details>
                          <summary className="group flex justify-between py-2 active:bg-white/10">
                            <span className="flex items-center gap-2">
                              <Plus size={16} /> Add to watchlist
                            </span>
                          </summary>

                          <ul className="mt-1 max-h-40 overflow-y-auto rounded-lg bg-black/20 p-1">
                            {otherWatchlistsLoading ? (
                              <li className="px-2 py-1 text-center opacity-50">
                                <AiOutlineLoading className="mr-2 inline animate-spin" />{" "}
                                Loading...
                              </li>
                            ) : otherWatchlistsError ? (
                              <li className="px-2 py-1 text-center text-red-400">
                                Error
                              </li>
                            ) : otherWatchlists?.length === 0 ? (
                              <li className="px-2 py-1 text-center opacity-50">
                                No other lists
                              </li>
                            ) : (
                              otherWatchlists?.map((wl) => (
                                <li key={wl.id}>
                                  <button
                                    onClick={() =>
                                      handleSubmitToExistingWatchlist(
                                        wl.id,
                                        item.id,
                                      )
                                    }
                                    className="truncate py-2 hover:bg-primary/20 hover:text-primary"
                                  >
                                    {wl.name}
                                  </button>
                                </li>
                              ))
                            )}
                            <li className="mt-1 border-t border-white/10 pt-1">
                              <button
                                onClick={() =>
                                  document
                                    .getElementById("watchlist_modal")
                                    .showModal()
                                }
                                className="py-2 text-center text-primary hover:bg-primary/10"
                              >
                                + Create New
                              </button>
                            </li>
                          </ul>
                        </details>
                      </li>

                      <div className="divider my-1 h-px bg-white/10" />

                      <li>
                        <button
                          onClick={() => handleWatchedClick(item.id)}
                          className="py-2 active:bg-white/10"
                        >
                          {isWatched ? (
                            <span className="flex items-center gap-2 text-primary">
                              <EyeSlash size={16} /> Unmark Watched
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Eye size={16} /> Mark Watched
                            </span>
                          )}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleFavoriteClick(item.id)}
                          className="py-2 active:bg-white/10"
                        >
                          {isFavorite ? (
                            <span className="flex items-center gap-2 text-yellow-400">
                              <TbStarOff size={16} /> Unfavorite
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <TbStar size={16} /> Favorite
                            </span>
                          )}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleRemoveFromWatchlist(item.id)}
                          className="py-2 text-red-400 hover:bg-red-500/10 active:bg-red-500/20"
                        >
                          <span className="flex items-center gap-2">
                            <Trash size={16} /> Remove
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Overview Text */}
                <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-400 md:line-clamp-2 md:text-sm">
                  {item.overview || "No overview available."}
                </p>

                {/* Badges */}
                <div className="mt-auto flex flex-wrap gap-2 pt-1">
                  {isWatched && (
                    <div className="badge gap-1 badge-xs py-2 text-[10px] badge-primary md:badge-sm md:text-xs">
                      <Eye className="text-xs" /> Watched
                    </div>
                  )}
                  {isFavorite && (
                    <div className="badge gap-1 badge-xs py-2 text-[10px] badge-info md:badge-sm md:text-xs">
                      <Star weight="fill" className="text-xs text-yellow-300" />{" "}
                      Favorite
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <dialog
          id="watchlist_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <WatchlistModal
            watchlistData={formData}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
          />
        </dialog>
      </div>
    </>
  );
};

export default WatchlistItemCard;
