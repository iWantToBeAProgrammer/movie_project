"use client";

import Image from "next/image";
import { CaretCircleDoubleRight } from "@phosphor-icons/react";

const Card = ({ result }) => {
  const releaseYear = result.release_date.slice(0, 4);
  return (
    <>
      <div className="card w-56 relative overflow-hidden">
        <Image
          src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
          width={500}
          height={500}
        />

        <div className="absolute bottom-0 w-full transition duration-500 ease-in-out transform translate-y-full bg-black group card-overlay bg-opacity-70 h-52">
          <div className="flex flex-col items-center justify-center h-full gap-6 py-4 text-3xl text-white card-content">
            <div className="text-center card-text">
              <h1 className="card-title ">{result.title}</h1>
              <p className="release-year">{`(${releaseYear})`}</p>
            </div>
            <button className="btn btn-sm rounded-badge bg-gradient-to-r from-primary to-secondary font-bold inline-flex items-center gap-2">
              View Details <CaretCircleDoubleRight size={16} color="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
