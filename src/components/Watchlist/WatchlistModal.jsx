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
        <button className="btn btn-sm btn-circle btn-ghost absolute top-6 right-2">
          ✕
        </button>
      </form>
      <form
        className="watchlist-form form-control gap-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-3 gap-4">
          <div className="watchlist-image">
            <label htmlFor="picture" className="relative">
              <Image
                width={600}
                height={600}
                className="object-cover aspect-square object-center"
                src={
                  watchlistData.picture
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

              <div className="w-full h-full absolute justify-center items-center top-0 z-10 *:hidden hover:bg-black/50 *:hover:block flex flex-col">
                <Pencil size={50} weight="bold" />
                <p className="font-raleway font-semibold">Choose a photo</p>
              </div>
            </label>
          </div>
          <div className="watchlist-form-content col-span-2 h-full gap-2 flex flex-col">
            <input
              type="text"
              placeholder="Add a name"
              className="input input-bordered w-full py-5"
              name="name"
              value={watchlistData.name}
              onChange={handleChange}
            />
            <textarea
              className="textarea textarea-bordered resize-none h-full w-full"
              placeholder="Add an optional description here"
              name="description"
              value={watchlistData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default WatchlistModal;
