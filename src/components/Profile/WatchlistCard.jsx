import Image from "next/image";
import WatchlistThumbnail from "./Thumbnail/WatchlistThumbnail";
import { useRouter } from "next/navigation";
import Link from "next/link";

const WatchlistCard = ({ watchlists = [], username }) => {
  const router = useRouter();
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {watchlists.length !== 0 ? (
          watchlists?.map((watchlist, key) => {
            return (
              <Link
                key={key}
                className="watchlist-card h-64 w-48 cursor-pointer rounded-2xl px-4 pt-4 font-sans_caption transition-colors duration-200 ease-out hover:bg-white/10 md:h-80 md:w-60"
                href={`/watchlist/${watchlist.token}`}
              >
                <div className="watchlist-card-wrapper flex flex-col items-center gap-3 text-center md:items-start md:text-start">
                  <div className="thumbnail-image-wrapper h-36 w-36 overflow-hidden rounded-2xl md:h-52 md:w-52">
                    {watchlist.picture ? (
                      <Image
                        src={`${watchlist.picture}`}
                        alt={watchlist.name}
                        width={512}
                        height={512}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <WatchlistThumbnail movies={watchlist.items} />
                    )}
                  </div>
                  <div className="watchlist-card-content flex flex-col">
                    <h3 className="watchlist-card-name line-clamp-2 text-xl font-bold">
                      {watchlist.name}
                    </h3>
                    <p className="watchlist-card-desc text-white/30">
                      By {watchlist?.owner?.username || username}
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
