"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWatchlistData, togglePrivacy } from "@/libs/api";
import Image from "next/image";
import WatchlistThumbnail from "@/components/Profile/Thumbnail/WatchlistThumbnail";
import Loading from "@/app/loading";
import BackNavigation from "@/components/Common/BackNavigation";
import WatchlistItemCard from "@/components/Watchlist/WatchlistItemCard";
import { useRouter } from "next/navigation";
import WatchlistBackdrop from "@/components/Watchlist/WatchlistBackdrop";
import { IoPersonAddOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { TbForbid } from "react-icons/tb";
import { CaretDown, DoorOpen } from "@phosphor-icons/react";
import { CiLock, CiUnlock } from "react-icons/ci";
import { ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import SaveButton from "@/components/Watchlist/WatchlistSavedButton";
import Link from "next/link";

export default function WatchlistDetail({ params }) {
  const { token } = params;
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const { user } = useAuth();
  const {
    data: watchlist,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["watchlist", token],
    queryFn: () => fetchWatchlistData(token),
    enabled: !!token,
  });

  const handleAddCollaborator = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASEURL}/watchlist/invite/${watchlist?.inviteToken}`,
    );

    toast.success("Link Copied to Clipboard");
  };

  const shareWatchlistUrl = (watchlistToken, inviteToken) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/view`;
    const url = new URL(baseUrl);

    url.searchParams.set("token", watchlistToken);

    if (inviteToken) {
      url.searchParams.set("inviteToken", inviteToken);
    }

    return url.toString();
  };

  const handleShareWatchlist = () => {
    const shareUrl = shareWatchlistUrl(
      watchlist.token,
      watchlist.isPublic ? undefined : watchlist.inviteToken,
    );

    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleLeaveWatchlist = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/${token}/members/me`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) throw new Error("Failed to fetch watchlist");

    const results = await response.json();
    toast.success(results.message);
  };

  const queryClient = useQueryClient();

  const privacyMutation = useMutation({
    mutationFn: togglePrivacy,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["watchlist", token]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const privacyButtonToggle = (e) => {
    e.preventDefault();

    privacyMutation.mutate({ token, isPublic: !watchlist.isPublic });
  };

  const handleRemoveMember = async (member) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/watchlist/${token}/members/${member.userId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) throw new Error("Failed to fetch watchlist");

    const results = await response.json();
    toast.success(results?.message);
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

  const isOwned =
    watchlist?.userRole === "OWNER" || watchlist?.userRole === "COLLABORATOR";

  const filteredMembers = watchlist?.members?.filter(
    (member) => member.role === "OWNER" || member.role === "COLLABORATOR",
  );

  console.log(filteredMembers);

  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <BackNavigation />
      <WatchlistBackdrop imageUrl={watchlist.picture || thumbnailUrl}>
        <div className="flex h-full w-full max-w-(--breakpoint-xl) items-end gap-4">
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
            <div className="flex w-full items-center gap-2">
              <div className="avatar-group -space-x-3">
                {filteredMembers ? (
                  filteredMembers.map((member, key) => {
                    return (
                      <div
                        className="avatar border-base-100 outline-base-100"
                        key={key}
                      >
                        <div className="w-8">
                          <Image
                            src={
                              member.user.profilePicture ||
                              "/assets/images/noimage.jpg"
                            }
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-8">
                    <Image
                      src="/assets/images/noimage.jpg"
                      width={40}
                      height={40}
                      className="h-full w-full rounded-full object-cover object-center"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() =>
                  filteredMembers.length === 1
                    ? filteredMembers[0]?.userId === user.id
                      ? router.push("/profile")
                      : router.push(`/user/${filteredMembers[0]?.userId}`)
                    : document.getElementById("shared_modal").showModal()
                }
              >
                <p className="cursor-pointer hover:underline">
                  {filteredMembers.length === 1
                    ? filteredMembers[0]?.user.username
                    : filteredMembers.length === 2
                      ? `${filteredMembers[0]?.user.username} and ${filteredMembers[1]?.user.username}`
                      : `${filteredMembers[0]?.user.username} and ${filteredMembers.length - 1} others`}
                </p>
              </button>

              <p>• {totalMovies} Movies</p>
            </div>
          </div>
        </div>
      </WatchlistBackdrop>

      <div className="mb-24 flex h-full w-full max-w-(--breakpoint-xl) flex-col gap-5">
        <div className="mt-8 flex h-12 w-full items-center justify-start">
          <div className="watchlist-actions flex items-center gap-4">
            {!isOwned && (
              <SaveButton isSavedInitial={watchlist?.saved} token={token} />
            )}
            {watchlist.userRole === "OWNER" && (
              <div className="flex items-center gap-4">
                <div
                  className="tooltip font-semibold tooltip-accent"
                  data-tip="Add to Collaborator"
                >
                  <button
                    className="cursor-pointer"
                    onClick={handleAddCollaborator}
                  >
                    <IoPersonAddOutline
                      size={32}
                      className="text-white/50 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white/100"
                    />
                  </button>
                </div>

                <div
                  className="tooltip font-semibold tooltip-accent"
                  data-tip={
                    watchlist?.isPublic ? "Make private" : "Make Public"
                  }
                >
                  <button
                    className="cursor-pointer"
                    onClick={privacyButtonToggle}
                  >
                    {watchlist?.isPublic ? (
                      <CiLock
                        size={32}
                        className="text-white/50 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white/100"
                      />
                    ) : (
                      <CiUnlock
                        size={32}
                        className="transition-acll text-white/50 duration-300 ease-in-out hover:scale-110 hover:text-white/100"
                      />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div
              className={`tooltip font-semibold tooltip-accent ${!watchlist?.isPublic && watchlist.userRole === "VIEWER" && "hidden"}`}
              data-tip="Share"
            >
              <button className="cursor-pointer" onClick={handleShareWatchlist}>
                <ShareNetwork
                  size={32}
                  className="text-white/50 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white/100"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex space-x-10 border-b border-slate-500 py-2 text-slate-500">
          <h1 className="text-4xl">#</h1>
          <h1 className="text-4xl">Movies</h1>
        </div>
        <div className="flex flex-col gap-4">
          <WatchlistItemCard watchlistItem={watchlistItem} />
        </div>
      </div>

      <dialog id="shared_modal" className="modal">
        <div className="modal-box overflow-hidden px-4 pb-12">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold">Shared Watchlist</h3>
          <div className="divider"></div>
          <ul className="list rounded-box bg-base-100 shadow-md">
            {filteredMembers.map((member, key) => {
              const isMe = member.userId === user.id;
              const isOwner = member.role === "OWNER";
              const iAmOwner = watchlist.members.some(
                (m) => m.userId === user.id && m.role === "OWNER",
              );
              return (
                <li className="list-row" key={key}>
                  <div>
                    <Image
                      className="size-10 rounded-box"
                      src={
                        member.user.profilePicture ||
                        "/assets/images/noimage.jpg"
                      }
                      height={50}
                      width={50}
                    />
                  </div>
                  <div>
                    <div className="flex h-full items-center">
                      {/* {member.user.username} */}
                      {!isMe ? (
                        <Link
                          href={`/user/${member.userId}`}
                          className="hover:underline"
                        >
                          {member.user.username}
                        </Link>
                      ) : (
                        member.user.username
                      )}
                    </div>
                  </div>
                  {iAmOwner && !isOwner ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="flex h-full cursor-pointer items-center justify-center font-semibold tracking-wide text-white/100"
                      >
                        {member.role} <CaretDown size={16} />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu z-1 w-64 rounded-lg bg-neutral p-0 text-black shadow-sm"
                      >
                        <li className="rounded-lg p-1 transition-all duration-300 ease-in-out hover:bg-primary hover:text-neutral">
                          <button onClick={() => handleRemoveMember(member)}>
                            <TbForbid /> Remove From Watchlist
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : isMe && !isOwner ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="flex h-full cursor-pointer items-center justify-center font-semibold tracking-wide text-white/100"
                      >
                        {member.role} <CaretDown size={16} />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu z-1 w-52 rounded-lg bg-neutral p-2 text-black shadow-sm"
                      >
                        <li>
                          <button onClick={handleLeaveWatchlist}>
                            <DoorOpen /> Leave Watchlist
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <span className="flex h-full items-center justify-center font-semibold tracking-wide text-white/50">
                      {member.role}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </div>
  );
}
