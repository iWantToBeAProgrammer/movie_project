"use client";

import Certification from "@/components/Certification";

import getMovieData from "@/libs/api-libs";
import Teaser from "./Teaser";
import { useState, useEffect } from "react";

const Hero = ({ movieResults }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isIntervalActive, setIsIntervalActive] = useState(true);

  useEffect(() => {
    if (movieResults.length === 0) return;

    const handleMouseMove = () => {
      setIsIntervalActive(false);
      clearTimeout(window.mouseMoveTimeout);
      window.mouseMoveTimeout = setTimeout(() => {
        setIsIntervalActive(true);
      }, 7000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const interval = isIntervalActive
      ? setInterval(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex + 1 < movieResults.length ? prevIndex + 1 : 0
          );
        }, 7000)
      : null;

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [movieResults, isIntervalActive]);

  useEffect(() => {
    if (movieResults.length === 0) return;

    const fetchMovieDetails = async () => {
      const result = movieResults[currentIndex];
      const details = await getMovieData(
        result.id,
        "&append_to_response=videos,release_dates"
      );
      setMovieDetails(details);
    };

    fetchMovieDetails();
  }, [currentIndex, movieResults]);

  if (movieResults.length === 0 || !movieDetails) return <div>Loading...</div>;

  const result = movieResults[currentIndex];
  const bgBackdrop = result.backdrop_path;
  const backdropPath = `${process.env.NEXT_APP_BASEIMG}${bgBackdrop}`;

  const certification = movieDetails.release_dates.results.find(
    (result) => result.iso_3166_1 === "ID"
  )?.release_dates[0]?.certification;

  const movieTeaser = movieDetails.videos.results
    .filter((result) => result.type === "Teaser")
    .slice(0, 3);

  return (
    <>
      <div
        className={`w-full bg-[image:var(--backdrop-url)] h-screen bg-no-repeat bg-center bg-cover transition duration-300 ease-in-out`}
        style={{ "--backdrop-url": `url(${backdropPath})` }}
      >
        <div className="absolute w-full h-full blur-overlay backdrop-blur-md"></div>
        <div className="relative flex items-center justify-center w-full h-full hero">
          <div className="hero-wrapper w-11/12 lg:w-9/12 lg:h-[80%] h-[84%] bg-[image:var(--backdrop-url)] bg-center bg-cover bg-no-repeat px-4 lg:px-8 pb-4 lg:pb-12 lg:py-0 py-10 rounded-md font-bebas_neue text-4xl flex lg:justify-between justify-start ">
            <div className="flex flex-col items-start justify-end w-full h-full lg:w-1/2 hero-left-content me-6 ">
              <h1 className="mb-2 text-2xl lg:text-4xl">
                {result.title} ({result.release_date.slice(0, 4)})
              </h1>
              <div className="flex items-center gap-4 text-2xl lg:text-4xl lg:gap-16">
                <Certification result={certification} />
                <span>{result.release_date}</span>
              </div>
              <div className="flex flex-col items-start w-full gap-3 my-2 text-base font-medium lg:items-center lg:flex-row lg:my-8 lg:text-xl genres font-raleway">
                <h1 className="hidden lg:flex me-4">Genre</h1>
                <div className="grid grid-cols-3 gap-2 lg:flex">
                  {movieDetails.genres.map((data, index) => {
                    return (
                      <div key={data.id} className="flex items-center gap-2">
                        <span
                          className={`${index == 0 && "lg:hidden flex"} text-secondary`}
                        >
                          /
                        </span>
                        <h1>{data.name}</h1>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-base font-light lg:text-xl hero-description font-raleway_italic">
                {result.overview}
              </div>

              <div className="flex items-center gap-2 mt-4 lg:mt-8 lg:gap-8 hero-button-wrapper">
                <button className="w-24 text-sm shadow-xl lg:text-xl lg:w-48 btn btn-neutral btn-sm">
                  Add Watchlist
                </button>
                <button className="w-24 text-sm shadow-xl lg:text-xl lg:w-48 btn btn-neutral btn-sm">
                  Watch Trailer
                </button>
              </div>
            </div>

            <div className="hidden w-3/6 lg:flex hero-right-content">
              <Teaser movieTeaser={movieTeaser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
