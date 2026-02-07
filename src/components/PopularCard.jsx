"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { getMovieData } from "@/libs/api-libs";
import Header from "./Header";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const PopularCard = ({ results = [] }) => {
  const [movieDetails, setMovieDetails] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieData = await Promise.all(
        results.map(async (movie) => {
          const details = await getMovieData(
            movie.id,
            "&append_to_response=genres",
          );
          return { ...movie, genres: details.genres || [] };
        }),
      );
      setMovieDetails(movieData);
    };

    if (results.length > 0) {
      fetchMovieDetails();
    }
  }, [results]);

  if (!results || results.length === 0) {
    return (
      <p className="text-center text-sm text-white/50">No data available</p>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between px-0 md:px-0">
        <Header title={"Popular Movies"} linkHref={"/movies"} />
        <Link
          href={"/movies"}
          className="rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 md:text-sm"
        >
          Explore More
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 px-0 sm:grid-cols-3 md:grid-cols-4 md:gap-4 md:px-0 lg:grid-cols-5 lg:gap-6">
        {movieDetails.slice(0, 10).map((movie) => {
          const { id, title, release_date, vote_average, poster_path, genres } =
            movie;
          const releaseYear = release_date?.slice(0, 4) || "N/A";

          return (
            <div
              key={id}
              className="group relative overflow-hidden rounded-lg bg-neutral-900 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w300${poster_path}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  alt={title || "Movie poster"}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <Link
                    href={`/movies/${id}`}
                    className="scale-50 transform text-white transition-transform duration-300 group-hover:scale-100"
                  >
                    <IoPlayCircleOutline size={50} />
                  </Link>
                </div>

                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 backdrop-blur-md">
                  <FaStar className="text-[10px] text-yellow-400" />
                  <span className="text-[10px] font-bold text-white">
                    {vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-primary md:text-base">
                  {title}
                </h3>

                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-white/60">{releaseYear}</p>
                  <p className="max-w-[50%] truncate text-right text-[10px] text-white/40">
                    {genres?.[0]?.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCard;
