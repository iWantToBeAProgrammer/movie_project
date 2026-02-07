"use client";

import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BackNavigation = ({ fallback = "/" }) => {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <>
      <button
        tabIndex={0}
        role="button"
        onClick={handleBack}
        className="back-button absolute top-5 left-5 z-50 cursor-pointer"
      >
        <CaretLeft size={36} weight="bold" />
      </button>
    </>
  );
};

export default BackNavigation;
