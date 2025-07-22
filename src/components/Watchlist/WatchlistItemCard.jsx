import { EyeSlash, Plus, Star, Trash } from "@phosphor-icons/react";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCaretRight } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { TbStar, TbStarFilled, TbStarOff } from "react-icons/tb";

const WatchlistItemCard = ({ watchlistItem = [] }) => {
  const router = useRouter();

  const formatRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours} h ${minutes} m`;
  };

  return (
    <>
      {watchlistItem.map((item, key, index) => {
        const isWatched = item.isWatched;
        const isFavorite = item.isFavorite;
        return (
          <div key={key} className="flex space-x-10">
            <p className="flex items-center">{key + 1}</p>
            <div className="flex border-b py-5">
              <div className="flex h-64 w-52">
                <div className="group relative h-full w-full overflow-hidden rounded-lg">
                  <Image
                    src={`${process.env.NEXT_APP_BASEIMG}${
                      item?.poster_path || item?.posterPath
                    }`}
                    fill
                    className="h-full w-full object-center"
                    alt={item.title || "Movie poster"}
                  />

                  <div className="h-full w-full bg-black/0 transition-colors duration-300 ease-in-out group-hover:translate-y-0 hover:bg-black/70">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-white">
                      <Link
                        className="text-6xl transition-all duration-300 ease-in-out hover:scale-125"
                        href={`/movies/${item?.id}`}
                      >
                        <IoPlayCircleOutline />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group flex w-full flex-col justify-center gap-4 py-10 ps-4 font-sans_caption text-pretty">
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-raleway text-4xl">{item.title}</h1>
                  <div className="right-group-wrapper flex items-center gap-4">
                    <h1 className="font-sans_caption text-2xl">
                      {item.vote_average.toFixed(1)}/10
                    </h1>
                    <div className="dropdown dropdown-end">
                      <div
                        role="button"
                        tabIndex={0}
                        className="btn m-1 flex cursor-pointer items-center justify-center border-0 bg-transparent bg-none opacity-0 outline-0 group-hover:opacity-100 hover:*:text-white"
                      >
                        <HiOutlineDotsVertical
                          size={24}
                          className="text-white/70"
                        />
                      </div>

                      <ul
                        tabIndex={0}
                        className="dropdown-content menu z-1 w-64 rounded-box bg-neutral p-2 font-raleway font-semibold text-base-100 shadow-sm"
                      >
                        <li>
                          <div className="dropdown-hover dropdown dropdown-left transition-all duration-100 ease-in hover:bg-primary hover:*:text-neutral">
                            <div
                              role="button"
                              tabIndex={0}
                              className="flex items-center justify-between text-base-100"
                            >
                              <span className="flex items-center gap-3">
                                <Plus size={24} /> Add to watchlist
                              </span>

                              <FaCaretRight
                                size={20}
                                className="text-black/70"
                              />

                              <ul
                                tabIndex={0}
                                className="dropdown-content menu z-1 w-52 rounded-md bg-neutral p-2 font-raleway font-semibold text-base-100 shadow-sm"
                              >
                                <li>
                                  <span>Watchlist 1</span>
                                </li>
                                <li>
                                  <span>Watchlist 1</span>
                                </li>
                                <li>
                                  <span>Watchlist 1</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                        <div className="divider m-0 divider-accent opacity-50"></div>
                        <li>
                          <button className="transition-all duration-100 ease-in hover:bg-primary hover:text-neutral">
                            {!isWatched ? (
                              <span className="flex items-center gap-3">
                                <Eye size={24} />
                                Mark as watched
                              </span>
                            ) : (
                              <span className="flex items-center gap-3">
                                <EyeSlash size={24} />
                                Mark as unwatched
                              </span>
                            )}
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center gap-3 transition-all duration-100 ease-in hover:bg-primary hover:text-neutral">
                            {!isFavorite ? (
                              <span className="flex items-center gap-3">
                                <TbStar size={24} /> Add to favorite
                              </span>
                            ) : (
                              <span className="flex items-center gap-3">
                                <TbStarOff size={24} /> Remove from favorite
                              </span>
                            )}
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center gap-3 transition-all duration-100 ease-in hover:bg-primary hover:text-neutral">
                            <Trash size={24} /> Remove from watchlist
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-slate-400">{item.overview}</p>
                <p className="text-base text-slate-300">
                  {item.genres.join(", ")} ● Duration{" "}
                  {formatRuntime(item.runtime)}
                </p>
                <div className="flex items-center gap-3">
                  {isWatched && (
                    <div className="badge badge-primary">
                      <Eye />
                      Watched
                    </div>
                  )}
                  {isFavorite && (
                    <div className="badge badge-info">
                      <Star stroke="yellow" fillRule="true" />
                      Favorite
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default WatchlistItemCard;
