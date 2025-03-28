import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

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
            <div className="flex py-5 border-b">
              <div className="flex w-60 h-72">
                <div className="relative group w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src={`${process.env.NEXT_APP_BASEIMG}${
                      item.movie.poster_path || item.movie.posterPath
                    }`}
                    fill
                    className="object-cover w-full h-full"
                    alt={item.movie.title || "Movie poster"}
                  />

                  <div className="w-full group-hover:translate-y-0 bg-black/0 hover:bg-black/70 transition-colors duration-300 ease-in-out h-full">
                    <div className="flex flex-col items-center justify-center w-full h-full gap-2 p-2 text-white">
                      <Link
                        className="text-6xl hover:scale-125 transition-all duration-300 ease-in-out"
                        href={`/movies/${item?.movie?.id}`}
                      >
                        <IoPlayCircleOutline />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full px-6 py-10 justify-center font-sans_caption gap-2 text-pretty">
                <div className="flex justify-between w-full items-center">
                  <h1 className="text-4xl font-raleway">{item.movie.title}</h1>
                  <h1 className="text-2xl font-raleway">
                    {item.movie.vote_average.toFixed(1)}/10
                  </h1>
                </div>
                <p className="text-xl text-slate-400">{item.movie.overview}</p>
                <p className="text-base text-slate-300">
                  {item.movie.genres.join(", ")} ● Duration{" "}
                  {formatRuntime(item.movie.runtime)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default WatchlistItemCard;
