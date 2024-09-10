'use client'

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

  const certification =
    movieDetails.release_dates.results.find(
      (result) => result.iso_3166_1 === "ID"
    )?.release_dates[0]?.certification

  const movieTeaser = movieDetails.videos.results
    .filter((result) => result.type === "Teaser")
    .slice(0, 3);

  return (
    <>
      <div
        className={`w-full bg-[image:var(--backdrop-url)] h-screen bg-no-repeat bg-center bg-cover transition duration-300 ease-in-out`}
        style={{ "--backdrop-url": `url(${backdropPath})` }}
      >
        <div className="blur-overlay h-full w-full backdrop-blur-md absolute"></div>
        <div className="hero w-full h-full flex items-center justify-center relative">
          <div className="hero-wrapper w-10/12 h-[80%] bg-[image:var(--backdrop-url)] bg-center bg-cover bg-no-repeat px-8 pb-12 rounded-md font-bebas_neue text-4xl flex justify-between">
            <div className="hero-left-content me-6 flex flex-col items-start w-1/2 justify-end h-full">
              <h1 className="mb-2">
                {result.title} ({result.release_date.slice(0, 4)})
              </h1>
              <div className="flex items-center gap-16">
                <Certification result={certification} />
                <span>{result.release_date}</span>
              </div>
              <div className="genres font-raleway text-xl font-medium items-center flex gap-3 my-8">
                <h1 className="me-6">Genre</h1>
                {movieDetails.genres.map((data, index) => {
                  return (
                    <div key={data.id} className="flex items-center gap-2">
                      <span
                        className={`${index == 0 && "hidden"} text-secondary`}
                      >
                        /
                      </span>
                      <h1>{data.name}</h1>
                    </div>
                  );
                })}
              </div>
              <div className="hero-description font-raleway_italic font-light text-xl">
                {result.overview}
              </div>

              <div className="hero-button-wrapper flex gap-8 items-center mt-8">
                <button className="btn btn-neutral shadow-xl btn-sm w-48 text-xl">
                  Add Watchlist
                </button>
                <button className="btn btn-neutral shadow-xl btn-sm w-48 text-xl">
                  Watch Trailer
                </button>
              </div>
            </div>
            <div className="hero-right-content w-2/5">
              <Teaser movieTeaser={movieTeaser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
