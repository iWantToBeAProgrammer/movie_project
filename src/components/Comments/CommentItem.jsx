import Image from "next/image";
import { BsReplyFill } from "react-icons/bs";
import CommentForm from "./CommentForm";

const CommentItem = ({
  comment,
  replies,
  getReplies,
  movieId,
  user,
  activeReplyId,
  setActiveReplyId,
}) => {
  const isReplying = activeReplyId === comment.id;

  return (
    <div className="flex w-full flex-col">
      {/* --- DESIGN CARD ORIGINAL KAMU --- */}
      <div className="review-wrapper mb-3 flex w-full flex-col gap-3 rounded-lg bg-neutral p-5 text-black">
        {/* Konten Komentar */}
        <p className="font-medium text-pretty">{comment.content}</p>

        {/* User Info Wrapper */}
        <div className="user-date-wrapper flex items-center justify-between border-t border-gray-300 pt-3">
          <div className="user-profile flex items-center gap-2">
            {/* Logic Avatar */}
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
              {comment.user?.profilePicture ? (
                <Image
                  src={comment.user.profilePicture}
                  alt={comment.user.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-gray-600">
                  {comment.user?.username?.[0]?.toUpperCase() || "#"}
                </span>
              )}
            </div>

            <p className="user-name text-sm font-bold text-secondary">
              {comment.user?.username || "Anonymous"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Tanggal */}
            <p className="date-created text-xs text-[#484848]">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>

            {/* Tombol Reply Baru */}
            <button
              onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
              className="flex cursor-pointer items-center gap-1 text-xs font-bold text-secondary hover:underline"
            >
              <BsReplyFill size={16} /> Reply
            </button>
          </div>
        </div>
      </div>

      {/* --- FORM REPLY (Muncul jika tombol reply diklik) --- */}
      {isReplying && (
        <div className="mb-4 border-l-2 border-secondary pl-4">
          <CommentForm
            movieId={movieId}
            user={user}
            parentId={comment.id}
            placeholder={`Replying to ${comment.user?.username}...`}
            onSuccess={() => setActiveReplyId(null)}
            className="w-full"
          />
        </div>
      )}

      {/* --- RECURSIVE REPLIES (Menampilkan anak komentar) --- */}
      {replies.length > 0 && (
        // Gunakan border-l (garis kiri) untuk indikator thread
        <div className="mt-2 ml-2 flex flex-col border-l-2 border-white/10 pl-4 md:pl-8">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              // 1. Cari anak dari reply ini (Cucu)
              replies={getReplies(reply.id)}
              // 2. Terus oper fungsinya ke bawah (Prop Drilling)
              getReplies={getReplies}
              movieId={movieId}
              user={user}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
