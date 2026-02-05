"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";

const CardMovieList = ({ results = [] }) => {
  const router = useRouter();

  return (
    <>
      {results.map((result) => {
        const releaseYear =
          result.release_date?.slice(0, 4) ||
          result.releaseDates?.slice(0, 4) ||
          "Unknown Release Dates";
        


        return (
          <div key={result.id} className="w-full">
            <div className="group relative aspect-2/3 w-full overflow-hidden rounded-lg">
              <Image
                src={`${process.env.NEXT_APP_BASEIMG}${
                  result.poster_path || result.posterPath
                }`}
                fill
                className="object-cover"
                alt={result.title || "Movie poster"}
              />

              <div className="h-full w-full bg-black/0 transition-colors duration-300 ease-in-out group-hover:translate-y-0 hover:bg-black/70">
                <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-white">
                  <Link
                    className="text-6xl transition-all duration-300 ease-in-out hover:scale-125"
                    href={`/movies/${result?.id}`}
                  >
                    <IoPlayCircleOutline />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-2 font-bebas_neue">
              <div className="flex justify-center gap-2 text-lg">
                <h1 className="line-clamp-1">{result.title}</h1>
                <p>{`(${releaseYear})`}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FaRegStar className="text-yellow-400" />
                <p>{result.vote_average.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardMovieList;
