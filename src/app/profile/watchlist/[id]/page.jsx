"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchWatchlistData } from "@/libs/api";
import Image from "next/image";
import WatchlistThumbnail from "@/components/Profile/Thumbnail/WatchlistThumbnail";
import Loading from "@/app/loading";
import BackNavigation from "@/components/Common/BackNavigation";
import WatchlistItemCard from "@/components/Watchlist/WatchlistItemCard";
import { useRouter } from "next/navigation";

export default function WatchlistDetail({ params }) {
  const { id } = params;
  const router = useRouter();

  const {
    data: watchlist,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["watchlist", id],
    queryFn: () => fetchWatchlistData(id),
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p>Error loading watchlist: {error.message}</p>;
  }

  const totalMovies = watchlist.items.length;
  const watchlistItem = watchlist.items;

  return (
    <div className="flex flex-col mx-auto items-center justify-center">
      <BackNavigation />
      <div className="flex bg-gradient-to-b from-[#DD1818] to-[#333333] h-80 w-full items-center justify-center">
        <div className="flex gap-4 max-w-screen-xl w-full">
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
          <div className="flex flex-col gap-3 font-sans_caption justify-end">
            <h1 className="text-4xl font-raleway">{watchlist.name}</h1>
            <p className="text-xl text-slate-300 line-clamp-3 hover:line-clamp-4">
              {watchlist.description}
            </p>
            <div className="flex gap-2 items-center">
              {watchlist.picture ? (
                <Image
                  src={`${watchlist.picture}`}
                  width={20}
                  height={20}
                  className="object-cover object-center rounded-full"
                />
              ) : (
                <Image
                  src="/assets/images/noimage.jpg"
                  width={20}
                  height={20}
                  className="object-cover object-center rounded-full"
                />
              )}
              <p
                className="hover:underline cursor-pointer"
                onClick={() => router.push(`/profile`)}
              >
                {watchlist.user.username}
              </p>
              <p>• {totalMovies} Movies</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col max-w-screen-xl h-full w-full gap-5 my-24">
        <div className="flex space-x-10 py-2 border-b border-slate-500 text-slate-500    ">
          <h1 className="text-4xl">#</h1>
          <h1 className="text-4xl">Movies</h1>
        </div>
        <div className="flex flex-col gap-4">
          <WatchlistItemCard watchlistItem={watchlistItem} />
        </div>
      </div>
    </div>
  );
}
