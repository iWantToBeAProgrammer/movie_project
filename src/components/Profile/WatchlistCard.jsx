import Image from "next/image";
import WatchlistThumbnail from "./Thumbnail/WatchlistThumbnail";
import { useRouter } from "next/navigation";
import Link from "next/link";

const WatchlistCard = ({ watchlists = [], username }) => {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {watchlists.length !== 0 ? (
          watchlists.map((watchlist, key) => {
            return (
              <Link
                key={key}
                className="watchlist-card h-80 w-60 cursor-pointer rounded-2xl px-4 pt-4 font-sans_caption transition-colors duration-200 ease-out hover:bg-white/10"
                href={`/profile/watchlist/${watchlist.id}`}
              >
                <div className="watchlist-card-wrapper flex flex-col gap-3">
                  {watchlist.picture ? (
                    <Image
                      src={`${watchlist.picture}`}
                      width={230}
                      height={230}
                      className="aspect-square rounded-2xl object-cover object-center"
                    />
                  ) : (
                    <WatchlistThumbnail movies={watchlist.items} />
                  )}
                  <div className="watchlist-card-content flex flex-col">
                    <h3 className="watchlist-card-name line-clamp-2 text-xl font-bold">
                      {watchlist.name}
                    </h3>
                    <p className="watchlist-card-desc text-white/30">
                      By {username}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="absolute top-10 left-0 text-white/30">
            No watchlists yet.
          </p>
        )}
      </div>
    </>
  );
};

export default WatchlistCard;
