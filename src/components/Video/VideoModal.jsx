import YouTube from "react-youtube";
import { useState, useEffect } from "react";

const VideoModal = ({ videoKey, isOpen, isClose }) => {
  const [playerKey, setPlayerKey] = useState(videoKey);

  useEffect(() => {
    if (isOpen) {
      setPlayerKey(`${videoKey}-${Date.now()}`);
    }
  }, [isOpen, videoKey]);

  const opts = {
    width: "953",
    height: "536",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="modal-box max-w-5xl justify-center items-center flex">
      {isOpen && <YouTube key={playerKey} videoId={videoKey} opts={opts} />}
    </div>
  );
};

export default VideoModal;
