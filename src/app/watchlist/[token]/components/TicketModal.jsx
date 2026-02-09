import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TicketModal({ items }) {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("cyber");
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleToggleMovie = (movie) => {
    const isSelected = selectedMovies.some((m) => m.id === movie.id);

    if (isSelected) {
      setSelectedMovies((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      if (selectedMovies.length >= 4) {
        toast.error("You can only select up to 4 movies.");
        return;
      }
      setSelectedMovies((prev) => [...prev, movie]);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && selectedMovies.length < 1) {
      toast.error("Please select at least 1 movie.");
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const moviesData = selectedMovies.map((m) => ({
        id: m.id,
        title: m.title || m.name,
        overview: m.overview || "",
        posterUrl: m.posterPath
          ? `${process.env.NEXT_PUBLIC_BASEIMG || process.env.NEXT_APP_BASEIMG}${m.posterPath}`
          : "https://placehold.co/400x600?text=No+Image",
      }));

      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          movies: moviesData,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate ticket");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CinemaTix-${selectedTheme}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Story ticket generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate ticket.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div
        className={`mt-4 rounded-xl p-4 text-center text-sm font-semibold text-white transition-colors duration-300 ${
          selectedMovies.length < 1 || selectedMovies.length > 4
            ? "bg-error/80"
            : "bg-success/80"
        }`}
      >
        Selected: {selectedMovies.length}/4 movies (min 1)
      </div>
      <div className="mt-6 grid max-h-[400px] grid-cols-2 gap-4 overflow-y-auto p-2 md:grid-cols-3">
        {items.map((item) => {
          const isSelected = selectedMovies.some((m) => m.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleToggleMovie(item)}
              className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:-translate-y-1 ${
                isSelected ? "border-[#ff4d00]" : "border-transparent"
              }`}
            >
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={
                    item.posterPath
                      ? `${process.env.NEXT_APP_BASEIMG}${item.posterPath}`
                      : "/placeholder.png"
                  }
                  alt={item.title}
                  fill
                  className={`object-cover ${isSelected ? "opacity-100" : "opacity-60"}`}
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4d00] font-bold text-black">
                    ✓
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderStep2 = () => (
    <div className="flex flex-col items-center gap-8 py-10">
      <h3 className="text-xl font-bold">Choose Ticket Style</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {["cyber", "modern", "cute", "vintage", "horror"].map((theme) => (
          <button
            key={theme}
            onClick={() => setSelectedTheme(theme)}
            className={`btn h-auto w-24 flex-col gap-2 p-4 capitalize ${selectedTheme === theme ? "ring-2 ring-offset-2 ring-offset-base-100 btn-primary" : "btn-outline"}`}
          >
            <span className="text-2xl">
              {theme === "cyber" && "🤖"}
              {theme === "modern" && "✨"}
              {theme === "cute" && "🌸"}
              {theme === "vintage" && "📜"}
              {theme === "horror" && "🩸"}
            </span>
            {theme}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const getThemeStyle = () => {
      switch (selectedTheme) {
        case "cute":
          return {
            wrapper: "bg-[#FFF0F5] border-[#FFB6C1]",
            header: "text-[#FF1493] drop-shadow-sm font-black",
            card: "bg-white border-4 border-[#FFB6C1] rounded-[20px] shadow-sm",
            text: "text-[#FF1493] font-bold",
            accent: "bg-[#FF69B4] text-white",
            icon: "💖",
          };
        case "vintage":
          return {
            wrapper: "bg-[#E8DCC5] border-[#8B4513]",
            header:
              "text-[#4A3B2A] font-serif tracking-widest border-b-4 border-[#4A3B2A] pb-2",
            card: "bg-[#F4EBD9] border-2 border-[#4A3B2A] rounded-sm shadow-md",
            text: "text-[#4A3B2A] font-serif font-bold uppercase",
            accent: "border border-[#4A3B2A] text-[#4A3B2A]",
            icon: "📜",
          };
        case "horror":
          return {
            wrapper: "bg-[#050505] border-[#8a0303]", // Dark
            header:
              "text-[#8a0303] font-black tracking-[0.2em] uppercase drop-shadow-[0_2px_0_rgba(255,0,0,0.5)]",
            card: "bg-[#0a0a0a] border-2 border-[#8a0303] rounded-none shadow-[0_0_10px_rgba(138,3,3,0.3)]",
            text: "text-[#e0e0e0] font-bold uppercase",
            accent: "bg-[#8a0303] text-black",
            icon: "💀",
          };
        case "modern":
          return {
            wrapper: "bg-[#F3F4F6] border-gray-300",
            header: "text-gray-900 font-black tracking-tight",
            card: "bg-white rounded-xl shadow-lg border-none",
            text: "text-gray-800 font-bold",
            accent: "bg-gray-200 text-gray-800",
            icon: "✨",
          };
        case "cyber":
        default:
          return {
            wrapper: "bg-[#121212] border-[#ff4d00]",
            header: "text-[#ff4d00] font-black tracking-widest uppercase",
            card: "bg-[#1a1a1a] border border-[#ff4d00]/50 rounded-lg shadow-lg",
            text: "text-white font-bold uppercase font-sans",
            accent: "bg-[#ff4d00] text-black",
            icon: "🤖",
          };
      }
    };

    const style = getThemeStyle();

    return (
      <div className="flex flex-col items-center justify-center py-6 transition-all duration-300">
        <h3 className="mb-4 text-lg font-bold text-gray-400">
          Preview ({selectedTheme})
        </h3>

        {/* CONTAINER UTAMA (HP SCREEN) */}
        <div
          className={`relative flex aspect-[9/16] w-[280px] flex-col items-center overflow-hidden rounded-xl border-4 p-5 shadow-2xl transition-all duration-500 ${style.wrapper}`}
        >
          <div className="mb-6 w-full text-center">
            <h1 className={`text-2xl ${style.header}`}>WATCHLIST</h1>
            <p
              className={`text-[9px] opacity-60 ${selectedTheme === "vintage" ? "font-serif text-[#4A3B2A]" : "font-mono text-gray-500"}`}
            >
              OFFICIAL SELECTION
            </p>
          </div>

          {/* List Movies */}
          <div className="flex w-full flex-1 flex-col gap-3 overflow-hidden">
            {selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className={`flex w-full items-center gap-3 p-3 transition-all ${style.card}`}
              >
                <div
                  className={`relative h-14 w-10 flex-shrink-0 overflow-hidden ${selectedTheme === "cute" ? "rounded-md" : "rounded-sm"}`}
                >
                  <img
                    src={
                      movie.posterPath
                        ? `${process.env.NEXT_APP_BASEIMG}${movie.posterPath}`
                        : "/placeholder.png"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info Text */}
                <div className="flex min-w-0 flex-col">
                  <span className={`truncate text-[10px] ${style.text}`}>
                    {movie.title || movie.name}
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span
                      className={`rounded px-1 text-[8px] font-bold ${style.accent}`}
                    >
                      {new Date().getFullYear()}
                    </span>
                    <span className="text-[8px] opacity-60">{style.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 w-full text-center opacity-60">
            <p
              className={`text-[8px] ${selectedTheme === "vintage" ? "font-serif text-[#4A3B2A]" : "font-mono text-gray-500"}`}
            >
              GENERATED BY MOVIELIST
            </p>
          </div>
        </div>
      </div>
    );
  };

  // --- EMPTY STATE ---
  if (!items || items.length === 0)
    return (
      <div className="modal-box text-center">
        <h2 className="text-xl font-bold">No Movies</h2>
        <form method="dialog">
          <button className="btn mt-4">Close</button>
        </form>
      </div>
    );

  return (
    <div className="relative modal-box w-11/12 max-w-4xl overflow-hidden p-0 rounded-2xl ml-10">
      <div className="sticky top-0 z-20 bg-base-100 px-6 py-4 shadow-sm">
        <h2 className="mb-4 text-center text-2xl font-bold">
          Ticket Generator
        </h2>
        <ul className="steps w-full text-sm font-semibold">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Select</li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Theme</li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
            Download
          </li>
        </ul>
      </div>

      <div className="max-h-[55vh] min-h-[380px] overflow-y-auto px-6 py-4">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="flex justify-between border-t border-base-200 bg-base-100 p-6">
        {step > 1 ? (
          <button
            className="btn btn-outline btn-neutral"
            onClick={handlePreviousStep}
            disabled={isGenerating}
          >
            Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <button className="btn btn-primary" onClick={handleNextStep}>
            Next Step
          </button>
        ) : (
          <button
            className={`btn shadow-lg btn-accent ${selectedTheme === "cyber" ? "border-[#ff4d00] bg-[#ff4d00] text-black" : ""}`}
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Download Ticket"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
