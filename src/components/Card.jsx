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
        spaceBetween={10}
        slidesPerView={2}
        slidesPerGroup={2}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
            slidesPerGroup: 2,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 10,
            slidesPerGroup: 3,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 15,
            slidesPerGroup: 4,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 20,
            slidesPerGroup: 5,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 20,
            slidesPerGroup: 6,
          },
        }}
        className="relative px-4 sm:px-8 md:px-12"
      >
        <CustomNavigation isHovered={isHovered} />

        {results.map((result) => {
          const releaseYear = result.release_date?.slice(0, 4) || "";

          return (
            <SwiperSlide key={result.id} className="w-full">
              <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-900">
                {result.poster_path ? (
                  <Image
                    src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={result.title || "Movie poster"}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-500">
                    No Image
                  </div>
                )}

                <div
                  className={`absolute inset-0 flex h-full w-full translate-y-4 flex-col items-center justify-center bg-black/70 p-4 text-center text-white opacity-0 backdrop-blur-sm group-hover:translate-y-0 group-hover:opacity-100 ${!result.poster_path && "translate-y-0 opacity-100"} z-10 transition-all duration-300 ease-in-out`}
                >
                  <div className="flex flex-col items-center gap-2 md:gap-4">
                    <div>
                      <h1 className="line-clamp-2 text-sm font-bold tracking-wider md:line-clamp-1 md:text-lg md:font-normal">
                        {result.title}
                      </h1>
                      {releaseYear && (
                        <p className="text-xs text-gray-300 md:text-sm">{`(${releaseYear})`}</p>
                      )}
                    </div>

                    <Link
                      href={`/movies/${result.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-primary to-secondary px-3 py-1.5 text-xs font-bold transition-transform hover:scale-105 md:gap-2 md:px-4 md:py-2 md:text-sm"
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
