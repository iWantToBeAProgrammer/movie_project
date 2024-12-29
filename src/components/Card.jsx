"use client";

import Image from "next/image";
import { CaretCircleDoubleRight } from "@phosphor-icons/react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import "swiper/css";
import "swiper/css/navigation";

const CustomNavigation = () => {
  const swiper = useSwiper();

  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        className="absolute top-0 left-0 z-10 flex items-center justify-center h-full transition-opacity bg-black w-14 opacity-70 hover:opacity-100"
        aria-label="Previous slide"
      >
        <CaretLeft size={50} className="text-secondary" weight="bold" />
      </button>

      <button
        onClick={() => swiper.slideNext()}
        className="absolute top-0 right-0 z-10 flex items-center justify-center h-full transition-opacity bg-black w-14 opacity-70 hover:opacity-100"
        aria-label="Next slide"
      >
        <CaretRight size={50} className="text-secondary" weight="bold" />
      </button>
    </>
  );
};

const Card = ({ results = [] }) => {
  if (!results || results.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        }}
        className="relative px-12"
      >
        <CustomNavigation />

        {results.map((result) => {
          const releaseYear = result.release_date?.slice(0, 4) || "";

          return (
            <SwiperSlide key={result.id} className="w-full">
              <div className="relative group w-full aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                  src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
                  fill
                  className="object-cover"
                  alt={result.title || "Movie poster"}
                />

                <div className="absolute bottom-0 w-full transition-transform duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 bg-black/70 h-1/2">
                  <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-white">
                    <div className="text-center">
                      <h1 className="text-lg font-semibold line-clamp-1">
                        {result.title}
                      </h1>
                      {releaseYear && (
                        <p className="text-sm text-gray-300">{`(${releaseYear})`}</p>
                      )}
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold transition-colors rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                      View Details
                      <CaretCircleDoubleRight size={16} color="#FFFFFF" />
                    </button>
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
