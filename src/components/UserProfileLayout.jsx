// components/UserProfileLayout.jsx
"use client";

import WatchlistCard from "@/components/Profile/WatchlistCard";
import Image from "next/image";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { HiOutlinePencil } from "react-icons/hi";
import WatchlistModal from "@/components/Watchlist/WatchlistModal";
import CardMovieList from "./MovieList/CardMovieList";

export default function UserProfileLayout({
  userInfo,
  watchedMovies,
  favoriteMovies,
  watchlists,
  tabValue,
  setTabValue,
  updatedUserData,
  setUpdatedUserData,
  watchlistData,
  handleUserImageChange,
  handleChange,
  handleImageChange,
  handleSubmit,
  handleUpdateUserSubmit,
  isPublicView = false,
}) {
  const totalWatchlist = watchlists.length;
  const totalFavorites = favoriteMovies.length;
  const totalWatched = watchedMovies.length;

  return (
    <div className="profile-container mx-auto mt-28 w-full max-w-(--breakpoint-xl) overflow-hidden">
      <div className="profile-wrapper flex gap-4">
        <div className="profile-content-left w-3/4">
          <header className="flex gap-8">
            <button
              disabled={isPublicView}
              onClick={() => {
                setUpdatedUserData({
                  username: userInfo.username,
                  profilePicture: userInfo.profilePicture,
                });
                document.getElementById("profile-modal").showModal();
              }}
              className={`profile-image-wrapper relative flex h-32 w-32 ${!isPublicView && "cursor-pointer"} items-center justify-center overflow-hidden rounded-2xl`}
            >
              <Image
                src={userInfo?.profilePicture || "/assets/images/noimage.jpg"}
                alt="profile"
                width={512}
                height={512}
                className="aspect-square h-full w-full object-cover object-center"
              />
              {!isPublicView && (
                <div className="profile-image-overlay absolute top-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center transition duration-200 ease-out *:hidden hover:bg-black/70 hover:*:block">
                  <HiOutlinePencil size={64} />
                </div>
              )}
            </button>

            <div className="header-content flex flex-col justify-between py-2">
              <h1 className="profile-name text-4xl">{userInfo.username}</h1>
              <div className="profile-data flex gap-4">
                {[
                  { label: "Watchlists", count: totalWatchlist },
                  { label: "Favorites", count: totalFavorites },
                  { label: "Watched", count: totalWatched },
                ].map(({ label, count }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center font-sans_caption"
                  >
                    <h3 className="text-xl">{count}</h3>
                    <p className="text-sm">{label}</p>
                  </div>
                ))}
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
              {!isPublicView && (
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
              )}
              <WatchlistCard watchlists={watchlists} />
            </div>
            <button
              role="tab"
              onClick={() => setTabValue("favorites")}
              className={`tab ${isPublicView && "tab-disabled"} ${
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
                {favoriteMovies.length > 0 ? (
                  <CardMovieList results={favoriteMovies} />
                ) : (
                  <p className="text-white/30">No favorite movies yet.</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setTabValue("watched")}
              role="tab"
              className={`tab ${isPublicView && "tab-disabled"} ${
                tabValue === "watched" ? "tab-active" : ""
              } h-12 font-bebas_neue text-2xl`}
            >
              Watched
            </button>
            <div
              role="tabpanel"
              className="tab-content border-t-white/30 py-10"
            >
              <div className="grid grid-cols-3 gap-4">
                {watchedMovies.length > 0 ? (
                  <CardMovieList results={watchedMovies} />
                ) : (
                  <p className="text-white/30">No watched movies yet.</p>
                )}
              </div>
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
                    updatedUserData?.profilePicture instanceof File
                      ? URL.createObjectURL(updatedUserData?.profilePicture)
                      : updatedUserData?.profilePicture ||
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
                  value={updatedUserData?.username}
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
  );
}
