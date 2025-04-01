"use client";

import Certification from "@/components/Certification";
import Teaser from "./Teaser";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormMutation, useWatchlistMutation } from "@/hooks/useFormMutation";
import { createWatchlist, fetchMovieDetails } from "@/libs/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import WatchlistDropdown from "./Watchlist/WatchlistDropdown";
import WatchlistModal from "./Watchlist/WatchlistModal";
import Loading from "@/app/loading";
import { getMovieData } from "@/libs/api-libs";
import { useAuth } from "@/app/contexts/AuthContext";

const Hero = ({ movieResults }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isIntervalActive, setIsIntervalActive] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  const result = movieResults[currentIndex] || {};
  const { user } = useAuth();

  const [watchlistData, setWatchlistData] = useState({
    watchlistId: null,
    name: "",
    description: "",
    picture: null,
    tmdbId: result.id,
  });

  useEffect(() => {
    if (movieResults.length === 0) return;

    setWatchlistData((prev) => ({ ...prev, tmdbId: result.id }));

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
            prevIndex + 1 < movieResults.length ? prevIndex + 1 : 0,
          );
        }, 7000)
      : null;

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [movieResults, isIntervalActive]);

  const { data: movieDetails, isPending: isLoadingTMDB } = useQuery({
    queryKey: ["tmdb-movie-details", result.id],
    queryFn: () =>
      getMovieData(result.id, "&append_to_response=videos,release_dates"),
    enabled: !!result.id,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isPending } = useQuery({
    queryKey: ["movie-details", result.id],
    queryFn: () => fetchMovieDetails(null, result.id),
    enabled: !!result.id,
    suspense: true,
  });

  const handleAddToWatchlistClick = () => {
    !user
      ? document.getElementById("error-notification").showModal()
      : document.getElementById("watchlist_modal").showModal();
  };

  const {
    formData,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleSubmitWithId,
    isLoading,
  } = useWatchlistMutation({
    initialData: watchlistData,
    mutationFn: createWatchlist,
    queryKey: "watchlist",
    modalId: "watchlist_modal",
  });

  const handleSubmitToExistingWatchlist = (watchlistId) => {
    handleSubmitWithId(watchlistId, "watchlistId", { tmdbId: result.id });
  };

  useEffect(() => {
    if (movieResults.length <= 1) return;

    const nextIndex = (currentIndex + 1) % movieResults.length;
    const nextMovieId = movieResults[nextIndex]?.id;

    if (nextMovieId) {
      queryClient.prefetchQuery({
        queryKey: ["tmdb-movie-details", nextMovieId],
        queryFn: () =>
          getMovieData(nextMovieId, "&append_to_response=videos,release_dates"),
        staleTime: 5 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ["movie-details", nextMovieId],
        queryFn: () => fetchMovieDetails(null, nextMovieId),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [currentIndex, movieResults, queryClient]);

  if (movieResults.length === 0 || !movieDetails) return null;

  const bgBackdrop = result.backdrop_path;
  const backdropPath = `${process.env.NEXT_APP_BASEIMG}${bgBackdrop}`;

  const certification = movieDetails.release_dates.results.find(
    (result) => result.iso_3166_1 === "ID",
  )?.release_dates[0]?.certification;

  const movieTeaser = movieDetails.videos.results
    .filter((result) => result.type === "Teaser")
    .slice(0, 2);

  return (
    <>
      <div
        className={`mb-4 h-screen w-full bg-[image:var(--backdrop-url)] bg-cover bg-center bg-no-repeat transition duration-300 ease-in-out md:mb-8`}
        style={{ "--backdrop-url": `url(${backdropPath})` }}
      >
        <div className="blur-overlay absolute h-full w-full backdrop-blur-md"></div>
        <div className="relative hero flex h-full w-full items-center justify-center">
          <div className="hero-wrapper flex h-[80%] w-full max-w-(--breakpoint-xl) justify-between rounded-2xl bg-[image:var(--backdrop-url)] bg-cover bg-center bg-no-repeat px-8 pb-12 font-bebas_neue text-3xl">
            <div className="hero-left-content relative z-30 me-6 flex h-full w-[40%] flex-col items-start justify-end">
              <h1 className="mb-2">
                {result.title} ({result.release_date.slice(0, 4)})
              </h1>
              <div className="flex items-center gap-4 text-2xl lg:gap-16 lg:text-4xl">
                <Certification result={certification} />
                <span>{result.release_date}</span>
              </div>
              <div className="genres my-8 flex items-center gap-3 font-raleway text-xl font-medium">
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
              <div className="hero-description line-clamp-3 font-raleway_italic text-base hover:line-clamp-none">
                {result.overview}
              </div>

              <div className="hero-button-wrapper mt-4 flex items-center gap-2 lg:mt-8 lg:gap-8">
                <div className="dropdown dropdown-bottom">
                  <div
                    role="button"
                    tabIndex={0}
                    className="btn w-24 text-sm shadow-xl btn-sm btn-neutral lg:w-48 lg:text-xl"
                  >
                    Add To Watchlist
                  </div>

                  <WatchlistDropdown
                    showModal={handleAddToWatchlistClick}
                    handleSubmitToExistingWatchlist={
                      handleSubmitToExistingWatchlist
                    }
                    watchlists={data?.watchlists}
                  />
                </div>

                <button
                  className="btn w-24 text-sm shadow-xl btn-sm btn-neutral lg:w-48 lg:text-xl"
                  onClick={() =>
                    router.push(`/movies/${result.id}?autoplay=true`)
                  }
                >
                  Watch Trailer
                </button>
              </div>
            </div>
            <div className="hero-right-content reltaive z-30 h-full w-1/2">
              <Teaser movieTeaser={movieTeaser} />
            </div>

            <div className="bottom-overlay absolute bottom-0 left-0 z-0 h-full w-full bg-linear-to-b from-black/20 to-black/80"></div>
          </div>
        </div>
      </div>

      <dialog id="watchlist_modal" className="modal">
        <WatchlistModal
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={(e) => handleSubmit(e, result.id)}
          watchlistData={formData}
        />
      </dialog>
    </>
  );
};

export default Hero;
