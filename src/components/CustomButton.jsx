"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, Eye, Pencil } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMovieDetails, markAsWatched } from "@/libs/api";

const CustomButton = ({ type, size = "medium", className = "", movieId }) => {
  const [watchlistData, setWatchlistData] = useState({
    watchlistId: null,
    name: "",
    description: "",
    picture: null,
    movieId: movieId,
  });

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["movie-details"],
    queryFn: () => fetchMovieDetails(movieId),
  });

  const mutation = useMutation({
    mutationFn: () => markAsWatched(movieId),
    onMutate: async () => {
      await queryClient.cancelQueries(["watched", movieId]);
      const previousWatched = queryClient.getQueryData(["watched", movieId]);
      queryClient.setQueryData(["watched", movieId], {
        watched: !previousWatched?.watched,
      });
      return { previousWatched };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["watched", movieId], context.previousWatched);
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["watched", movieId]);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
  });

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

  const buttonConfig = {
    add: {
      text: "Add To Watchlist",
      icon: <PlusCircle size={20} className="inline-block mr-2" />,
      className: "bg-white text-black hover:bg-secondary hover:text-white",
    },
    watched: {
      text: data?.watched ? "Didn't Watched It" : "Watched It",
      icon: <Eye size={20} className="inline-block mr-2" />,
      className:
        "bg-transparent border border-secondary border-4 text-secondary hover:bg-secondary hover:text-white",
      onClick: () => mutation.mutate(),
    },
  };

  const {
    text,
    icon,
    className: variantClassName,
    onClick,
  } = buttonConfig[type] || {};

  const sizeClasses = {
    small: "py-1 w-10 text-sm",
    medium: "py-2 w-20 text-base",
    large: "py-1 w-52 text-2xl",
  };

  return (
    <>
      {type === "watched" ? (
        <button
          onClick={onClick}
          className={`rounded-lg transition-colors font-bebas_neue duration-200 flex items-center justify-center    ${variantClassName} ${sizeClasses[size]} ${className}`}
        >
          {icon}
          {text}
        </button>
      ) : (
        <div className="dropdown dropdown-bottom">
          <div
            tabIndex={0}
            role="button"
            className={`h-12 rounded-lg transition-colors font-bebas_neue duration-200 flex items-center justify-center    ${variantClassName} ${sizeClasses[size]} ${className}`}
          >
            {icon}
            {text}
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
                {icon} Create Watchlist
              </button>
            </li>
            {data?.watchlists.map((watchlist, key) => {
              return (
                <li key={key}>
                  <button
                    className="focus:text-black"
                    onClick={() =>
                      handleSubmitToExistingWatchlist(watchlist.id)
                    }
                  >
                    {watchlist.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <dialog id="watchlist_modal" className="modal">
        <div className="modal-box">
          <form method="dialog" className="mb-4">
            {/* if there is a button in form, it will close the modal */}
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
                  <img
                    width={150}
                    height={150}
                    className="w-40 h-40"
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
                  className="input input-bordered w-full max-w-xs py-5"
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
