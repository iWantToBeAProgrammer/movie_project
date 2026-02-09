"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="mt-12 w-full bg-black pt-10 pb-8 md:mt-16 md:pb-10">
      <div className="container mx-auto max-w-(--breakpoint-xl) px-4 md:px-6 lg:px-8">
        {/* Main Content Wrapper */}
        {/* Mobile: Flex Column, Desktop: Flex Row */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          {/* Logo Section */}
          <div className="flex flex-col items-start gap-4">
            <div>
              <Link href="/">
                <Image
                  src={"/assets/images/logo.png"}
                  width={150}
                  height={150}
                  alt="CINEMATix Logo"
                  className="h-auto w-32 md:w-[150px]"
                />
              </Link>
              <p className="mt-2 text-lg text-slate-300 italic">
                &quot;Every Movie Tells Your Tale&quot;
              </p>
            </div>

            {/* --- TMDB ATTRIBUTION (WAJIB ADA) --- */}
            <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Image
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  alt="TMDB Logo"
                  width={80}
                  height={30}
                  className="h-4 w-auto"
                />
                <span className="text-[10px] font-bold text-slate-400">
                  Data Provider
                </span>
              </div>
              <p className="max-w-[250px] text-[10px] leading-tight text-slate-500">
                This product uses the TMDB API but is not endorsed or certified
                by TMDB.
              </p>
            </div>
            {/* ------------------------------------ */}
          </div>

          {/* Links Section Wrapper */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-10 lg:flex lg:flex-1 lg:justify-between">
            {/* Column 1 */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-white">Movies List</h3>
              <ul className="mt-4 space-y-3 text-sm md:space-y-4 md:text-base">
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/movies/top-rated"}>Top Rated</Link>
                </li>
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/movies/now-playing"}>Now Playing</Link>
                </li>
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/movies"}>Popular Movies</Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-white">Services</h3>
              <ul className="mt-4 space-y-3 text-sm md:space-y-4 md:text-base">
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/profile"}>Watchlist</Link>
                </li>
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/movies"}>Movie List</Link>
                </li>
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/"}>Print Features</Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-white">Pages</h3>
              <ul className="mt-4 space-y-3 text-sm md:space-y-4 md:text-base">
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/"}>Home</Link>
                </li>
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/"}>Movie List</Link>
                </li>
                <li className="text-slate-400 transition-colors hover:text-white hover:underline">
                  <Link href={"/"}>Profile</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex w-full md:mt-24">
          <div className="flex w-full flex-col-reverse items-center justify-between gap-6 border-t border-slate-600 pt-6 text-center md:flex-row md:gap-0 md:pt-4 md:text-left">
            <h3 className="text-sm text-slate-400 md:text-base">
              © 2024 CINEMATix project. All rights reserved
            </h3>

            <ul className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 md:gap-6 md:text-base">
              <li className="cursor-pointer transition-colors hover:text-white hover:underline">
                {/* Update href ini */}
                <Link href={"/terms-conditions"}>Terms & Conditions</Link>
              </li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline">
                {/* Update href ini */}
                <Link href={"/privacy-policy"}>Privacy Policy</Link>
              </li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline">
                {/* Update href ini */}
                <Link href={"/terms-of-use"}>Terms Of Use</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
