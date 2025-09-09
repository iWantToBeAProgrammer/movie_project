import { useOtherWatchlists } from "@/hooks/useWatchlistQueries";
import { EyeSlash, Plus, Star, Trash } from "@phosphor-icons/react";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCaretRight } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { TbStar, TbStarOff } from "react-icons/tb";
import WatchlistDropdown from "./WatchlistDropdown";
import WatchlistModal from "./WatchlistModal";
import { useWatchlistMutation } from "@/hooks/useFormMutation";
import { createWatchlist, markAsWatched, toggleFavorite } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const WatchlistItemCard = ({ watchlistItem = [], token }) => {
  const [movieStates, setMovieStates] = useState({});

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

  const queryClient = useQueryClient();

  const createToggleMutation = (actionFn, queryKey) => {
    const movieId = formData.movieId;
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
        if (err.code === 401) {
          document.getElementById("error-notification").showModal();
          return;
        }

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

  const handleWatchedClick = (movieId) => {
    watchedMutation.mutate({ movieId });
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        isWatched: !prev[movieId]?.isWatched,
      },
    }));
  };

  const handleFavoriteClick = (movieId) => {
    favoriteMutation.mutate({ movieId });
    setMovieStates((prev) => ({
      ...prev,
      [movieId]: {
        ...prev[movieId],
        isFavorite: !prev[movieId]?.isFavorite,
      },
    }));
  };

  const removeFromWatchlist = async (movieId) => {
    const response = await fetch(`/api/watchlist/${token}/items/${movieId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from watchlist");
    }

    queryClient.invalidateQueries(["watchlist", token]);
  };

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId)
      .then(() => {
        toast.success("Movie removed from watchlist");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to remove movie from watchlist");
      });
  };

  const handleSubmitToExistingWatchlist = (watchlistId, movieId) => {
    handleSubmitWithId(watchlistId, "watchlistId", { movieId });
  };

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours} h ${minutes} m`;
  };

  return (
    <>
      <div>
        {watchlistItem.map((item, key, index) => {
          const isWatched = movieStates[item.id]?.isWatched;
          const isFavorite = movieStates[item.id]?.isFavorite;

          return (
            <div key={key} className="flex space-x-10">
              <p className="flex items-center">{key + 1}</p>
              <div className="flex border-b py-5">
                <div className="flex h-64 w-52">
                  <div className="group relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={`${process.env.NEXT_APP_BASEIMG}${
                        item?.poster_path || item?.posterPath
                      }`}
                      fill
                      className="h-full w-full object-center"
                      alt={item.title || "Movie poster"}
                    />

                    <div className="h-full w-full bg-black/0 transition-colors duration-300 ease-in-out group-hover:translate-y-0 hover:bg-black/70">
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-white">
                        <Link
                          className="text-6xl transition-all duration-300 ease-in-out hover:scale-125"
                          href={`/movies/${item?.id}`}
                        >
                          <IoPlayCircleOutline />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group flex w-full flex-col justify-center gap-4 py-10 ps-4 font-sans_caption text-pretty">
                  <div className="flex w-full items-center justify-between">
                    <h1 className="font-raleway text-4xl">{item.title}</h1>
                    <div className="right-group-wrapper flex items-center gap-4">
                      <h1 className="font-sans_caption text-2xl">
                        {item.vote_average.toFixed(1)}/10
                      </h1>
                      <div className="dropdown dropdown-end">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              movieId: item.id,
                              watchlistId: null,
                              name: "",
                              description: "",
                              picture: null,
                            });
                          }}
                          className="btn m-1 flex cursor-pointer items-center justify-center border-0 bg-transparent bg-none opacity-0 outline-0 group-hover:opacity-100 hover:*:text-white"
                        >
                          <HiOutlineDotsVertical
                            size={24}
                            className="text-white/70"
                          />
                        </button>

                        <ul
                          tabIndex={0}
                          className="dropdown-content menu z-1 w-64 rounded-box bg-neutral p-2 font-raleway font-semibold text-base-100 shadow-sm"
                        >
                          <li>
                            <div className="dropdown-hover dropdown dropdown-left transition-all duration-100 ease-in hover:bg-primary hover:*:first:text-neutral">
                              <div
                                role="button"
                                tabIndex={0}
                                className="flex items-center justify-between text-base-100"
                              >
                                <span className="flex items-center gap-3">
                                  <Plus size={24} /> Add to watchlist
                                </span>

                                <FaCaretRight
                                  size={20}
                                  className="text-black/70"
                                />
                              </div>
                              {otherWatchlistsLoading ? (
                                <AiOutlineLoading
                                  size={24}
                                  className="animate-spin text-black/70"
                                />
                              ) : otherWatchlistsError ? (
                                <span className="text-red-500">
                                  Error loading watchlists
                                </span>
                              ) : (
                                <WatchlistDropdown
                                  showModal={() =>
                                    document
                                      .getElementById("watchlist_modal")
                                      .showModal()
                                  }
                                  handleSubmitToExistingWatchlist={
                                    handleSubmitToExistingWatchlist
                                  }
                                  watchlists={otherWatchlists || []}
                                  movieId={item.id}
                                />
                              )}
                            </div>
                          </li>
                          <div className="divider m-0 divider-accent opacity-50"></div>
                          <li>
                            <button
                              onClick={() => handleWatchedClick(item.id)}
                              className="transition-all duration-100 ease-in hover:bg-primary hover:text-neutral"
                            >
                              {!isWatched ? (
                                <span className="flex items-center gap-3">
                                  <Eye size={24} />
                                  Mark as watched
                                </span>
                              ) : (
                                <span className="flex items-center gap-3">
                                  <EyeSlash size={24} />
                                  Mark as unwatched
                                </span>
                              )}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleFavoriteClick(item.id)}
                              className="flex items-center gap-3 transition-all duration-100 ease-in hover:bg-primary hover:text-neutral"
                            >
                              {!isFavorite ? (
                                <span className="flex items-center gap-3">
                                  <TbStar size={24} /> Add to favorite
                                </span>
                              ) : (
                                <span className="flex items-center gap-3">
                                  <TbStarOff size={24} /> Remove from favorite
                                </span>
                              )}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleRemoveFromWatchlist(item.id)}
                              className="flex items-center gap-3 transition-all duration-100 ease-in hover:bg-primary hover:text-neutral"
                            >
                              <Trash size={24} /> Remove from watchlist
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="text-xl text-slate-400">{item.overview}</p>
                  <p className="text-base text-slate-300">
                    {item.genres.join(", ")} ● Duration{" "}
                    {formatRuntime(item.runtime)}
                  </p>
                  <div className="flex items-center gap-3">
                    {isWatched && (
                      <div className="badge badge-primary">
                        <Eye />
                        Watched
                      </div>
                    )}
                    {isFavorite && (
                      <div className="badge badge-info">
                        <Star stroke="yellow" fillRule="true" />
                        Favorite
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <dialog id="watchlist_modal" className="modal">
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
