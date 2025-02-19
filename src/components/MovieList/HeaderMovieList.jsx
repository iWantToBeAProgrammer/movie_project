"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMovieList = ({ title }) => {
  const pathname = usePathname();

  return (
    <div className="flex items-end my-8 font-bebas_neue justify-between border-b border-slate-600 pb-4">
      <div className="flex border-l-8 border-primary pl-2">
        <h1 className="text-4xl tracking-wider">{title}</h1>
      </div>
      <div className="flex gap-8 tracking-wider text-xl">
        <Link href="/movies">
          <p
            className={`${
              pathname === "/movies" ? "text-primary" : "text-white"
            } hover:text-primary transition-colors`}
          >
            Popular
          </p>
        </Link>
        <Link href="/movies/top-rated">
          <p
            className={`${
              pathname === "/movies/top-rated" ? "text-primary" : "text-white"
            } hover:text-primary transition-colors`}
          >
            Top Rated
          </p>
        </Link>
        <Link href="/movies/now-playing">
          <p
            className={`${
              pathname === "/movies/now-playing" ? "text-primary" : "text-white"
            } hover:text-primary transition-colors`}
          >
            Now Playing
          </p>
        </Link>
      </div>
    </div>
  );
};

export default HeaderMovieList;
