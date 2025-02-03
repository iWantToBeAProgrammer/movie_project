"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMovieData } from "@/libs/api-libs";

const PopularCard = ({ results = [] }) => {
  const [movieDetails, setMovieDetails] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieData = await Promise.all(
        results.map(async (movie) => {
          const details = await getMovieData(movie.id, "&append_to_response=genres");
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
      <div className="flex justify-end mb-8">
        <button
          onClick={() => router.push("/popular")}
          className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition"
        >
          Explore More
        </button>
      </div>

      <div className="w-full mt-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-16">
          {movieDetails.slice(0, 10).map((movie) => {
            const { id, title, release_date, vote_average, poster_path, genres } = movie;
            const releaseYear = release_date?.slice(0, 4) || "Unknown";

            return (
              <div
                key={id}
                className="relative bg-black text-white rounded-lg border border-secondary shadow-md group hover:bg-secondary hover:bg-opacity-50 transition-colors duration-300 flex flex-col"
                style={{ height: "100%" }}
              >
                {/* Poster */}
                <div className="flex justify-center -mt-12">
                  <div className="relative w-3/4 aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                      fill
                      alt={title || "Movie poster"}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => router.push(`/movies/${id}`)}
                        className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-auto p-4">
                  <p id="rating" className="text-sm font-semibold text-center group-hover:text-white mb-2">
                    {(vote_average).toFixed(2)}/10
                  </p>

                  <div className="flex justify-center items-center">
                  <h1 id="title-year" className="text-sm font-bold uppercase flex-wrap text-center">
                    {title}
                  </h1>
                  </div>
                 
                  <h1 id="title-year" className="text-sm font-bold uppercase flex justify-center items-center flex-wrap text-center">
                    ({releaseYear})
                  </h1>

                  <div
                    id="genres"
                    className="genres font-raleway text-xs font-medium items-center flex gap-3 my-8 justify-center flex-wrap"
                    >
                    {genres && genres.length > 0
                        ? genres.map((genre, index) => (
                            <span key={genre.id} className="flex items-center">
                            <h1 className="text-xs">{genre.name}</h1>
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
