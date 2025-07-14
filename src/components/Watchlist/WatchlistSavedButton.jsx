import { useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./saveButton.css";
import { IoAddCircleOutline, IoCheckmarkCircle } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSavedWatchlist, deleteSavedWatchlist } from "@/libs/api";
import toast from "react-hot-toast";

export default function SaveButton({ isSavedInitial = false, token }) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const buttonRef = useRef(null);
  const queryClient = useQueryClient();

  const createSaveMutation = useMutation({
    mutationFn: createSavedWatchlist,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["watchlist", token]);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteSaveMutation = useMutation({
    mutationFn: deleteSavedWatchlist,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["watchlist", token]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    setIsSaved((prev) => !prev);

    if (!isSaved && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      for (let i = 0; i < 1; i++) {
        confetti({
          particleCount: 20, // 🔥 small number of particles
          angle: 90, // random burst direction
          spread: 180, // narrow spread
          startVelocity: 30,
          origin: { x, y },
          scalar: 0.4, // smaller size
          ticks: 40,
          colors: ["#86efac", "#4ade80", "#22c55e"], // Tailwind green variants
        });
      }

      createSaveMutation.mutate(token);
    } else {
      deleteSaveMutation.mutate(token);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`tooltip flex h-10 w-10 items-center justify-center rounded-full font-semibold tooltip-accent transition-all duration-300`}
      data-tip={`${!isSaved ? "Save to your library" : "Remove from your library"}`}
    >
      <IoAddCircleOutline
        size={32}
        className={`absolute text-white/50 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white/100 ${isSaved && "rotate-active"}`}
      />

      <IoCheckmarkCircle
        size={32}
        color="#22c55e"
        className={`absolute text-white/50 transition-all duration-300 ease-in-out hover:scale-110 hover:text-white/100 ${!isSaved && "rotate-active"}`}
      />
    </button>
  );
}
