"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ErrorNotification from "./Auth/ErrorNotification";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useAuth } from "@/app/contexts/AuthContext";

const fetchComments = async (movieId) => {
  const res = await fetch(`/api/comment?movieId=${movieId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

const postComment = async ({ movieId, content }) => {
  const res = await fetch("/api/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movieId, content }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to post comment");
  }
  return res.json();
};

const CommentSection = ({ movieId }) => {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comment", movieId],
    queryFn: () => fetchComments(movieId),
  });

  const mutation = useMutation({
    mutationFn: postComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comment", movieId] });

      const prevComments = queryClient.getQueryData(["comment", movieId]);
      queryClient.setQueryData(["comments", movieId], (old) => [
        {
          ...newComment,
          id: Math.random().toString(),
          user: { username: "You" },
          createdAt: new Date(),
        },
        ...(old || []),
      ]);

      return { prevComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comment", movieId], context.prevComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", movieId] });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Comment posted successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      document.getElementById("error-notification").showModal();
    } else {
      mutation.mutate({ movieId, content });
    }
    setContent("");
  };

  return (
    <div className="w-full">
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex w-1/2 gap-2 font-raleway font-semibold"
      >
        <input
          type="text"
          placeholder="Add a review"
          className="w-full rounded-lg border border-white bg-transparent p-3 text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="btn rounded-lg bg-secondary px-4 btn-lg"
          role="button"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Posting..." : "Post"}
        </button>
      </form>

      {isLoading && <p className="text-white">Loading comments...</p>}
      {error && <p className="text-red-500">Error fetching comments</p>}

      <div className="mt-4 grid grid-cols-2 items-center justify-center gap-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="review-wrapper flex h-fit w-full flex-col gap-4 rounded-lg bg-neutral p-5 text-black"
            >
              <p className="text-pretty">{comment.content}</p>
              <div className="user-date-wrapper flex items-center justify-between">
                <div className="user-profile flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
                    <span className="text-sm text-gray-600">#</span>
                  </div>
                  <p className="user-name text-secondary">
                    {comment.user?.username || "Anonymous"}
                  </p>
                </div>
                <p className="date-created text-[#484848]">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-300">No comments yet.</p>
        )}
      </div>
      <dialog className="modal" id="error-notification">
        <ErrorNotification
          icon={<HiOutlineExclamationCircle size={104} />}
          title={"You Need to login"}
          desc={
            "Please log in to continue. You need an account to use this feature."
          }
        />
      </dialog>
    </div>
  );
};

export default CommentSection;
