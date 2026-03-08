import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

import { useQueryClient } from "@tanstack/react-query";
import { getMovieData } from "@/libs/api-libs";

const SearchCard = ({ movie }) => {
  const queryClient = useQueryClient();

  const prefetchMovie = (id) => {
    queryClient.prefetchQuery({
      queryKey: ["movie-detail", id],
      queryFn: () => getMovieData(id, "&append_to_response=release_dates,videos,credits,recommendations"),
      staleTime: 1000 * 60 * 5,
    });
  };

  const releaseYear =
    movie.release_date?.slice(0, 4) || movie.releaseDate?.slice(0, 4) || "N/A";

  return (
    <div
      onMouseEnter={() => prefetchMovie(movie.id)}
      className="flex flex-col md:flex-row gap-6 border-b border-white/10 py-8 transition-colors hover:bg-white/5 px-4 rounded-xl group"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full md:w-48 shrink-0 overflow-hidden rounded-xl shadow-2xl">
        <Image
          src={
            movie.poster_path || movie.posterPath
              ? `${process.env.NEXT_APP_BASEIMG}${movie.poster_path || movie.posterPath}`
              : "/assets/images/noimage.jpg"
          }
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          alt={movie.title || "Movie poster"}
          sizes="(max-width: 768px) 100vw, 200px"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/movies/${movie?.id}`}
            className="scale-50 transform text-white transition-transform duration-300 group-hover:scale-100"
          >
            <IoPlayCircleOutline size={64} />
          </Link>
        </div>

        {/* Rating Badge on Poster (Mobile Only) */}
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 backdrop-blur-md md:hidden">
          <FaStar className="text-yellow-400 text-xs" />
          <span className="text-xs font-bold text-white">
            {movie.vote_average?.toFixed(1) || "0.0"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center gap-3 font-sans_caption">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Link href={`/movies/${movie?.id}`}>
            <h2 className="font-bebas_neue line-clamp-1 text-3xl tracking-wide text-white group-hover:text-primary transition-colors md:text-4xl">
              {movie.title}
            </h2>
          </Link>
          <span className="text-xl text-white/40 md:text-2xl font-raleway">
            ({releaseYear})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-bold text-white">
              {movie.vote_average?.toFixed(1) || "0.0"}
            </span>
          </div>
          <p className="text-sm font-medium text-white/60 md:text-base">
            {movie.runtime || "N/A"}
          </p>
          {movie.certification && movie.certification !== "N/A" && (
            <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white/40">
              {movie.certification}
            </span>
          )}
        </div>

        <p className="line-clamp-2 md:line-clamp-3 text-base text-white/50 leading-relaxed max-w-3xl">
          {movie.overview || "No overview available for this movie."}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {movie.genres?.slice(0, 3).map((genre, index) => (
            <span
              key={index}
              className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default SearchCard;
