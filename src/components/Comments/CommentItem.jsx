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
      <div className="review-wrapper mb-3 flex w-full flex-col gap-3 rounded-lg bg-neutral p-5 text-black">
        <p className="font-medium text-pretty">{comment.content}</p>

        <div className="user-date-wrapper flex items-center justify-between border-t border-gray-300 pt-3">
          <div className="user-profile flex items-center gap-2">
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
            <p className="date-created text-xs text-[#484848]">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
              className="flex cursor-pointer items-center gap-1 text-xs font-bold text-secondary hover:underline"
            >
              <BsReplyFill size={16} /> Reply
            </button>
          </div>
        </div>
      </div>

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

      {replies.length > 0 && (
        <div className="mt-2 ml-2 flex flex-col border-l-2 border-white/10 pl-4 md:pl-8">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={getReplies(reply.id)}
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
