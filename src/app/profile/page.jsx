"use client";

import BackNavigation from "@/components/Common/BackNavigation";
import WatchlistCard from "@/components/Profile/WatchlistCard";
import { fetchProfileData } from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Loading from "../loading";
import { Suspense, useState } from "react";
import CardMovieList from "@/components/MovieList/CardMovieList";

export default function Profile() {
  const { data, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileData,
    suspense: true,
  });

  const { watchlists, favoriteMovies, watchedMovies } = data?.profile ?? [];
  const { username } = data?.user ?? "";

  const totalWatchlist = watchlists?.length || 0;
  const totalFavorites = favoriteMovies?.length || 0;
  const totalWatched = watchedMovies?.length || 0;

  const formattedData = {
    favoriteMovies: favoriteMovies?.map((item) => item.movie),
    watchedMovies: watchedMovies?.map((item) => item.movie),
  };

  console.log(formattedData);

  const [tabValue, setTabValue] = useState("watchlist");

  return (
    <>
      <BackNavigation />
      <div className="profile-container w-full">
        <div className="profile-wrapper flex gap-4">
          <div className="profile-content-left w-3/4">
            <header className="flex gap-8">
              <Image
                src="/assets/images/noimage.jpg"
                alt="profile"
                width={120}
                height={120}
                className="rounded-2xl"
              />
              <div className="header-content flex flex-col justify-between py-2">
                <h1 className="profile-name text-4xl">Juan Stevenson</h1>
                <div className="profile-data flex gap-4">
                  <div className="watchlist-total font-sans_caption flex flex-col items-center">
                    <h3 className="watchlist-total-data text-xl">
                      {totalWatchlist}
                    </h3>
                    <p className="watchlist-total-text">Watchlists</p>
                  </div>
                  <div className="favorite-total font-sans_caption flex flex-col items-center">
                    <h3 className="favorite-total-data text-xl">
                      {totalFavorites}
                    </h3>
                    <p className="favorite-total-text">Favorites</p>
                  </div>
                  <div className="watched-total font-sans_caption flex flex-col items-center">
                    <h3 className="watched-total-data text-xl">
                      {totalWatched}
                    </h3>
                    <p className="watched-total-text">Watched</p>
                  </div>
                </div>
              </div>
            </header>
            <div role="tablist" className="tabs tabs-bordered w-full mt-12 ">
              <button
                role="tab"
                className={`tab ${
                  tabValue === "watchlist" ? "tab-active" : ""
                } font-bebas_neue text-2xl h-12`}
                onClick={() => setTabValue("watchlist")}
              >
                Watchlists
              </button>
              <div
                role="tabpanel"
                className="tab-content py-10 border-t-white/30"
              >
                <Suspense fallback={<Loading />}>
                  <WatchlistCard watchlists={watchlists} username={username} />
                </Suspense>
              </div>
              <button
                role="tab"
                onClick={() => setTabValue("favorites")}
                className={`tab ${
                  tabValue === "favorites" ? "tab-active" : ""
                }  font-bebas_neue text-2xl h-12`}
              >
                Favorites
              </button>
              <div
                role="tabpanel"
                className="tab-content py-10 border-t-white/30"
              >
                <div className="grid grid-cols-3 gap-4">
                  <CardMovieList results={formattedData.favoriteMovies} />
                </div>
              </div>
              <button
                onClick={() => setTabValue("watched")}
                role="tab"
                className={`tab ${
                  tabValue === "watched" ? "tab-active" : ""
                } font-bebas_neue text-2xl h-12 `}
              >
                Watched
              </button>
              <div
                role="tabpanel"
                className="tab-content py-10 border-t-white/30"
              >
                <div className="grid grid-cols-3 gap-4">
                  <CardMovieList results={formattedData.watchedMovies} />
                </div>
              </div>
            </div>
          </div>
          <div className="profile-content-right"></div>
        </div>
      </div>
    </>
  );
}
