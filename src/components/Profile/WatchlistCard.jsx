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
        message="Are you sure you want to delete this watchlist? This action cannot be undone and you will lose all saved movies in this list."
        confirmLabel="Delete"
        isDanger={true}
        isLoading={isDeleting}
      />

      {openMenuId && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpenMenuId(null)}
        ></div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                className="watchlist-card group relative h-64 w-48 rounded-2xl font-sans_caption transition-colors duration-200 ease-out md:h-80 md:w-60"
              >
                <Link
                  href={`/watchlist/${watchlist.token}`}
                  onClick={() => setOpenMenuId(null)}
                  className="block h-full w-full rounded-2xl px-4 pt-4 hover:bg-white/10"
                >
                  <div className="watchlist-card-wrapper relative flex flex-col items-center gap-3 text-center md:items-start md:text-start">
                    <div className="thumbnail-image-wrapper h-36 w-36 overflow-hidden rounded-2xl shadow-lg md:h-52 md:w-52">
                      {watchlist.picture ? (
                        <Image
                          src={`${watchlist.picture}`}
                          alt={watchlist.name}
                          width={512}
                          height={512}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <WatchlistThumbnail movies={watchlist.items} />
                      )}
                    </div>

                    <div className="watchlist-card-content flex w-full flex-col">
                      <h3 className="watchlist-card-name line-clamp-1 text-left text-base font-bold text-white md:text-lg">
                        {watchlist.name}
                      </h3>
                      <p className="watchlist-card-desc line-clamp-1 text-left text-xs text-[#b3b3b3]">
                        {watchlist.isPublic ? "Public" : "Private"} • By{" "}
                        {watchlist.members.find((m) => m.role === "OWNER")?.user
                          ?.username || "Unknown"}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* TOMBOL MENU (OVERLAY) */}
                <div
                  className={`absolute top-2 right-2 z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out md:right-4 ${
                    openMenuId === uniqueId
                      ? "bg-black/60 opacity-100"
                      : "bg-black/40 opacity-0 group-hover:opacity-100 hover:scale-105 hover:bg-black/60"
                  }`}
                >
                  <div className="dropdown dropdown-right">
                    <button
                      type="button"
                      onClick={(e) => handleMenuClick(e, uniqueId)}
                      className="flex h-full w-full cursor-pointer items-center justify-center text-white"
                    >
                      <HiOutlineDotsVertical size={24} />
                    </button>

                    {/* --- DROPDOWN MENU CONTENT --- */}
                    {openMenuId === uniqueId && (
                      <ul
                        className="dropdown-content ring-opacity-5 menu absolute top-10 right-0 w-56 rounded-md bg-[#282828] p-1 text-sm text-white shadow-xl ring-1 ring-black"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* FITUR OWNER: EDIT */}
                        {isOwner && (
                          <>
                            <li>
                              <button
                                onClick={() => {
                                  onEdit(watchlist);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-left hover:bg-[#3E3E3E]"
                              >
                                <HiPencil size={18} className="text-gray-400" />
                                Edit details
                              </button>
                            </li>
                            <div className="mx-2 my-1 h-px bg-[#3E3E3E]"></div>
                          </>
                        )}

                        {/* FITUR OWNER: PRIVACY TOGGLE */}
                        {isOwner && (
                          <li>
                            <button
                              onClick={() =>
                                handlePrivacy(
                                  watchlist.token,
                                  watchlist.isPublic,
                                )
                              }
                              className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-left hover:bg-[#3E3E3E]"
                            >
                              {watchlist.isPublic ? (
                                <>
                                  <HiLockClosed
                                    size={18}
                                    className="text-gray-400"
                                  />
                                  Make private
                                </>
                              ) : (
                                <>
                                  <HiGlobeAlt
                                    size={18}
                                    className="text-gray-400"
                                  />
                                  Make public
                                </>
                              )}
                            </button>
                          </li>
                        )}

                        {/* Fitur Invite (Copy Link Invite) */}
                        <li>
                          <button
                            onClick={() =>
                              copyLink(
                                `${window.location.origin}/watchlist/invite/${watchlist.inviteToken}`,
                                "Collaborator invite",
                              )
                            }
                            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-left hover:bg-[#3E3E3E]"
                          >
                            <HiUserAdd size={18} className="text-gray-400" />
                            Invite collaborators
                          </button>
                        </li>

                        {/* Fitur Share (Copy Link View) */}
                        <li>
                          <button
                            onClick={() =>
                              copyLink(
                                `${window.location.origin}/watchlist/${watchlist.token}`,
                                "Watchlist",
                              )
                            }
                            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-left hover:bg-[#3E3E3E]"
                          >
                            <HiShare size={18} className="text-gray-400" />
                            Share
                          </button>
                        </li>

                        {/* GRUP 3: DELETE (Hanya Owner, dan warna merah) */}
                        {isOwner && (
                          <>
                            <div className="mx-2 my-1 h-px bg-[#3E3E3E]"></div>
                            <li>
                              <button
                                onClick={() => onRequestDelete(watchlist.id)}
                                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-left text-red-400 hover:bg-[#3E3E3E] hover:text-red-400"
                              >
                                <HiTrash size={18} />
                                Delete
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="absolute top-10 left-0 text-white/30">
            No watchlists yet.
          </p>
        )}
      </div>
    </>
  );
};

export default WatchlistCard;
