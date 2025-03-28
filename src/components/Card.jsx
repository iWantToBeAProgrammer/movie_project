"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CustomNavigation from "./CustomNavigation";
import "swiper/css";
import "swiper/css/navigation";
import { CaretCircleDoubleRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const Card = ({ results = [] }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!results || results.length === 0) {
    return <p>No data available</p>;
  }

  const router = useRouter();

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerGroup={5}
        slidesPerView={5}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
            slidesPerGroup: 1,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 15,
            slidesPerGroup: 2,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
            slidesPerGroup: 3,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
            slidesPerGroup: 4,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 20,
            slidesPerGroup: 6,
          },
        }}
        className="relative px-12"
      >
        <CustomNavigation isHovered={isHovered} />

        {results.map((result) => {
          const releaseYear = result.release_date?.slice(0, 4) || "";

          return (
            <SwiperSlide key={result.id} className="w-full">
              <div className="relative group w-full aspect-[2/3] overflow-hidden rounded-lg">
                {result.poster_path && (
                  <Image
                    src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
                    fill
                    className="object-cover"
                    alt={result.title || "Movie poster"}
                  />
                )}

                <div
                  className={`w-full group-hover:translate-y-0 bg-black/0 hover:bg-black/70 ${
                    !result.poster_path && "bg-black/70"
                  } transition-colors duration-300 ease-in-out h-full`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-white">
                    <div className="text-center">
                      <h1 className="text-lg font-normal line-clamp-1 tracking-wider">
                        {result.title}
                      </h1>
                      {releaseYear && (
                        <p className="text-sm text-gray-300">{`(${releaseYear})`}</p>
                      )}
                    </div>
                    <Link
                      href={`/movies/${result.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      View Details
                      <CaretCircleDoubleRight size={16} color="#FFFFFF" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Card;
