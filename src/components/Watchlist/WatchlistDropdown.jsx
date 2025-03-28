import { PlusCircle } from "@phosphor-icons/react";

const WatchlistDropdown = ({
  watchlists,
  handleSubmitToExistingWatchlist,
  showModal,
}) => {
  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-white text-black rounded-xl mt-2 z-[1] w-52 p-2 shadow hover:*:*:bg-secondary transition-colors duration-200 ease-in-out *:rounded-xl gap-1"
    >
      <li className="border-b border-black/50 font-sans_caption">
        <button className="focus:text-black" onClick={showModal}>
          <PlusCircle size={20} /> Create Watchlist
        </button>
      </li>

      {watchlists?.map((watchlist, key) => (
        <li key={key}>
          <button
            className="focus:text-black font-sans_caption"
            onClick={() => handleSubmitToExistingWatchlist(watchlist.id)}
          >
            {watchlist.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default WatchlistDropdown;
