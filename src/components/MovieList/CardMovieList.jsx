"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa";

const CardMovieList = ({ results = [] }) => {
  const router = useRouter();
  return (
    <>
      {results.map((result) => {
        const releaseYear = result.release_date?.slice(0, 4) || "";

        return (
          <div key={result.id} className="w-full">
            <div className="relative group w-full aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
                fill
                className="object-cover"
                alt={result.title || "Movie poster"}
              />

              <div className="w-full group-hover:translate-y-0 bg-black/0 hover:bg-black/70 transition-colors duration-300 ease-in-out h-full">
                <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-white">
                  <button
                    onClick={() => router.push(`/movies/${result.id}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    View Details
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
