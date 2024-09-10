"use client";

import { CaretRight } from "@phosphor-icons/react";
import dateFormat from "dateformat";
import YouTube from "react-youtube";

const Teaser = ({ movieTeaser }) => {
  const opts = {
    height: "200",
    width: "320",
  };

  console.log(movieTeaser);
  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <h1 className={`flex items-center py-4 gap-8 text-4xl ${movieTeaser.length === 0 && 'hidden'}`}>
          Teaser{" "}
          <CaretRight className="text-secondary" weight="bold" size={50} />
        </h1>

        <div className="teaser-wrapper flex flex-col gap-4 text-base">
          {movieTeaser.map((teaser) => {
            return (
              <div key={teaser.id} className="flex gap-6">
                <YouTube
                  videoId={teaser.key}
                  opts={opts}
                  onReady={(event) => event.target.pauseVideo()}
                />
                <div className="teaser-content">
                    <h1 className="teaser-title text-3xl mb-4">{teaser.name}</h1>
                    <ul className="list-disc list-inside flex items-center font-raleway gap-5">
                        <li>{teaser.type}</li>
                        <li>{dateFormat(teaser.published_at, "mmmm dS, yyyy")}</li>
                    </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Teaser;
