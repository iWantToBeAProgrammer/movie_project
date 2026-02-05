"use client";

import { useState, useMemo } from "react";
import ErrorNotification from "../Auth/ErrorNotification";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useAuth } from "@/app/contexts/AuthContext";
import { useComments } from "@/hooks/useComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const CommentSection = ({ movieId }) => {
  const { user } = useAuth();
  const [activeReplyId, setActiveReplyId] = useState(null);

  const { data: comments = [], isLoading, error } = useComments(movieId);

  const rootComments = useMemo(() => {
    return Array.isArray(comments)
      ? comments.filter((c) => c.parentId === null)
      : [];
  }, [comments]);

  const getReplies = (parentId) => {
    return Array.isArray(comments)
      ? comments.filter((c) => c.parentId === parentId)
      : [];
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <CommentForm
          movieId={movieId}
          user={user}
          className="w-full md:w-1/2"
        />
      </div>

      {isLoading && (
        <span className="loading loading-lg text-white loading-dots"></span>
      )}
      {error && <p className="text-red-500">Error fetching comments</p>}

      <div className="mt-4 flex flex-col gap-4">
        {rootComments.length > 0
          ? rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={getReplies(comment.id)}
                getReplies={getReplies}
                movieId={movieId}
                user={user}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
              />
            ))
          : !isLoading && (
              <p className="text-gray-300 italic">No comments yet.</p>
            )}
      </div>

      <dialog className="modal" id="error-notification">
        <ErrorNotification
          icon={<HiOutlineExclamationCircle size={104} />}
          title={"You Need to login"}
          desc="Please log in to continue. You need an account to use this feature."
        />
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CommentSection;
