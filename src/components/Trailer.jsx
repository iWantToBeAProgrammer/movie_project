"use client";

import { Play } from "@phosphor-icons/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

const Trailer = ({ movieTrailer }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const searchParams = useSearchParams();
  const autoplay = searchParams.get("autoplay") === "true";

  useEffect(() => {
    if (autoplay && movieTrailer?.length > 0) {
      setPlayingVideoId(movieTrailer[0].id);
    }
  }, [autoplay, movieTrailer]);

  const handlePlayVideo = (trailerId) => {
    setPlayingVideoId(trailerId);
    setIsVideoLoaded(false); // Reset load state for new video
  };

  const onPlayerReady = () => {
    setIsVideoLoaded(true);
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  // If no trailers, return null or placeholder
  if (!movieTrailer || movieTrailer.length === 0) return null;

  // We only show the first trailer in the main section for better focus
  const mainTrailer = movieTrailer[0];

  return (
    <div className="w-full">
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl transition-all duration-500 hover:border-primary/30">
        
        {/* Placeholder / Thumbnail shown while not playing OR while video is loading */}
        {(!playingVideoId || !isVideoLoaded) && (
          <div className="absolute inset-0 z-10 h-full w-full">
            <Image
              src={`https://i.ytimg.com/vi/${mainTrailer.key}/maxresdefault.jpg`}
              alt={mainTrailer.name}
              fill
              className="object-cover brightness-75 transition-transform duration-700 group-hover:scale-105"
              priority
            />
            
            {/* Play Button Overlay - only show if not currently playing */}
            {!playingVideoId && (
              <button
                className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/30 transition-colors hover:bg-black/50"
                onClick={() => handlePlayVideo(mainTrailer.id)}
                aria-label="Play Trailer"
              >
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_20px_rgba(var(--color-primary),0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.7)] md:h-24 md:w-24">
                  <Play
                    size={40}
                    weight="fill"
                    className="ml-1 transition-transform group-hover:scale-110 md:size-56"
                  />
                  {/* Ripple Effect Animation */}
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/40"></div>
                </div>
              </button>
            )}

            {/* Loading Spinner shown after clicking play but before video is ready */}
            {playingVideoId && !isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
          </div>
        )}

        {/* YouTube Player */}
        {playingVideoId && (
          <YouTube
            videoId={mainTrailer.key}
            opts={opts}
            onReady={onPlayerReady}
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
            containerClassName="w-full h-full"
          />
        )}
      </div>
      
      {/* Optional: Trailer Title or Badge */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary ring-1 ring-primary/20">
          Official Trailer
        </span>
        {mainTrailer.name && (
          <p className="line-clamp-1 text-xs font-medium text-white/40">
            {mainTrailer.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default Trailer;
