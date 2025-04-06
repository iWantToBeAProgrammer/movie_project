import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

const SearchCard = ({ movie }) => {
  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours} h ${minutes} m`;
  };

  return (
    <div className="flex border-b py-5">
      <div className="flex h-72 w-60">
        <div className="group relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={`${process.env.NEXT_APP_BASEIMG}${
              movie.poster_path || movie.posterPath
            }`}
            fill
            className="h-full w-full object-cover"
            alt={movie.title || "Movie poster"}
          />

          <div className="h-full w-full bg-black/0 transition-colors duration-300 ease-in-out group-hover:translate-y-0 hover:bg-black/70">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-white">
              <Link
                className="text-6xl transition-all duration-300 ease-in-out hover:scale-125"
                href={`/movies/${movie?.id}`}
              >
                <IoPlayCircleOutline />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center gap-2 px-6 py-10 font-sans_caption text-pretty">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-raleway text-4xl">{movie.title}</h1>
          <h1 className="font-raleway text-2xl">
            {movie.vote_average.toFixed(1)}/10
          </h1>
        </div>
        <p className="line-clamp-3 text-xl text-slate-400">{movie.overview}</p>
        <p className="text-base text-slate-300">
          Genre ● Duration {formatRuntime(movie.runtime)}
        </p>
      </div>
    </div>
  );
};

export default SearchCard;
