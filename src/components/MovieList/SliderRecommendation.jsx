"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CustomNavigation from "../CustomNavigation";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import CardMovieList from "./CardMovieList";
import { Suspense } from "react";
import Loading from "@/app/loading";

const SliderRecommendation = ({ results = [] }) => {
  if (!results || results.length === 0) {
    return <p>No data available</p>;
  }

  const router = useRouter();

  return (
    <div className="w-full">
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
        <CustomNavigation />

        {results.map((result) => (
          <SwiperSlide key={result.id} className="w-full">
            <Suspense fallback={<Loading />}>
              <CardMovieList results={[result]} />
            </Suspense>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderRecommendation;
