"use client";

import { CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const Header = ({ title, linkHref }) => {
  return (
    <>
      {title !== "popular viewed movies" ? (
        <Link
          href={linkHref}
          className={`flex items-center mb-4 text-2xl font-bebas_neue max-w-40 group ${
            title !== "popular viewed movies" && "cursor-pointer"
          }`}
        >
          <h1 className="w-40 font-bebas_neue">{title}</h1>
          <div className="transform -translate-x-32 relative -z-10 opacity-0 group-hover:z-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-in-out">
            <CaretRight className="text-secondary" weight="bold" size={30} />
          </div>
        </Link>
      ) : (
        <h1 className="w-36 text-2xl font-bebas_neue text-balance">{title}</h1>
      )}
    </>
  );
};

export default Header;
