import { PlusCircle } from "@phosphor-icons/react";
import ErrorNotification from "../Auth/ErrorNotification";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const WatchlistDropdown = ({
  watchlists,
  handleSubmitToExistingWatchlist,
  showModal,
  movieId,
}) => {
  return (
    <>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-1 mt-2 w-52 gap-1 rounded-xl bg-white p-2 font-light text-black shadow-sm transition-colors duration-200 ease-in-out *:rounded-xl *:*:hover:bg-secondary *:*:hover:text-neutral"
      >
        <li className="border-b border-black/50 font-sans_caption">
          <button className="focus:text-black" onClick={() => showModal()}>
            <PlusCircle size={20} /> Create Watchlist
          </button>
        </li>

        {watchlists?.map((watchlist, key) => (
          <li key={key}>
            <button
              className="font-sans_caption focus:text-black"
              onClick={() =>
                handleSubmitToExistingWatchlist(
                  watchlist?.watchlist?.id || watchlist.id,
                  movieId,
                )
              }
            >
              {watchlist?.watchlist?.name || watchlist.name}
            </button>
          </li>
        ))}
      </ul>

      <dialog id="error-notification" className="modal">
        <ErrorNotification
          icon={<HiOutlineExclamationCircle size={104} />}
          title={"You Need to login"}
          desc={
            "Please log in to continue. You need an account to use this feature."
          }
        />
      </dialog>
    </>
  );
};

export default WatchlistDropdown;
