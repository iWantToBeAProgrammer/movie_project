"use client";

import BackNavigation from "@/components/Common/BackNavigation";
import WatchlistCard from "@/components/Profile/WatchlistCard";
import { createWatchlist, fetchProfileData } from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Loading from "../loading";
import { Suspense, useState } from "react";
import CardMovieList from "@/components/MovieList/CardMovieList";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import WatchlistModal from "@/components/Watchlist/WatchlistModal";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function Profile() {
  const { data, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileData,
    suspense: true,
  });

  const [watchlistData, setWatchlistData] = useState({
    name: "",
    description: "",
    picture: null,
  });

  const { watchlists, favoriteMovies, watchedMovies } = data?.profile ?? [];
  const { username } = data?.user ?? "";

  const totalWatchlist = watchlists?.length || 0;
  const totalFavorites = favoriteMovies?.length || 0;
  const totalWatched = watchedMovies?.length || 0;

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatchlistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setWatchlistData((prev) => ({ ...prev, picture: file }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: createWatchlist,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["watchlist"]);
      setWatchlistData({
        name: "",
        description: "",
        picture: null,
      });
      document.getElementById("watchlist-modal").close();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create watchlist");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(watchlistData);
  };

  const formattedData = {
    favoriteMovies: favoriteMovies?.map((item) => item.movie),
    watchedMovies: watchedMovies?.map((item) => item.movie),
  };

  console.log(formattedData);

  const [tabValue, setTabValue] = useState("watchlist");

  return (
    <>
      <Navbar />
      <div className="profile-container mx-auto mt-28 w-full max-w-(--breakpoint-xl) overflow-hidden">
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
                <h1 className="profile-name text-4xl">{username}</h1>
                <div className="profile-data flex gap-4">
                  <div className="watchlist-total flex flex-col items-center font-sans_caption">
                    <h3 className="watchlist-total-data text-xl">
                      {totalWatchlist}
                    </h3>
                    <p className="watchlist-total-text">Watchlists</p>
                  </div>
                  <div className="favorite-total flex flex-col items-center font-sans_caption">
                    <h3 className="favorite-total-data text-xl">
                      {totalFavorites}
                    </h3>
                    <p className="favorite-total-text">Favorites</p>
                  </div>
                  <div className="watched-total flex flex-col items-center font-sans_caption">
                    <h3 className="watched-total-data text-xl">
                      {totalWatched}
                    </h3>
                    <p className="watched-total-text">Watched</p>
                  </div>
                </div>
              </div>
            </header>

            <div role="tablist" className="tabs-bordered mt-12 tabs w-full">
              <button
                role="tab"
                className={`tab ${
                  tabValue === "watchlist" ? "tab-active" : ""
                } h-12 font-bebas_neue text-2xl`}
                onClick={() => setTabValue("watchlist")}
              >
                Watchlists
              </button>
              <div
                role="tabpanel"
                className="relative tab-content border-t-white/30 py-8"
              >
                <div className="mb-4 flex w-full justify-end">
                  <button
                    onClick={() =>
                      document.getElementById("watchlist-modal").showModal()
                    }
                    className="add-watchlist-button rounded-2xl bg-neutral/90 p-4 transition-all duration-200 ease-in-out btn-md hover:scale-110 hover:bg-neutral"
                  >
                    <Plus size={32} className="text-primary" weight="bold" />
                  </button>
                </div>
                <WatchlistCard watchlists={watchlists} username={username} />
              </div>
              <button
                role="tab"
                onClick={() => setTabValue("favorites")}
                className={`tab ${
                  tabValue === "favorites" ? "tab-active" : ""
                } h-12 font-bebas_neue text-2xl`}
              >
                Favorites
              </button>
              <div
                role="tabpanel"
                className="tab-content border-t-white/30 py-10"
              >
                <div className="grid grid-cols-3 gap-4">
                  {formattedData.favoriteMovies.length > 0 ? (
                    <CardMovieList results={formattedData.favoriteMovies} />
                  ) : (
                    <p className="text-white/30">No favorite movies yet.</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setTabValue("watched")}
                role="tab"
                className={`tab ${
                  tabValue === "watched" ? "tab-active" : ""
                } h-12 font-bebas_neue text-2xl`}
              >
                Watched
              </button>
              <div
                role="tabpanel"
                className="tab-content border-t-white/30 py-10"
              >
                {formattedData.watchedMovies.length > 0 ? (
                  <CardMovieList results={formattedData.watchedMovies} />
                ) : (
                  <p className="text-white/30">No watched movies yet.</p>
                )}
              </div>
            </div>
          </div>
          <div className="profile-content-right"></div>
        </div>

        <dialog className="modal" id="watchlist-modal">
          <WatchlistModal
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            watchlistData={watchlistData}
          />
        </dialog>
      </div>
    </>
  );
}
