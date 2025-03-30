"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { getMovieData } from "@/libs/api-libs";
import Header from "./Header";
import { IoPlayCircleOutline } from "react-icons/io5";
import Link from "next/link";

const PopularCard = ({ results = [] }) => {
  const [movieDetails, setMovieDetails] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieData = await Promise.all(
        results.map(async (movie) => {
          const details = await getMovieData(
            movie.id,
            "&append_to_response=genres"
          );
          return { ...movie, genres: details.genres || [] };
        })
      );
      setMovieDetails(movieData);
    };

    if (results.length > 0) {
      fetchMovieDetails();
    }
  }, [results]);

  if (!results || results.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <>
      <div className="flex justify-between mb-8 items-center">
        <Header title={"popular viewed movies"} linkHref={"/movies"} />

        <Link
          href={"/movies"}
          className="h-10  px-6 py-2 text-sm font-bold bg-linear-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition"
        >
          Explore More
        </Link>
      </div>

      <div className="w-full mt-20 tracking-wider">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 gap-y-16 lg:px-0 px-6">
          {movieDetails.slice(0, 6).map((movie) => {
            const {
              id,
              title,
              release_date,
              vote_average,
              poster_path,
              genres,
            } = movie;
            const releaseYear = release_date?.slice(0, 4) || "Unknown";

            return (
              <div
                key={id}
                className="relative bg-black text-white rounded-lg border border-secondary shadow-md group hover:bg-opacity-50 transition-all ease-in-out duration-300 flex flex-col"
                style={{ height: "100%" }}
              >
                {/* Poster */}
                <div className="flex justify-center">
                  <div className="relative w-3/4 aspect-2/3 overflow-hidden rounded-lg shadow-lg transform -translate-y-8 group-hover:translate-y-28 transition-all duration-500 ease-in-out">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                      fill
                      alt={title || "Movie poster"}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <Link
                        className="text-8xl hover:scale-125 transition-all duration-300 ease-in-out"
                        href={`/movies/${id}`}
                      >
                        <IoPlayCircleOutline />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-auto p-4 group-hover:opacity-0 transition-opacity duration-300 ease-in-out">
                  <p
                    id="rating"
                    className="text-sm font-semibold text-center group-hover:text-white mb-6"
                  >
                    {vote_average.toFixed(2)}/10
                  </p>

                  <div className="flex justify-center items-center">
                    <h1
                      id="title"
                      className="text-xl uppercase flex-wrap text-center"
                    >
                      {title}
                    </h1>
                  </div>

                  <h1
                    id="title-year"
                    className="text-lg uppercase flex justify-center items-center flex-wrap text-center"
                  >
                    ({releaseYear})
                  </h1>

                  <div
                    id="genres"
                    className="genres text-sm px-4 font-semibold items-center flex gap-3 my-6 justify-center flex-wrap"
                  >
                    {genres && genres.length > 0
                      ? genres.map((genre, index) => (
                          <span key={genre.id} className="flex items-center">
                            <h1 className="font-raleway text-center">
                              {genre.name}
                            </h1>
                            {index < genres.length - 1 && (
                              <span className="text-secondary ml-2">/</span>
                            )}
                          </span>
                        ))
                      : "No genres"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PopularCard;
