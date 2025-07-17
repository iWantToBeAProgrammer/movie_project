import { Pencil } from "@phosphor-icons/react";
import Image from "next/image";

const WatchlistModal = ({
  handleSubmit,
  watchlistData,
  handleImageChange,
  handleChange,
}) => {
  return (
    <div className="modal-box max-w-2xl">
      <form method="dialog" className="mb-4">
        <h1 className="text-2xl">Create Watchlist</h1>
        <button className="btn absolute top-6 right-2 btn-circle btn-ghost btn-sm">
          ✕
        </button>
      </form>
      <form
        className="watchlist-form flex flex-col gap-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="watchlist-image">
            <label htmlFor="picture" className="relative">
              <Image
                width={600}
                height={600}
                className="aspect-square object-cover object-center"
                src={
                  watchlistData?.picture
                    ? URL.createObjectURL(watchlistData.picture)
                    : "/assets/images/watchlist-default.jpg"
                }
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

              <div className="absolute top-0 z-10 flex h-full w-full flex-col items-center justify-center *:hidden hover:bg-black/50 hover:*:block">
                <Pencil size={50} weight="bold" />
                <p className="font-raleway font-semibold">Choose a photo</p>
              </div>
            </label>
          </div>
          <div className="watchlist-form-content col-span-2 flex h-full flex-col justify-between gap-2">
            <label className="floating-label">
              <span>Name</span>
              <input
                type="text"
                placeholder="Add a name"
                className="input-bordered input input-lg w-full py-5"
                name="name"
                value={watchlistData?.name}
                onChange={handleChange}
              />
            </label>
            <label className="floating-label">
              <span>Description</span>
              <textarea
                className="textarea-bordered textarea h-full w-full resize-none textarea-lg"
                placeholder="Add an optional description here"
                name="description"
                value={watchlistData?.description}
                onChange={handleChange}
              ></textarea>
            </label>
            <div className="flex justify-end">
              <button className="btn px-8 btn-primary" type="submit">
                Create
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WatchlistModal;
