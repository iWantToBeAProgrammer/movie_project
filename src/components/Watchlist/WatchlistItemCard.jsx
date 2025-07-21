import {
  DotsSixVertical,
  DotsThreeVertical,
  Star,
} from "@phosphor-icons/react";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { HiDotsVertical, HiOutlineDotsVertical } from "react-icons/hi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { TbStarFilled } from "react-icons/tb";

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
        return (
          <div key={key} className="flex space-x-10">
            <p className="flex items-center">{key + 1}</p>
            <div className="flex border-b py-5">
              <div className="flex h-64 w-52">
                <div className="group relative h-full w-full overflow-hidden rounded-lg">
                  <Image
                    src={`${process.env.NEXT_APP_BASEIMG}${
                      item.movie.poster_path || item.movie.posterPath
                    }`}
                    fill
                    className="h-full w-full object-center"
                    alt={item.movie.title || "Movie poster"}
                  />

                  <div className="h-full w-full bg-black/0 transition-colors duration-300 ease-in-out group-hover:translate-y-0 hover:bg-black/70">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-white">
                      <Link
                        className="text-6xl transition-all duration-300 ease-in-out hover:scale-125"
                        href={`/movies/${item?.movie?.id}`}
                      >
                        <IoPlayCircleOutline />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group flex w-full flex-col justify-center gap-4 py-10 ps-4 font-sans_caption text-pretty">
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-raleway text-4xl">{item.movie.title}</h1>
                  <div className="right-group-wrapper flex items-center gap-4">
                    <h1 className="font-sans_caption text-2xl">
                      {item.movie.vote_average.toFixed(1)}/10
                    </h1>

                    <button className="flex items-center justify-center opacity-0 group-hover:opacity-100 hover:*:text-white cursor-pointer">
                      <HiOutlineDotsVertical
                        size={24}
                        className="text-white/70"
                      />
                    </button>
                  </div>
                </div>
                <p className="text-xl text-slate-400">{item.movie.overview}</p>
                <p className="text-base text-slate-300">
                  {item.movie.genres.join(", ")} ● Duration{" "}
                  {formatRuntime(item.movie.runtime)}
                </p>
                <div className="flex items-center gap-3">
                  <div className="badge badge-primary">
                    <Eye />
                    Watched
                  </div>
                  <div className="badge badge-info">
                    <Star stroke="yellow" fillRule="true" />
                    Favorite
                  </div>
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
