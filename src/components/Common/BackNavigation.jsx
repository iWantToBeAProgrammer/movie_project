"use client"

import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const BackNavigation = () => {
  const router = useRouter();

  return (
    <>
      <div className="back-button absolute top-7 left-5 z-50">
        <button type="button" onClick={() => router.back()}>
          <CaretLeft size={36} weight="bold" />
        </button>
      </div>
    </>
  );
};

export default BackNavigation;
