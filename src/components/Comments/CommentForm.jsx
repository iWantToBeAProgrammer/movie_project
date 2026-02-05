import { useAddComment } from "@/hooks/useComments";
import { useState } from "react"

const CommentForm = ({
  movieId,
  user,
  parentId = null,
  onSuccess,
  placeholder = "Add a review",
  className = "",
}) => {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useAddComment(movieId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      document.getElementById("error-notification").showModal();
      return;
    }

    mutate(
      { movieId, content, parentId },
      {
        onSuccess: () => {
          setContent("");
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <form
      method="POST"
      onSubmit={handleSubmit}
      className={`flex gap-2 font-raleway font-semibold ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-white bg-transparent p-3 text-white focus:border-secondary focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus={!!parentId} 
      />
      <button
        type="submit"
        className="btn rounded-lg border-none bg-secondary px-4 text-white btn-lg"
        disabled={isPending}
      >
        {isPending ? "..." : parentId ? "Reply" : "Post"}
      </button>
    </form>
  );
};

export default CommentForm;
