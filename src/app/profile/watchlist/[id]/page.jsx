"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchWatchlistData } from "@/libs/api";
import Image from "next/image";
import WatchlistThumbnail from "@/components/Profile/Thumbnail/WatchlistThumbnail";
import Loading from "@/app/loading";
import BackNavigation from "@/components/Common/BackNavigation";
import WatchlistItemCard from "@/components/Watchlist/WatchlistItemCard";
import { useRouter } from "next/navigation";
import WatchlistBackdrop from "@/components/Watchlist/WatchlistBackdrop";
import { useEffect, useRef, useState } from "react";

export default function WatchlistDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

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

  if (!watchlist) {
    return <p>Watchlist not found.</p>; // ✅ Handle missing data case safely
  }

  const totalMovies = watchlist.items?.length || 0; // ✅ A
  const watchlistItem = watchlist?.items;

  return (
    <div className="flex flex-col mx-auto items-center justify-center">
      <BackNavigation />
      <WatchlistBackdrop imageUrl={watchlist.picture || thumbnailUrl}>
        <div className="flex gap-4 max-w-(--breakpoint-xl) w-full">
          {watchlist.picture ? (
            <Image
              src={`${watchlist.picture}`}
              width={230}
              height={230}
              className="object-cover object-center rounded-2xl aspect-square"
            />
          ) : (
            <WatchlistThumbnail
              movies={watchlist.items}
              setThumbnailUrl={setThumbnailUrl}
            />
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
      </WatchlistBackdrop>

      <div className="flex flex-col max-w-(--breakpoint-xl) h-full w-full gap-5 my-24">
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
