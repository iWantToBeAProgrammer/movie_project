"use client";

import { Suspense, useState } from "react";
import { PlusCircle, Eye, Pencil, Star } from "@phosphor-icons/react";
import { IoStarOutline, IoStar } from "react-icons/io5";
import toast from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMovieDetails, markAsWatched, toggleFavorite } from "@/libs/api";
import Loading from "@/app/loading";

const CustomButton = ({ type, size = "medium", className = "", movieId }) => {
  const [watchlistData, setWatchlistData] = useState({
    watchlistId: null,
    name: "",
    description: "",
    picture: null,
    movieId: movieId,
  });

  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    suspense: true,
  });

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
      onError: (err, variables, context) => {
        queryClient.setQueryData([queryKey, movieId], context.previousState);
        toast.error(err.message);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatchlistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setWatchlistData((prev) => ({ ...prev, picture: file }));
  };

  const createWatchlist = async (watchlistData) => {
    const formData = new FormData();
    if (watchlistData.watchlistId)
      formData.append("watchlistId", watchlistData.watchlistId);
    if (watchlistData.name) formData.append("name", watchlistData.name);
    if (watchlistData.movieId)
      formData.append("movieId", watchlistData.movieId);
    if (watchlistData.description)
      formData.append("description", watchlistData.description);
    if (watchlistData.picture)
      formData.append("picture", watchlistData.picture);

    const res = await fetch("/api/watchlist", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Something went wrong");
    }

    return res.json();
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: createWatchlist,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["watchlist"]);
      setWatchlistData({
        watchlistId: null,
        name: "",
        description: "",
        picture: null,
        movieId: movieId,
      });
      document.getElementById("watchlist_modal").close();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create watchlist");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(watchlistData);
  };

  const handleSubmitToExistingWatchlist = (watchlistId) => {
    mutate({ ...watchlistData, watchlistId });
  };

  const getFavoriteIcon = () => {
    if (data?.favoriteMovie || isFavoriteHovered) {
      return <IoStar size={24} className="inline-block text-yellow-400" />;
    }
    return <IoStarOutline size={24} className="inline-block" />;
  };

  const buttonConfig = {
    add: {
      text: "Add To Watchlist",
      icon: <PlusCircle size={20} className="inline-block mr-2" />,
      className: "bg-white text-black hover:bg-secondary hover:text-white",
      renderAsDropdown: true,
    },
    watched: {
      text: data?.watched ? "Didn't Watch It" : "Watched It",
      icon: <Eye size={20} className="inline-block mr-2" />,
      className:
        "bg-transparent border border-secondary border-4 text-secondary hover:bg-secondary hover:text-white",
      onClick: () => watchedMutation.mutate(),
      renderAsDropdown: false,
    },
    favorite: {
      icon: getFavoriteIcon(),
      className:
        "bg-transparent border border-yellow-400 border-4 text-yellow-400",
      onClick: () => favoriteMutation.mutate(),
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
        className={`rounded-lg transition-colors font-bebas_neue duration-200 flex items-center justify-center ${config.className} ${sizeClasses[size]} ${className}`}
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
          className={`h-12 rounded-lg transition-colors font-bebas_neue duration-200 flex items-center justify-center ${config.className} ${sizeClasses[size]} ${className}`}
        >
          {config.icon}
          {config.text}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-white text-black rounded-xl mt-2 z-[1] w-52 p-2 shadow hover:*:*:bg-secondary transition-colors duration-200 ease-in-out *:rounded-xl gap-1"
        >
          <li className="border-b border-black/50">
            <button
              className="focus:text-black"
              onClick={() =>
                document.getElementById("watchlist_modal").showModal()
              }
            >
              <PlusCircle size={20} /> Create Watchlist
            </button>
          </li>
          {isPending ? (
            <Loading />
          ) : (
            data?.watchlists?.map((watchlist, key) => (
              <li key={key}>
                <button
                  className="focus:text-black"
                  onClick={() => handleSubmitToExistingWatchlist(watchlist.id)}
                >
                  {watchlist.name}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <dialog id="watchlist_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog" className="mb-4">
            <h1 className="text-2xl">Create Watchlist</h1>
            <button className="btn btn-sm btn-circle btn-ghost absolute top-6 right-2">
              ✕
            </button>
          </form>
          <form
            className="watchlist-form form-control gap-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="watchlist-image">
                <label htmlFor="picture" className="relative">
                  <Image
                    width={600}
                    height={600}
                    className="object-cover aspect-square object-center"
                    src={
                      watchlistData.picture
                        ? URL.createObjectURL(watchlistData.picture)
                        : "/assets/images/watchlist-default.jpg"
                    }
                    alt="Watchlist Preview"
                  />
                  <input
                    type="file"
                    name="picture"
                    id="picture"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <div className="w-full h-full absolute justify-center items-center top-0 z-10 *:hidden hover:bg-black/50 *:hover:block flex flex-col">
                    <Pencil size={50} weight="bold" />
                    <p className="font-raleway font-semibold">Choose a photo</p>
                  </div>
                </label>
              </div>
              <div className="watchlist-form-content col-span-2 h-full gap-2 flex flex-col">
                <input
                  type="text"
                  placeholder="Add a name"
                  className="input input-bordered w-full py-5"
                  name="name"
                  value={watchlistData.name}
                  onChange={handleChange}
                />
                <textarea
                  className="textarea textarea-bordered resize-none h-full w-full"
                  placeholder="Add an optional description here"
                  name="description"
                  value={watchlistData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              Create
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default CustomButton;
