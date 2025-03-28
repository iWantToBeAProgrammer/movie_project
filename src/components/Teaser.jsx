import { CaretRight, Play } from "@phosphor-icons/react";
import dateFormat from "dateformat";
import { useState } from "react";
import VideoModal from "./Video/VideoModal";
import Image from "next/image";

const Teaser = ({ movieTeaser }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleOpenModal = (teaser) => {
    setSelectedVideo(teaser);
    document.getElementById(`video_modal_${teaser.id}`).showModal();
  };

  const handleCloseModal = () => {
    const currentModal = document.getElementById(
      `video_modal_${selectedVideo?.id}`
    );
    if (currentModal) {
      currentModal.close();
      setSelectedVideo(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <h1
          className={`flex items-center py-4 gap-8 text-2xl ${
            movieTeaser.length === 0 && "hidden"
          }`}
        >
          Teaser{" "}
          <CaretRight className="text-secondary" weight="bold" size={30} />
        </h1>

        <div className="flex flex-col gap-4 text-sm teaser-wrapper">
          {movieTeaser.map((teaser) => (
            <div key={teaser.id} className="flex gap-4">
              <button
                className="teaser-img-wrapper relative"
                onClick={() => handleOpenModal(teaser)}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${teaser.key}/maxresdefault.jpg`}
                  alt={teaser.name}
                  className="object-cover w-80"
                  width={400}
                  height={180}
                />
                <div className="button-overlay bg-black/50 w-full h-full flex items-center justify-center absolute top-0 group">
                  <Play
                    width={100}
                    height={100}
                    weight="fill"
                    className="group-hover:scale-125 transition-all duration-300 ease-in-out text-white"
                  />
                </div>
              </button>

              {/* Individual modal for each teaser */}
              <dialog
                id={`video_modal_${teaser.id}`}
                className="modal bg-black/70"
              >
                <VideoModal
                  isOpen={selectedVideo?.id === teaser.id ? true : false}
                  isClose={handleCloseModal}
                  videoKey={teaser.key}
                />

                <form method="dialog" className="modal-backdrop">
                  <button onClick={handleCloseModal}>close</button>
                </form>
              </dialog>

              <div className="teaser-content w-1/2">
                <h1 className="teaser-title text-xl mb-4">{teaser.name}</h1>
                <ul className="list-disc list-inside flex items-center font-raleway gap-6 text-nowrap">
                  <li>{teaser.type}</li>
                  <li>{dateFormat(teaser.published_at, "mmmm dS, yyyy")}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Teaser;
