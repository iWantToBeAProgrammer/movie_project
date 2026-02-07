"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePrivacy } from "@/libs/api";
import Image from "next/image";
import WatchlistThumbnail from "@/components/Profile/Thumbnail/WatchlistThumbnail";
import Loading from "@/app/loading";
import BackNavigation from "@/components/Common/BackNavigation";
import WatchlistItemCard from "@/components/Watchlist/WatchlistItemCard";
import { useRouter } from "next/navigation";
import WatchlistBackdrop from "@/components/Watchlist/WatchlistBackdrop";
import { IoPersonAddOutline, IoTicketOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { TbForbid } from "react-icons/tb";
import { CaretDown, DoorOpen } from "@phosphor-icons/react";
import { CiLock, CiUnlock } from "react-icons/ci";
import { ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import SaveButton from "@/components/Watchlist/WatchlistSavedButton";
import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlistQueries";
import TicketModal from "./components/TicketModal";

export default function WatchlistDetail({ params }) {
  const { token } = params;
  const router = useRouter();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const { user } = useAuth();
  const { data: watchlist, isLoading, isError, error } = useWatchlist(token);

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
      { method: "DELETE" },
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
      { method: "DELETE" },
    );
    if (!response.ok) throw new Error("Failed to fetch watchlist");
    const results = await response.json();
    toast.success(results?.message);
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading watchlist: {error.message}</p>;
  if (!watchlist) return <p>Watchlist not found.</p>;

  const totalMovies = watchlist.items?.length || 0;
  const watchlistItem = watchlist?.items;
  const isOwned =
    watchlist?.userRole === "OWNER" || watchlist?.userRole === "COLLABORATOR";

  const filteredMembers = watchlist?.members?.filter(
    (member) => member.role === "OWNER" || member.role === "COLLABORATOR",
  );

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <BackNavigation />

      {/* Header Section */}
      <WatchlistBackdrop imageUrl={watchlist.picture || thumbnailUrl}>
        <div className="flex h-full w-full max-w-(--breakpoint-xl) items-end gap-6 pb-6">
          {/* Cover Image */}
          <div className="watchlist-image-wrapper h-48 w-48 shrink-0 overflow-hidden rounded-xl shadow-2xl md:h-56 md:w-56">
            {watchlist.picture ? (
              <Image
                src={`${watchlist.picture}`}
                width={512}
                height={512}
                className="aspect-square h-full w-full object-cover object-center"
                alt={watchlist.name}
              />
            ) : (
              <WatchlistThumbnail
                movies={watchlist.items}
                setThumbnailUrl={setThumbnailUrl}
              />
            )}
          </div>

          {/* Text Content */}
          <div className="mb-1 flex flex-col justify-end gap-2 font-sans_caption">
            <h1 className="font-raleway text-3xl font-bold text-white drop-shadow-md md:text-5xl">
              {watchlist.name}
            </h1>
            <p className="line-clamp-2 max-w-2xl text-sm text-slate-300 md:text-base">
              {watchlist.description}
            </p>

            {/* Metadata & Members */}
            <div className="mt-2 flex items-center gap-4 text-sm font-medium text-white/80">
              <div className="flex items-center gap-2">
                <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                  {filteredMembers && filteredMembers.length > 0 ? (
                    filteredMembers.slice(0, 3).map((member, key) => (
                      <div className="avatar border-none" key={key}>
                        <div className="h-8 w-8">
                          <Image
                            src={
                              member.user.profilePicture ||
                              "/assets/images/noimage.jpg"
                            }
                            width={32}
                            height={32}
                            alt={member.user.username}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="avatar border-none">
                      <div className="h-8 w-8">
                        <Image
                          src="/assets/images/noimage.jpg"
                          width={32}
                          height={32}
                          alt="No Member"
                        />
                      </div>
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
                  className="transition-colors hover:text-white hover:underline"
                >
                  {filteredMembers.length === 1
                    ? filteredMembers[0]?.user.username
                    : filteredMembers.length === 2
                      ? `${filteredMembers[0]?.user.username} & ${filteredMembers[1]?.user.username}`
                      : `${filteredMembers[0]?.user.username} & ${filteredMembers.length - 1} others`}
                </button>
              </div>
              <span className="text-white/40">•</span>
              <p>{totalMovies} Movies</p>
            </div>
          </div>
        </div>
      </WatchlistBackdrop>

      <div className="mb-12 flex h-full w-full max-w-(--breakpoint-xl) flex-col gap-6 px-4 md:px-0">
        <div className="mt-6 flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {isOwned && (
              <button
                onClick={() =>
                  document.getElementById("generate_ticket").showModal()
                }
                className="btn btn-circle h-12 w-12 text-neutral btn-primary hover:scale-105"
                title="Generate Ticket"
              >
                <IoTicketOutline size={24} />
              </button>
            )}

            {!isOwned && (
              <SaveButton isSavedInitial={watchlist?.saved} token={token} />
            )}

            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
              {watchlist.userRole === "OWNER" && (
                <>
                  <div
                    className="tooltip tooltip-accent"
                    data-tip="Add Collaborator"
                  >
                    <button
                      onClick={handleAddCollaborator}
                      className="btn btn-circle text-white/60 btn-ghost btn-sm hover:text-white"
                    >
                      <IoPersonAddOutline size={20} />
                    </button>
                  </div>
                  <div
                    className="tooltip tooltip-accent"
                    data-tip={
                      watchlist?.isPublic ? "Make Private" : "Make Public"
                    }
                  >
                    <button
                      onClick={privacyButtonToggle}
                      className="btn btn-circle text-white/60 btn-ghost btn-sm hover:text-white"
                    >
                      {watchlist?.isPublic ? (
                        <CiLock size={22} />
                      ) : (
                        <CiUnlock size={22} />
                      )}
                    </button>
                  </div>
                  <div className="mx-1 h-4 w-px bg-white/20"></div>
                </>
              )}
              <div
                className={`tooltip tooltip-accent ${!watchlist?.isPublic && watchlist.userRole === "VIEWER" && "hidden"}`}
                data-tip="Share"
              >
                <button
                  onClick={handleShareWatchlist}
                  className="btn btn-circle text-white/60 btn-ghost btn-sm hover:text-white"
                >
                  <ShareNetwork size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* List Header */}
        <div className="flex items-center border-b border-white/10 pb-2 text-sm font-semibold tracking-wider text-slate-400 uppercase">
          <div className="w-12 text-center">#</div>
          <div>Movies</div>
        </div>

        {/* Movie List */}
        <div className="flex flex-col gap-3">
          <WatchlistItemCard
            watchlistId={watchlist.id}
            watchlistItem={watchlistItem}
            token={token}
          />
        </div>
      </div>

      {/* Member Modal */}
      <dialog id="shared_modal" className="modal">
        <div className="modal-box border border-white/10 bg-neutral text-white">
          <form method="dialog">
            <button className="btn absolute top-2 right-2 btn-circle text-white/60 btn-ghost btn-sm hover:text-white">
              ✕
            </button>
          </form>
          <h3 className="mb-4 text-lg font-bold">Members</h3>
          <div className="flex flex-col gap-2">
            {filteredMembers.map((member, key) => {
              const isMe = member.userId === user.id;
              const isOwner = member.role === "OWNER";
              const iAmOwner = watchlist.members.some(
                (m) => m.userId === user.id && m.role === "OWNER",
              );

              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg bg-base-100/50 p-3 transition-colors hover:bg-base-100"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        member.user.profilePicture ||
                        "/assets/images/noimage.jpg"
                      }
                      height={40}
                      width={40}
                      className="rounded-full object-cover"
                      alt={member.user.username}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {!isMe ? (
                          <Link
                            href={`/user/${member.userId}`}
                            className="hover:underline"
                          >
                            {member.user.username}
                          </Link>
                        ) : (
                          "You"
                        )}
                      </span>
                      <span className="text-xs text-white/50">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Role Actions */}
                  {iAmOwner && !isOwner ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn gap-1 text-white/70 btn-ghost btn-xs"
                      >
                        Manage <CaretDown size={12} />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu z-1 w-48 rounded-box border border-white/10 bg-neutral p-2 shadow"
                      >
                        <li>
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                          >
                            <TbForbid /> Remove
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : isMe && !isOwner ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn gap-1 text-white/70 btn-ghost btn-xs"
                      >
                        Options <CaretDown size={12} />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu z-1 w-48 rounded-box border border-white/10 bg-neutral p-2 shadow"
                      >
                        <li>
                          <button
                            onClick={handleLeaveWatchlist}
                            className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                          >
                            <DoorOpen /> Leave
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Ticket Modal */}
      <dialog
        id="generate_ticket"
        className="modal modal-middle max-md:modal-bottom"
      >
        <TicketModal items={watchlistItem} />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
