// components/UserProfileLayout.jsx
"use client";

import WatchlistCard from "@/components/Profile/WatchlistCard";
import Image from "next/image";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { HiOutlinePencil } from "react-icons/hi";
import WatchlistModal from "@/components/Watchlist/WatchlistModal";
import CardMovieList from "./MovieList/CardMovieList";

export default function UserProfileLayout({
  setWatchlistData,
  onOpenCreate,
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

  const handleEditWatchlist = (watchlist) => {
    setWatchlistData({
      id: watchlist.id,
      name: watchlist.name,
      description: watchlist.description || "",
      picture: watchlist.picture,
    });
    document.getElementById("watchlist-modal").showModal();
  };

  return (
    <div className="profile-container mx-auto mt-16 w-full max-w-(--breakpoint-xl) overflow-hidden px-4 pt-6 sm:pt-8 md:pt-20 lg:mt-0 lg:pt-28">
      <div className="profile-wrapper flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="profile-content-left w-full lg:w-3/4">
          <header className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <button
              disabled={isPublicView}
              onClick={() => {
                setUpdatedUserData({
                  username: userInfo.username,
                  profilePicture: userInfo.profilePicture,
                });
                document.getElementById("profile-modal").showModal();
              }}
              className={`profile-image-wrapper relative flex h-24 w-24 flex-shrink-0 sm:h-28 sm:w-28 md:h-32 md:w-32 ${
                !isPublicView && "cursor-pointer"
              } items-center justify-center overflow-hidden rounded-lg transition-transform duration-300 sm:rounded-xl md:rounded-2xl ${
                !isPublicView && "hover:scale-105 active:scale-95"
              }`}
            >
              <Image
                src={userInfo?.profilePicture || "/assets/images/noimage.jpg"}
                alt="profile"
                width={512}
                height={512}
                className="aspect-square h-full w-full object-cover object-center"
                priority
              />
              {!isPublicView && (
                <div className="profile-image-overlay absolute inset-0 z-10 flex flex-col items-center justify-center transition-colors duration-200 *:hidden hover:bg-black/70 hover:*:block">
                  <HiOutlinePencil
                    size={32}
                    className="sm:size-40 md:size-16"
                    weight="bold"
                  />
                </div>
              )}
            </button>

            {/* Header Content */}
            <div className="header-content flex flex-1 flex-col justify-between gap-2 sm:gap-3">
              <h1 className="profile-name text-xl leading-tight font-bold break-words sm:text-2xl md:text-4xl">
                {userInfo.username}
              </h1>

              {/* Stats */}
              <div className="profile-data flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                {[
                  { label: "Watchlists", count: totalWatchlist },
                  { label: "Favorites", count: totalFavorites },
                  { label: "Watched", count: totalWatched },
                ].map(({ label, count }) => (
                  <div
                    key={label}
                    className="flex min-w-fit flex-col items-center font-sans_caption"
                  >
                    <h3 className="text-base leading-none font-semibold sm:text-lg md:text-xl">
                      {count}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/60 sm:text-xs md:text-sm">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* Tabs Section */}
          <div
            role="tablist"
            className="tabs-bordered mt-6 tabs w-full overflow-x-auto sm:mt-8 md:mt-12"
          >
            <button
              role="tab"
              className={`tab ${
                tabValue === "watchlist" ? "tab-active" : ""
              } h-10 min-w-max font-bebas_neue text-lg whitespace-nowrap transition-colors duration-200 sm:h-12 sm:text-xl md:text-2xl`}
              onClick={() => setTabValue("watchlist")}
            >
              Watchlists
            </button>
            <div
              role="tabpanel"
              className="relative tab-content w-full border-t-white/30 py-4 sm:py-6 md:py-8"
            >
              {!isPublicView && (
                <div className="mb-3 flex w-full justify-end sm:mb-4">
                  <button
                    onClick={onOpenCreate}
                    className="add-watchlist-button group relative flex h-10 w-10 items-center justify-center rounded-lg bg-neutral/90 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-neutral active:scale-95 sm:h-12 sm:w-12 sm:rounded-xl md:rounded-2xl"
                    title="Add new watchlist"
                  >
                    <Plus
                      size={24}
                      className="text-primary group-hover:size-28"
                      weight="bold"
                    />
                  </button>
                </div>
              )}
              <WatchlistCard
                watchlists={watchlists}
                username={userInfo.username}
                onEdit={handleEditWatchlist}
              />
            </div>

            <button
              role="tab"
              onClick={() => setTabValue("favorites")}
              className={`tab ${isPublicView && "tab-disabled"} ${
                tabValue === "favorites" ? "tab-active" : ""
              } h-10 min-w-max font-bebas_neue text-lg whitespace-nowrap transition-colors duration-200 sm:h-12 sm:text-xl md:text-2xl`}
            >
              Favorites
            </button>
            <div
              role="tabpanel"
              className="tab-content w-full border-t-white/30 py-4 sm:py-6 md:py-8"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
                {favoriteMovies.length > 0 ? (
                  <CardMovieList results={favoriteMovies} />
                ) : (
                  <p className="col-span-full py-8 text-center text-xs text-white/30 sm:text-sm">
                    No favorite movies yet.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setTabValue("watched")}
              role="tab"
              className={`tab ${isPublicView && "tab-disabled"} ${
                tabValue === "watched" ? "tab-active" : ""
              } h-10 min-w-max font-bebas_neue text-lg whitespace-nowrap transition-colors duration-200 sm:h-12 sm:text-xl md:text-2xl`}
            >
              Watched
            </button>
            <div
              role="tabpanel"
              className="tab-content w-full border-t-white/30 py-4 sm:py-6 md:py-8"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
                {watchedMovies.length > 0 ? (
                  <CardMovieList results={watchedMovies} />
                ) : (
                  <p className="col-span-full py-8 text-center text-xs text-white/30 sm:text-sm">
                    No watched movies yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="profile-content-right w-full lg:w-1/4"></div>
      </div>

      {/* Watchlist Modal */}
      <dialog className="modal" id="watchlist-modal">
        <WatchlistModal
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          watchlistData={watchlistData}
        />
      </dialog>

      {/* Profile Modal */}
      <dialog className="modal" id="profile-modal">
        <div className="modal-box w-full max-w-xs p-6 sm:max-w-sm sm:p-8 md:max-w-xl md:p-10">
          <form method="dialog">
            <button className="btn absolute top-2 right-2 btn-circle btn-ghost transition-colors btn-sm hover:bg-white/10">
              ✕
            </button>
          </form>

          <form
            className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:gap-8"
            onSubmit={handleUpdateUserSubmit}
          >
            {/* Profile Picture */}
            <div className="profile-picture-modal flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl">
              <label
                htmlFor="profilePicture"
                className="group relative block cursor-pointer"
              >
                <Image
                  width={512}
                  height={512}
                  className="aspect-square h-24 w-24 object-cover object-center transition-opacity duration-200 group-hover:opacity-75 sm:h-28 sm:w-28 md:h-40 md:w-40"
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
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center transition-colors duration-200 *:hidden group-hover:bg-black/50 group-hover:*:block">
                  <HiOutlinePencil
                    size={32}
                    className="sm:size-40 md:size-48"
                    weight="bold"
                  />
                </div>
              </label>
            </div>

            {/* Form Data */}
            <div className="form-data flex h-full w-full flex-col items-center justify-end gap-3 sm:w-auto sm:items-end sm:gap-4">
              <label className="floating-label w-full sm:w-auto">
                <span className="mb-1 block text-sm font-medium">Username</span>
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-sm w-full transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none sm:input-md sm:w-56 md:input-lg md:w-72"
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
                className="btn w-full px-4 transition-all duration-200 btn-sm btn-primary hover:shadow-lg active:scale-95 sm:w-auto sm:px-5 sm:btn-md md:px-6 md:btn-lg"
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
