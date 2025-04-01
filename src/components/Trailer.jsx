"use client";

import { Play } from "@phosphor-icons/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

const Trailer = ({ movieTrailer }) => {
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const searchParams = useSearchParams();
  const autoplay = searchParams.get("autoplay") === "true";

  useEffect(() => {
    if (autoplay && movieTrailer?.length > 0) {
      setPlayingVideoId(movieTrailer[0].id);
    }
  }, [autoplay, movieTrailer]);

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
      {movieTrailer?.map((trailer, key) => (
        <div key={key} className="relative aspect-video h-full w-full">
          {playingVideoId === trailer.id ? (
            <YouTube videoId={trailer.key} opts={opts} />
          ) : (
            <>
              <Image
                src={`https://i.ytimg.com/vi/${trailer.key}/maxresdefault.jpg`}
                alt={trailer.name}
                className="h-full object-cover"
                width={1280}
                height={720}
              />
              <button
                className="button-overlay group absolute top-0 flex h-full w-full items-center justify-center bg-black/50"
                onClick={() => handlePlayVideo(trailer.id)}
              >
                <Play
                  width={100}
                  height={100}
                  weight="fill"
                  className="text-white transition-all duration-300 ease-in-out group-hover:scale-125"
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
