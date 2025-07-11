"use client";

import WatchlistCard from "@/components/Profile/WatchlistCard";
import {
  createWatchlist,
  fetchProfileData,
  updateProfileData,
} from "@/libs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import CardMovieList from "@/components/MovieList/CardMovieList";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import WatchlistModal from "@/components/Watchlist/WatchlistModal";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { IoPencil } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";

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

  const { members, favoriteMovies, watchedMovies } = data?.profile ?? [];
  const { username, profilePicture } = data?.profile ?? "";

  const [updatedUserData, setUpdatedUserData] = useState({
    username: username,
    profilePicture: profilePicture,
  });

  const totalWatchlist = members?.length || 0;
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

  const handleUserImageChange = (e) => {
    const file = e.target.files[0];
    setUpdatedUserData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(watchlistData);
  };

  const updateMutation = useMutation({
    mutationFn: updateProfileData,
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["profile"]);
      document.getElementById("profile-modal").close();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(updatedUserData);
  };

  const enrichedWatchlists = members.map((membership) => {
    const watchlist = membership.watchlist;

    const owner = watchlist.members.find((member) => member.role === "OWNER");

    return {
      ...watchlist,
      owner: owner?.user || null,
    };
  });

  const formattedData = {
    favoriteMovies: favoriteMovies?.map((item) => item.movie),
    watchedMovies: watchedMovies?.map((item) => item.movie),
  };

  console.log(data)


  const [tabValue, setTabValue] = useState("watchlist");

  return (
    <>
      <Navbar />
      <div className="profile-container mx-auto mt-28 w-full max-w-(--breakpoint-xl) overflow-hidden">
        <div className="profile-wrapper flex gap-4">
          <div className="profile-content-left w-3/4">
            <header className="flex gap-8">
              <button
                onClick={() =>
                  document.getElementById("profile-modal").showModal()
                }
                className="profile-image-wrapper relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl"
              >
                <Image
                  src={`${profilePicture || "/assets/images/noimage.jpg"}`}
                  alt="profile"
                  width={512}
                  height={512}
                  className="aspect-square h-full w-full object-cover object-center"
                />

                <div className="profile-image-overlay absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center transition duration-200 ease-out *:hidden hover:bg-black/70 hover:*:block">
                  <HiOutlinePencil size={64} />
                </div>
              </button>
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
                <WatchlistCard
                  watchlists={enrichedWatchlists}
                  username={username}
                />
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

        <dialog className="modal" id="profile-modal">
          <div className="modal-box max-w-xl p-10">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
                ✕
              </button>
            </form>
            <form
              className="flex items-center gap-8"
              onSubmit={handleUpdateUserSubmit}
            >
              <div className="profile-picture-modal overflow-hidden rounded-2xl">
                <label htmlFor="profilePicture" className="relative">
                  <Image
                    width={512}
                    height={512}
                    className="aspect-square object-cover object-center"
                    src={
                      updatedUserData.profilePicture instanceof File
                        ? URL.createObjectURL(updatedUserData.profilePicture)
                        : updatedUserData.profilePicture ||
                          "/assets/images/noimage.jpg"
                    }
                    alt="User Profile Preview"
                  />
                  <input
                    type="file"
                    name="profilePicture"
                    id="profilePicture"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUserImageChange}
                  />

                  <div className="absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center *:hidden hover:bg-black/50 hover:*:block">
                    <HiOutlinePencil size={64} weight="bold" />
                  </div>
                </label>
              </div>

              <div className="form-data flex h-full flex-col items-end justify-end text-end">
                <label className="floating-label">
                  <span className="block">Username</span>
                  <input
                    type="text"
                    placeholder="Username"
                    className="input input-lg w-72 focus:outline-none"
                    name="username"
                    value={updatedUserData.username}
                    onChange={(e) =>
                      setUpdatedUserData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="btn mt-5 px-6 btn-lg btn-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>
  );
}
