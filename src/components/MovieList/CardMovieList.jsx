"use client";

import Image from "next/image";
import React from "react";
import { FaRegStar } from "react-icons/fa";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";

const CardMovieList = ({ results = [] }) => {
  return (
    <>
      {results.map((result) => {
        const releaseYear =
          result.release_date?.slice(0, 4) ||
          result.releaseDates?.slice(0, 4) ||
          "Unknown";

        return (
          <div key={result.id} className="w-full">
            <Link href={`/movies/${result?.id}`}>
              <div className="group relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={`${process.env.NEXT_APP_BASEIMG}${
                    result.poster_path || result.posterPath
                  }`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={result.title || "Movie poster"}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <IoPlayCircleOutline className="text-6xl text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
            </Link>

            {/* Movie Info */}
            <div className="mt-2 flex flex-col gap-1 font-bebas_neue">
              <div className="flex flex-wrap justify-center gap-2 text-lg leading-tight">
                <Link
                  href={`/movies/${result?.id}`}
                  className="line-clamp-1 transition-colors hover:text-primary"
                >
                  {result.title}
                </Link>
                <span className="text-gray-400">{`(${releaseYear})`}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                <FaRegStar className="mb-0.5 text-yellow-400" />
                <p>
                  {result.vote_average ? result.vote_average.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardMovieList;
