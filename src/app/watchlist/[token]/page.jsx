"use client";

// 1. Imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Import updateWatchlist LANGSUNG dari API, bukan dari hook queries
import { togglePrivacy, updateWatchlist } from "@/libs/api";
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
import { ShareNetwork, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import SaveButton from "@/components/Watchlist/WatchlistSavedButton";
import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlistQueries";
import TicketModal from "./components/TicketModal";
import WatchlistModal from "@/components/Watchlist/WatchlistModal";
import { useWatchlistMutation } from "@/hooks/useFormMutation";

export default function WatchlistDetail({ params }) {
  const { token } = params;

  // --- BAGIAN 1: SEMUA HOOKS (WAJIB DI PALING ATAS) ---
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State Hooks
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  // Query Hooks
  const { data: watchlist, isLoading, isError, error } = useWatchlist(token);

  // Mutation Hooks (Privacy)
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

  // Custom Form Mutation Hook (Edit Watchlist)
  const {
    formData,
    setFormData,
    handleChange,
    handleImageChange,
    handleSubmit,
    isLoading: isUpdating,
  } = useWatchlistMutation({
    initialData: {
      id: null,
      name: "",
      description: "",
      picture: null,
    },
    // FIX 2: Gunakan fungsi API langsung.
    // useFormMutation akan menangani pemanggilan function ini.
    mutationFn: (data) => updateWatchlist(data),

    queryKey: ["watchlist", token],
    modalId: "edit_watchlist_modal",
    onSuccess: () => {
      toast.success("Watchlist updated successfully! 🎉");
      queryClient.invalidateQueries(["watchlist", token]);
      document.getElementById("edit_watchlist_modal").close();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update watchlist");
    },
  });


  const handleEditClick = () => {
    if (!watchlist) return;
    setFormData({
      id: watchlist.id,
      name: watchlist.name,
      description: watchlist.description || "",
      picture: watchlist.picture,
    });
    document.getElementById("edit_watchlist_modal").showModal();
  };

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
    if (!watchlist) return;
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

  const privacyButtonToggle = (e) => {
    e.preventDefault();
    if (!watchlist) return;
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

  // --- BAGIAN 3: CONDITIONAL RETURNS (LOADING/ERROR) ---
  // FIX 1: Pengecekan ini HARUS dilakukan SEBELUM mengakses watchlist.items

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading watchlist: {error.message}</p>;
  if (!watchlist) return <p>Watchlist not found.</p>;

  // --- BAGIAN 4: DATA PROCESSING (Safe to do here) ---
  // Kode di bawah ini aman karena kita sudah return di atas jika watchlist null/undefined

  const totalMovies = watchlist.items?.length || 0;
  const watchlistItem = watchlist?.items;
  const isOwned =
    watchlist?.userRole === "OWNER" || watchlist?.userRole === "COLLABORATOR";

  const filteredMembers = watchlist?.members?.filter(
    (member) => member.role === "OWNER" || member.role === "COLLABORATOR",
  );

  // --- BAGIAN 5: RENDER JSX ---
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center">
      <BackNavigation />

      {/* Header Section */}
      <WatchlistBackdrop imageUrl={watchlist.picture || thumbnailUrl}>
        <div className="flex h-full w-full max-w-(--breakpoint-xl) flex-row items-end justify-start gap-4 px-4 pb-6 md:gap-6 md:px-0">
          <div className="watchlist-image-wrapper h-24 w-24 shrink-0 overflow-hidden rounded-lg shadow-xl md:h-48 md:w-48 md:rounded-xl">
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

          <div className="mb-0.5 flex flex-col justify-end gap-1 font-sans_caption md:mb-1 md:gap-2">
            <h1 className="line-clamp-1 font-raleway text-xl font-bold text-white drop-shadow-md md:line-clamp-none md:text-5xl">
              {watchlist.name}
            </h1>
            <p className="line-clamp-1 max-w-xs text-xs text-slate-300 md:line-clamp-2 md:text-base">
              {watchlist.description || "No description"}
            </p>
            <div className="mt-1 flex items-center gap-3 text-xs font-medium text-white/80 md:mt-2 md:gap-4 md:text-sm">
              <div className="flex items-center gap-2">
                <div className="avatar-group -space-x-2 md:-space-x-3 rtl:space-x-reverse">
                  {filteredMembers && filteredMembers.length > 0 ? (
                    filteredMembers.slice(0, 3).map((member, key) => (
                      <div className="avatar border-none" key={key}>
                        <div className="h-5 w-5 md:h-8 md:w-8">
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
                      <div className="h-5 w-5 md:h-8 md:w-8">
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
                  className="max-w-[100px] truncate text-xs transition-colors hover:text-white hover:underline md:max-w-none md:text-sm"
                >
                  {filteredMembers.length === 1
                    ? filteredMembers[0]?.user.username
                    : filteredMembers.length === 2
                      ? `${filteredMembers[0]?.user.username} & 1 other`
                      : `${filteredMembers[0]?.user.username} & ${filteredMembers.length - 1} others`}
                </button>
              </div>
              <div className="h-1 w-1 rounded-full bg-white/40"></div>
              <p className="whitespace-nowrap">{totalMovies} Movies</p>
            </div>
          </div>
        </div>
      </WatchlistBackdrop>

      {/* Body Content */}
      <div className="mb-12 flex h-full w-full max-w-(--breakpoint-xl) flex-col gap-4 px-4 md:gap-6 md:px-0">
        <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 md:mt-6">
          <div className="flex items-center gap-2 md:gap-3">
            {isOwned && (
              <button
                onClick={() =>
                  document.getElementById("generate_ticket").showModal()
                }
                className="btn btn-circle h-10 min-h-0 w-10 border-none bg-primary text-neutral hover:scale-105 hover:bg-primary/90 md:h-12 md:w-12"
                title="Generate Ticket"
              >
                <IoTicketOutline size={20} className="md:size-6" />
              </button>
            )}
            {!isOwned && (
              <SaveButton isSavedInitial={watchlist?.saved} token={token} />
            )}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-md md:px-3 md:py-1.5">
            {watchlist.userRole === "OWNER" && (
              <>
                <div
                  className="tooltip tooltip-left tooltip-accent md:tooltip-top"
                  data-tip="Add Collaborator"
                >
                  <button
                    onClick={handleAddCollaborator}
                    className="btn btn-circle h-8 min-h-0 w-8 text-white/70 btn-ghost btn-sm hover:bg-white/10 hover:text-white md:h-9 md:w-9"
                  >
                    <IoPersonAddOutline size={18} className="md:size-5" />
                  </button>
                </div>
                <div
                  className="tooltip tooltip-left tooltip-accent md:tooltip-top"
                  data-tip="Edit Watchlist"
                >
                  <button
                    onClick={handleEditClick}
                    className="btn btn-circle h-8 min-h-0 w-8 text-white/70 btn-ghost btn-sm hover:bg-white/10 hover:text-white md:h-9 md:w-9"
                  >
                    <PencilSimple size={18} className="md:size-5" />
                  </button>
                </div>
                <div
                  className="tooltip tooltip-left tooltip-accent md:tooltip-top"
                  data-tip={
                    watchlist?.isPublic ? "Make Private" : "Make Public"
                  }
                >
                  <button
                    onClick={privacyButtonToggle}
                    className="btn btn-circle h-8 min-h-0 w-8 text-white/70 btn-ghost btn-sm hover:bg-white/10 hover:text-white md:h-9 md:w-9"
                  >
                    {watchlist?.isPublic ? (
                      <CiLock size={20} className="md:size-[22px]" />
                    ) : (
                      <CiUnlock size={20} className="md:size-[22px]" />
                    )}
                  </button>
                </div>
                <div className="mx-1 h-4 w-px bg-white/20"></div>
              </>
            )}
            <div
              className={`tooltip tooltip-left tooltip-accent md:tooltip-top ${!watchlist?.isPublic && watchlist.userRole === "VIEWER" && "hidden"}`}
              data-tip="Share"
            >
              <button
                onClick={handleShareWatchlist}
                className="btn btn-circle h-8 min-h-0 w-8 text-white/70 btn-ghost btn-sm hover:bg-white/10 hover:text-white md:h-9 md:w-9"
              >
                <ShareNetwork size={18} className="md:size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center border-b border-white/10 pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase md:text-sm">
          <div className="w-8 text-center md:w-12">#</div>
          <div>Movies</div>
        </div>

        <div className="flex flex-col gap-3 pb-10">
          <WatchlistItemCard
            watchlistId={watchlist.id}
            watchlistItem={watchlistItem}
            token={token}
          />
        </div>
      </div>

      <dialog id="shared_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border border-white/10 bg-neutral text-white">
          <form method="dialog">
            <button className="btn absolute top-2 right-2 btn-circle text-white/60 btn-ghost btn-sm hover:text-white">
              ✕
            </button>
          </form>
          <h3 className="mb-4 text-lg font-bold">Members</h3>
          <div className="flex flex-col gap-2">
            {filteredMembers.map((member, key) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg bg-base-100/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      member.user.profilePicture || "/assets/images/noimage.jpg"
                    }
                    height={40}
                    width={40}
                    className="rounded-full object-cover"
                    alt={member.user.username}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {member.user.username}
                    </span>
                    <span className="text-xs text-white/50">{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog
        id="edit_watchlist_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <WatchlistModal
          watchlistData={formData}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </dialog>

      <dialog
        id="generate_ticket"
        className="modal modal-bottom sm:modal-middle"
      >
        <TicketModal items={watchlistItem} />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
