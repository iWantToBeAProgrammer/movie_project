import Image from "next/image";
import WatchlistThumbnail from "./Thumbnail/WatchlistThumbnail";
import { useRouter } from "next/navigation";

const WatchlistCard = ({ watchlists = [], username }) => {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {watchlists.length !== 0 ? (
          watchlists.map((watchlist, key) => {
            return (
              <div
                key={key}
                className="watchlist-card cursor-pointer px-4 pt-4 h-80 w-60 font-sans_caption rounded-2xl hover:bg-white/10 transition-colors duration-200 ease-out"
                onClick={() =>
                  router.push(`/profile/watchlist/${watchlist.id}`)
                }
              >
                <div className="watchlist-card-wrapper flex flex-col gap-3">
                  {watchlist.picture ? (
                    <Image
                      src={`${watchlist.picture}`}
                      width={230}
                      height={230}
                      className="object-cover object-center rounded-2xl aspect-square"
                    />
                  ) : (
                    <WatchlistThumbnail movies={watchlist.items} />
                  )}
                  <div className="watchlist-card-content flex flex-col">
                    <h3 className="watchlist-card-name font-bold text-xl line-clamp-2">
                      {watchlist.name}
                    </h3>
                    <p className="watchlist-card-desc text-white/30">
                      By {username}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white/30">No watchlists yet.</p>
        )}
      </div>
    </>
  );
};

export default WatchlistCard;
