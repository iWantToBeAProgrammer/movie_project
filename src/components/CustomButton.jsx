"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, Eye } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import Image from "next/image";

const CustomButton = ({ type, size = "medium", className = "", movieId }) => {
  const [loading, setLoading] = useState(false);
  const [watched, setWatched] = useState(false);
  const [watchlistData, setWatchlistData] = useState({
    name: "",
    description: "",
    picture: null,
    movieId: movieId,
  });

  const checkIsWatched = async (movieId) => {
    const res = await fetch(`/api/watched?movieId=${movieId}`, {
      method: "GET",
    });

    const data = await res.json();
    return data.watched;
  };

  useEffect(() => {
    const fetchWatchedStatus = async () => {
      const watched = await checkIsWatched(movieId);
      setWatched(watched);
    };

    fetchWatchedStatus();
  }, [movieId, watched]);

  const MarkAsWatched = async () => {
    setLoading(true);
    const res = await fetch("/api/watched", {
      method: "POST",
      body: JSON.stringify({ movieId }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setWatched((prev) => !prev);
      toast(data.message);
    } else {
      toast("Something went wrong. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatchlistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setWatchlistData((prev) => ({ ...prev, picture: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(result.message);
      setWatchlistData({
        name: "",
        description: "",
        picture: null,
        movieId: movieId,
      });
      document.getElementById("watchlist_modal").close();
    } catch (error) {
      toast.error(error.message || "Failed to create watchlist");
    } finally {
      setLoading(false);
    }
  };

  const buttonConfig = {
    add: {
      text: "Add To Watchlist",
      icon: <PlusCircle size={20} className="inline-block mr-2" />,
      className: "bg-white text-black hover:bg-secondary hover:text-white",
    },
    watched: {
      text: !watched ? "Watched It" : "Didn't Watched It",
      icon: <Eye size={20} className="inline-block mr-2" />,
      className:
        "bg-transparent border border-secondary border-4 text-secondary hover:bg-secondary hover:text-white",
      onClick: MarkAsWatched,
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
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      )}

      <dialog id="watchlist_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <h1 className="text-2xl">Create Watchlist</h1>

            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
              ✕
            </button>
          </form>
          <form
            className="watchlist-form form-control gap-4"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="flex justify-between">
              <div className="watchlist-image">
                <label htmlFor="picture">
                  <img
                    width={150}
                    height={150}
                    src={
                      watchlistData.picture
                        ? URL.createObjectURL(watchlistData.picture)
                        : "/assets/images/noimage.jpeg"
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
                </label>
              </div>
              <div className="watchlist-form-content form-control justify-between">
                <input
                  type="text"
                  placeholder="Add a name"
                  className="input input-bordered w-full max-w-xs"
                  name="name"
                  value={watchlistData.name}
                  onChange={handleChange}
                />
                <textarea
                  className="textarea textarea-bordered resize-none"
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
