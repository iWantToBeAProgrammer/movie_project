import { Pencil } from "@phosphor-icons/react";
import Image from "next/image";

const WatchlistModal = ({
  handleSubmit,
  watchlistData,
  handleImageChange,
  handleChange,
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
    <div className="modal-box max-w-2xl bg-[#1e1e1e] text-white">
      <form method="dialog" className="mb-4">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Details" : "Create Watchlist"}
        </h1>
        <button className="btn absolute top-6 right-2 btn-circle btn-ghost btn-sm">
          ✕
        </button>
      </form>
      <form
        className="watchlist-form flex flex-col gap-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="watchlist-image">
            <label
              htmlFor="picture"
              className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded shadow-md"
            >
              <Image
                width={600}
                height={600}
                className="aspect-square h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
                src={getImagePreview()}
                alt="Watchlist Preview"
              />
              <input
                type="file"
                name="picture"
                id="picture"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />

              {/* Overlay Icon */}
              <div className="absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Pencil size={50} weight="bold" className="text-white" />
                <p className="mt-2 font-raleway font-semibold text-white">
                  Choose photo
                </p>
              </div>
            </label>
          </div>

          <div className="watchlist-form-content col-span-2 flex h-full flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-400">Name</label>
              <input
                type="text"
                placeholder="Add a name"
                className="input-bordered input input-lg w-full bg-[#2a2a2a] text-white placeholder-gray-500 focus:border-white focus:outline-none"
                name="name"
                value={watchlistData?.name || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex grow flex-col gap-1">
              <label className="text-sm font-bold text-gray-400">
                Description
              </label>
              <textarea
                className="textarea-bordered textarea h-full w-full resize-none bg-[#2a2a2a] textarea-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                placeholder="Add an optional description here"
                name="description"
                value={watchlistData?.description || ""}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mt-2 flex justify-end">
              <button
                className="btn rounded-full border-none bg-white px-8 font-bold text-black btn-primary hover:bg-gray-200"
                type="submit"
              >
                {isEditMode ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WatchlistModal;
