"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMovieList = ({ title }) => {
  const pathname = usePathname();

  return (
    <div className="mt-12 mb-6 flex flex-col justify-between gap-4 border-b border-slate-600 pb-4 font-bebas_neue md:mb-8 md:flex-row md:items-end md:gap-0">
      <div className="flex border-l-4 border-primary pl-3 md:border-l-8 md:pl-2">
        <h1 className="text-3xl leading-none tracking-wider md:text-4xl">
          {title}
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 text-base tracking-wider text-slate-400 md:gap-8 md:text-xl">
        <Link href="/movies">
          <p
            className={`${
              pathname === "/movies" ? "text-primary" : "text-white"
            } cursor-pointer transition-colors hover:text-primary`}
          >
            Popular
          </p>
        </Link>
        <Link href="/movies/top-rated">
          <p
            className={`${
              pathname === "/movies/top-rated" ? "text-primary" : "text-white"
            } cursor-pointer transition-colors hover:text-primary`}
          >
            Top Rated
          </p>
        </Link>
        <Link href="/movies/now-playing">
          <p
            className={`${
              pathname === "/movies/now-playing" ? "text-primary" : "text-white"
            } cursor-pointer transition-colors hover:text-primary`}
          >
            Now Playing
          </p>
        </Link>
      </div>
    </div>
  );
};

export default HeaderMovieList;
