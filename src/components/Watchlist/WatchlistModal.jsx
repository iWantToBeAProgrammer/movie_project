import { Pencil, Camera } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

const WatchlistModal = ({
  handleSubmit,
  watchlistData,
  handleImageChange,
  handleChange,
  isLoading,
}) => {
  const isEditMode = Boolean(watchlistData?.watchlistId || watchlistData?.id);

  const getImagePreview = () => {
    if (watchlistData?.picture instanceof File) {
      return URL.createObjectURL(watchlistData.picture);
    }
    if (typeof watchlistData?.picture === "string" && watchlistData?.picture) {
      return watchlistData.picture;
    }
    return "/assets/images/watchlist-default.jpg";
  };

  return (
    <div className="modal-box w-11/12 max-w-3xl bg-[#1e1e1e] p-6 text-white md:p-8 rounded-2xl">
      <form method="dialog">
        <button className="btn absolute top-4 right-4 btn-circle text-white/60 btn-ghost btn-sm hover:text-white">
          ✕
        </button>
      </form>

      <h1 className="mb-6 font-bebas_neue text-2xl font-bold tracking-wide md:text-3xl">
        {isEditMode ? "Edit Details" : "Create Watchlist"}
      </h1>

      <form
        className="flex flex-col gap-6 md:flex-row"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex w-full flex-col items-center md:w-1/3">
          <label
            htmlFor="picture"
            className="group relative block aspect-square w-40 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-white/20 bg-black/20 transition-all hover:border-white/50 md:w-full"
          >
            <Image
              src={getImagePreview()}
              alt="Watchlist Preview"
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-50"
              sizes="(max-width: 768px) 100vw, 33vw"
            />

            <input
              type="file"
              name="picture"
              id="picture"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="rounded-full bg-black/50 p-3 backdrop-blur-sm">
                <Pencil size={32} weight="bold" className="text-white" />
              </div>
              <p className="mt-2 text-xs font-bold tracking-wider text-white uppercase">
                Change Cover
              </p>
            </div>

            <div className="absolute right-2 bottom-2 rounded-full bg-black/60 p-1.5 md:hidden">
              <Camera size={16} className="text-white" />
            </div>
          </label>
        </div>

        <div className="flex w-full flex-col gap-4 md:w-2/3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold text-gray-400">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Weekend Vibes, Horror Night"
              className="input-bordered input w-full bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-primary focus:outline-none"
              value={watchlistData?.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control w-full grow">
            <label className="label">
              <span className="label-text font-bold text-gray-400">
                Description
              </span>
            </label>
            <textarea
              name="description"
              className="textarea-bordered textarea h-32 w-full resize-none bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-primary focus:outline-none md:h-full"
              placeholder="Tell us what this list is about..."
              value={watchlistData?.description || ""}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-action mt-4 flex items-center justify-end gap-2">
            <form method="dialog">
              <button className="btn text-gray-400 btn-ghost hover:text-white">
                Cancel
              </button>
            </form>

            <button
              type="submit"
              disabled={isLoading}
              className="btn min-w-[120px] rounded-full px-6 font-bold text-white btn-primary hover:brightness-110 disabled:bg-gray-600"
            >
              {isLoading ? (
                <span className="loading loading-sm loading-spinner"></span>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create List"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WatchlistModal;
