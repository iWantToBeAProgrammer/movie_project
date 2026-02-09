"use client";

import Image from "next/image";
import WatchlistThumbnail from "./Thumbnail/WatchlistThumbnail";
import Link from "next/link";
import {
  HiOutlineDotsVertical,
  HiPencil,
  HiTrash,
  HiLockClosed,
  HiGlobeAlt,
  HiUserAdd,
  HiShare,
} from "react-icons/hi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useWatchlistMutations } from "@/hooks/useWatchlistQueries";
import ConfirmationModal from "../ConfirmationModal";

const WatchlistCard = ({ watchlists = [], username, onEdit }) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const { deleteWatchlist, isDeleting, togglePrivacy } =
    useWatchlistMutations();
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleMenuClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const copyLink = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} link copied!`);
    setOpenMenuId(null);
  };

  const onRequestDelete = (id) => {
    setDeleteTargetId(id);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteWatchlist(deleteTargetId, {
        onSuccess: () => {
          setDeleteTargetId(null);
        },
      });
    }
  };

  const handlePrivacy = (token, currentStatus) => {
    togglePrivacy({ token, isPublic: !currentStatus });
    setOpenMenuId(null);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Watchlist"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete"
        isDanger={true}
        isLoading={isDeleting}
      />

      {/* Overlay buat nutup menu kalo klik diluar */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpenMenuId(null)}
        ></div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {watchlists.length !== 0 ? (
          watchlists?.map((watchlist, index) => {
            const uniqueId = watchlist.id || index;
            const isOwner = watchlist?.members?.some(
              (item) =>
                item.role === "OWNER" && item.user.username === username,
            );

            return (
              <div
                key={uniqueId}
                // PERBAIKAN 1: Hapus 'overflow-hidden' agar dropdown tidak terpotong
                className="group relative flex w-full flex-col rounded-xl bg-white/5 transition-all hover:bg-white/10"
              >
                <Link
                  href={`/watchlist/${watchlist.token}`}
                  onClick={() => setOpenMenuId(null)}
                  className="flex h-full flex-col"
                >
                  {/* Thumbnail Section */}
                  {/* PERBAIKAN 2: Tambah 'rounded-t-xl' agar sudut atas gambar tetap melengkung */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-black/40">
                    {watchlist.picture ? (
                      <Image
                        src={`${watchlist.picture}`}
                        alt={watchlist.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <WatchlistThumbnail movies={watchlist.items} />
                    )}

                    {/* Privacy Badge */}
                    <div className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                      {watchlist.isPublic ? "Public" : "Private"}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <h3 className="line-clamp-1 font-raleway text-sm font-bold text-white md:text-base">
                        {watchlist.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-gray-400 md:text-xs">
                        {watchlist.items?.length || 0} movies •{" "}
                        {
                          watchlist.members.find((m) => m.role === "OWNER")
                            ?.user?.username
                        }
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Menu Button (Absolute Top Right) */}
                <div className="absolute top-1 right-1 z-50">
                  <button
                    onClick={(e) => handleMenuClick(e, uniqueId)}
                    className={`btn btn-circle border-none bg-black/40 text-white btn-xs hover:bg-black/60 ${openMenuId === uniqueId ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"}`}
                  >
                    <HiOutlineDotsVertical size={14} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === uniqueId && (
                    <ul
                      className="menu absolute top-8 right-0 z-50 w-48 rounded-lg bg-[#222] p-1 text-xs text-white shadow-xl ring-1 ring-white/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isOwner && (
                        <>
                          <li>
                            <button
                              onClick={() => {
                                onEdit(watchlist);
                                setOpenMenuId(null);
                              }}
                              className="gap-3 py-2 hover:bg-white/10"
                            >
                              <HiPencil size={14} className="text-gray-400" />{" "}
                              Edit details
                            </button>
                          </li>
                          <div className="my-0.5 h-px bg-white/10"></div>
                          <li>
                            <button
                              onClick={() =>
                                handlePrivacy(
                                  watchlist.token,
                                  watchlist.isPublic,
                                )
                              }
                              className="gap-3 py-2 hover:bg-white/10"
                            >
                              {watchlist.isPublic ? (
                                <HiLockClosed
                                  size={14}
                                  className="text-gray-400"
                                />
                              ) : (
                                <HiGlobeAlt
                                  size={14}
                                  className="text-gray-400"
                                />
                              )}
                              {watchlist.isPublic
                                ? "Make private"
                                : "Make public"}
                            </button>
                          </li>
                        </>
                      )}

                      <li>
                        <button
                          onClick={() =>
                            copyLink(
                              `${window.location.origin}/watchlist/invite/${watchlist.inviteToken}`,
                              "Invite",
                            )
                          }
                          className="gap-3 py-2 hover:bg-white/10"
                        >
                          <HiUserAdd size={14} className="text-gray-400" />{" "}
                          Invite
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            copyLink(
                              `${window.location.origin}/watchlist/${watchlist.token}`,
                              "Watchlist",
                            )
                          }
                          className="gap-3 py-2 hover:bg-white/10"
                        >
                          <HiShare size={14} className="text-gray-400" /> Share
                        </button>
                      </li>

                      {isOwner && (
                        <>
                          <div className="my-0.5 h-px bg-white/10"></div>
                          <li>
                            <button
                              onClick={() => onRequestDelete(watchlist.id)}
                              className="gap-3 py-2 text-red-400 hover:bg-white/10 hover:text-red-400"
                            >
                              <HiTrash size={14} /> Delete
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center text-sm text-gray-500">
            No watchlists found. Start by creating one!
          </div>
        )}
      </div>
    </>
  );
};

export default WatchlistCard;
