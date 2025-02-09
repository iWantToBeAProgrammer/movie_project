"use client";

import { Play } from "@phosphor-icons/react";
import { useState } from "react";
import YouTube from "react-youtube";

const Trailer = ({ movieTrailer }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const handlePlayVideo = (trailerId) => {
    setPlayingVideoId(trailerId);
  };
  const opts = {
    width: "1280",
    height: "720",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="flex flex-col">
      {movieTrailer.map((trailer) => (
        <div className="relative aspect-video w-full h-full">
          {playingVideoId === trailer.id ? (
            <>
              <YouTube videoId={trailer.key} opts={opts} />
            </>
          ) : (
            <>
              <img
                src={`https://i.ytimg.com/vi/${trailer.key}/maxresdefault.jpg`}
                alt={trailer.name}
                className="w-full h-full object-cover"
              />
              <button
                className="button-overlay bg-black/50 w-full h-full flex items-center justify-center absolute top-0 group"
                onClick={() => handlePlayVideo(trailer.id)}
              >
                <Play
                  width={100}
                  height={100}
                  weight="fill"
                  className="group-hover:scale-125 transition-all duration-300 ease-in-out text-white"
                />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Trailer;
