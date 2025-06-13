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
import { IoPersonAddOutline } from "react-icons/io5";
import toast from "react-hot-toast";

export default function WatchlistDetail({ params }) {
  const { token } = params;
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  const {
    data: watchlist,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["watchlist", token],
    queryFn: () => fetchWatchlistData(token),
  });

  const handleAddCollaborator = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/invite/${watchlist?.inviteToken}`,
    );

    toast.success("Link Copied to Clipboard");
  };

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
    <div className="mx-auto flex flex-col items-center justify-center">
      <BackNavigation />
      <WatchlistBackdrop imageUrl={watchlist.picture || thumbnailUrl}>
        <div className="flex w-full max-w-(--breakpoint-xl) gap-4">
          <div className="watchlist-image-wrapper h-64 w-64 overflow-hidden">
            {watchlist.picture ? (
              <Image
                src={`${watchlist.picture}`}
                width={512}
                height={512}
                className="aspect-square h-full w-full rounded-2xl object-cover object-center"
              />
            ) : (
              <WatchlistThumbnail
                movies={watchlist.items}
                setThumbnailUrl={setThumbnailUrl}
              />
            )}
          </div>

          <div className="flex flex-col justify-end gap-3 font-sans_caption">
            <h1 className="font-raleway text-4xl">{watchlist.name}</h1>
            <p className="line-clamp-3 text-xl text-slate-300 hover:line-clamp-4">
              {watchlist.description}
            </p>
            <div className="flex items-center gap-2">
              <div className="user-image-wrapper h-5 w-5 overflow-hidden">
                {watchlist?.user?.profilePicture ? (
                  <Image
                    src={`${watchlist.user.profilePicture}`}
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-cover object-center"
                  />
                ) : (
                  <Image
                    src="/assets/images/noimage.jpg"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-cover object-center"
                  />
                )}
              </div>
              <p
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/profile`)}
              >
                {watchlist.user.username}
              </p>
              <p>• {totalMovies} Movies</p>
            </div>
          </div>
        </div>
      </WatchlistBackdrop>

      <div className="mb-24 flex h-full w-full max-w-(--breakpoint-xl) flex-col gap-5">
        <div className="flex h-16 w-full items-center justify-start">
          <button className="cursor-pointer" onClick={handleAddCollaborator}>
            <IoPersonAddOutline
              size={28}
              className="text-white/50 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white/100"
            />
          </button>
        </div>
        <div className="flex space-x-10 border-b border-slate-500 py-2 text-slate-500">
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
