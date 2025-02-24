"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, Eye } from "@phosphor-icons/react";
import toast from "react-hot-toast";

const CustomButton = ({ type, size = "medium", className = "", movieId }) => {
  const [loading, setLoading] = useState(false);
  const [watched, setWatched] = useState(false);

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
              <button className="focus:text-black">
                {icon} Create Watchlist
              </button>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default CustomButton;
