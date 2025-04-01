"use client";

import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const BackNavigation = () => {
  const router = useRouter();

  return (
    <>
      <button
        tabIndex={0}
        role="button"
        onClick={() => router.back()}
        className="back-button absolute top-7 left-5 z-50 cursor-pointer"
      >
        <CaretLeft size={36} weight="bold" />
      </button>
    </>
  );
};

export default BackNavigation;
