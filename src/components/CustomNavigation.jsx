"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { useSwiper } from "swiper/react";

const CustomNavigation = ({ isHovered }) => {
  const swiper = useSwiper();
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  useEffect(() => {
    const updateNavigationButtons = () => {
      const isFirst = swiper.isBeginning;
      const isLast = swiper.isEnd;
      setIsFirstSlide(isFirst);
      setIsLastSlide(isLast);
    };

    swiper.on("slideChange", updateNavigationButtons);

    updateNavigationButtons();

    return () => {
      swiper.off("slideChange", updateNavigationButtons);
    };
  }, [swiper]);

  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        className={`rounded-tl-lg rounded-bl-lg absolute top-0 left-0 z-10 items-center justify-center h-full transition-opacity bg-black w-14 opacity-70 hover:opacity-90 ${
          isFirstSlide || !isHovered ? "hidden" : ""
        }`}
        aria-label="Previous slide"
      >
        <CaretLeft size={50} className="text-secondary" weight="bold" />
      </button>

      <button
        onClick={() => swiper.slideNext()}
        className={`rounded-tr-lg rounded-br-lg absolute top-0 right-0 z-10 items-center justify-center h-full transition-opacity bg-black w-14 opacity-70 hover:opacity-90 ${
          isLastSlide || !isHovered ? "hidden" : ""
        }`}
        aria-label="Next slide"
      >
        <CaretRight size={50} className="text-secondary" weight="bold" />
      </button>
    </>
  );
};

export default CustomNavigation;
