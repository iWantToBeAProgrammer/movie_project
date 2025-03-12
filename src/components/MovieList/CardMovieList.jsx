"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa";
import { IoPlayCircleOutline } from "react-icons/io5";

const CardMovieList = ({ results = [] }) => {
  const router = useRouter();

  return (
    <>
      {results.map((result) => {
        console.log(result);
        const releaseYear =
          result.release_date?.slice(0, 4) ||
          result.releaseDates?.slice(0, 4) ||
          "";

        return (
          <div key={result.id} className="w-full">
            <div className="relative group w-full aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={`${process.env.NEXT_APP_BASEIMG}${
                  result.poster_path || result.posterPath
                }`}
                fill
                className="object-cover"
                alt={result.title || "Movie poster"}
              />

              <div className="w-full group-hover:translate-y-0 bg-black/0 hover:bg-black/70 transition-colors duration-300 ease-in-out h-full">
                <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-white">
                  <button
                    className="text-6xl hover:scale-125 transition-all duration-300 ease-in-out"
                    onClick={() => router.push(`/movies/${result.id}`)}
                  >
                    <IoPlayCircleOutline />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 font-bebas_neue flex flex-col gap-2">
              <div className="flex gap-2 justify-center text-lg">
                <h1 className="line-clamp-1">{result.title}</h1>
                <p>{`(${releaseYear})`}</p>
              </div>
              <div className="flex justify-center items-center gap-2">
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
