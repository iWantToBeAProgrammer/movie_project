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

  const getProfilePreview = () => {
    if (updatedUserData?.profilePicture instanceof File) {
      return URL.createObjectURL(updatedUserData.profilePicture);
    }
    if (updatedUserData?.profilePicture) {
      return updatedUserData.profilePicture;
    }
    return userInfo?.profilePicture || "/assets/images/noimage.jpg";
  };

  return (
    <div className="profile-container relative mx-auto mt-16 w-full max-w-7xl overflow-x-hidden px-4 pt-6 sm:pt-8 md:pt-20 lg:mt-0 lg:pt-28">
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
                <div className="profile-image-overlay absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 hover:bg-black/70 hover:opacity-100">
                  <HiOutlinePencil
                    size={32}
                    className="text-white sm:size-40 md:size-10"
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
          <div className="mt-6 w-full sm:mt-8 md:mt-12">
            <div role="tablist" className="tabs-bordered tabs w-full">
              <button
                role="tab"
                className={`tab ${
                  tabValue === "watchlist" ? "tab-active" : ""
                } h-10 min-w-max font-bebas_neue text-lg whitespace-nowrap transition-colors duration-200 sm:h-12 sm:text-xl md:text-2xl`}
                onClick={() => setTabValue("watchlist")}
              >
                Watchlists
              </button>

              <button
                role="tab"
                onClick={() => setTabValue("favorites")}
                className={`tab ${isPublicView && "tab-disabled"} ${
                  tabValue === "favorites" ? "tab-active" : ""
                } h-10 min-w-max font-bebas_neue text-lg whitespace-nowrap transition-colors duration-200 sm:h-12 sm:text-xl md:text-2xl`}
              >
                Favorites
              </button>

              <button
                onClick={() => setTabValue("watched")}
                role="tab"
                className={`tab ${isPublicView && "tab-disabled"} ${
                  tabValue === "watched" ? "tab-active" : ""
                } h-10 min-w-max font-bebas_neue text-lg whitespace-nowrap transition-colors duration-200 sm:h-12 sm:text-xl md:text-2xl`}
              >
                Watched
              </button>
            </div>

            {/* TAB PANELS (Dipisah biar structure lebih bersih dan ga bikin lebar layout) */}
            <div className="mt-4 w-full border-t border-white/30 pt-4 sm:pt-6 md:pt-8">
              {tabValue === "watchlist" && (
                <>
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
                </>
              )}

              {tabValue === "favorites" && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
                  {favoriteMovies.length > 0 ? (
                    <CardMovieList results={favoriteMovies} />
                  ) : (
                    <p className="col-span-full py-8 text-center text-xs text-white/30 sm:text-sm">
                      No favorite movies yet.
                    </p>
                  )}
                </div>
              )}

              {tabValue === "watched" && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
                  {watchedMovies.length > 0 ? (
                    <CardMovieList results={watchedMovies} />
                  ) : (
                    <p className="col-span-full py-8 text-center text-xs text-white/30 sm:text-sm">
                      No watched movies yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="profile-content-right w-full lg:w-1/4"></div>
      </div>

      {/* --- Watchlist Modal --- */}
      {/* FIX 2: Pastikan class modal-bottom dan sm:modal-middle ada di sini */}
      <dialog
        id="watchlist-modal"
        className="modal fixed inset-0 !flex modal-bottom h-screen w-screen !items-center !justify-center overflow-y-auto p-4 lg:p-0 pl-10 lg:pl-0"
      >
        <WatchlistModal
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          watchlistData={watchlistData}
        />
        {/* Backdrop agar bisa klik luar untuk close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* --- Profile Modal --- */}
      {/* FIX 3: Structure Modal Profile dirapikan */}
      <dialog id="profile-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-sm bg-[#1e1e1e] p-6 text-white md:max-w-xl md:p-10">
          <form method="dialog">
            <button className="btn absolute top-2 right-2 btn-circle text-white/60 btn-ghost transition-colors btn-sm hover:bg-white/10 hover:text-white">
              ✕
            </button>
          </form>

          <form
            className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
            onSubmit={handleUpdateUserSubmit}
          >
            {/* Profile Picture Upload */}
            <div className="flex-shrink-0">
              <label className="group relative block h-28 w-28 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-white/20 transition-all hover:border-white/50 md:h-40 md:w-40">
                <Image
                  width={512}
                  height={512}
                  className="h-full w-full object-cover object-center transition-opacity duration-200 group-hover:opacity-50"
                  src={getProfilePreview()}
                  alt="User Profile Preview"
                />
                <input
                  type="file"
                  name="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUserImageChange}
                />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
                    <HiOutlinePencil size={24} className="text-white" />
                  </div>
                </div>
              </label>
            </div>

            {/* Form Data */}
            <div className="flex h-full w-full flex-col justify-center gap-4">
              <div className="form-control w-full">
                <label className="label px-0">
                  <span className="label-text font-bold text-gray-400">
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  className="input-bordered input w-full bg-[#2a2a2a] text-white focus:border-primary focus:outline-none"
                  name="username"
                  value={updatedUserData?.username || ""}
                  onChange={(e) =>
                    setUpdatedUserData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>

              <button
                type="submit"
                className="btn mt-2 w-full font-bold text-white shadow-lg btn-primary hover:brightness-110 sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Backdrop agar bisa klik luar untuk close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
