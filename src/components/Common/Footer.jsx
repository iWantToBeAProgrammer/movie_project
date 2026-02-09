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
          <div className="flex flex-col items-start">
            <Link href="/">
              <Image
                src={"/assets/images/logo.png"}
                width={150}
                height={150}
                alt="CINEMATix Logo"
                className="h-auto w-32 md:w-[150px]" // Resize logo dikit di mobile
              />
            </Link>
            <p className="mt-2 text-base text-gray-300 md:text-lg">
              "Every Movie Tells Your Tale"
            </p>
          </div>

          {/* Links Section Wrapper */}
          {/* Mobile: Grid 2 Kolom (biar hemat tempat), Desktop: Flex Row (layout asli) */}
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
          {/* Mobile: Stack vertical & Center text, Desktop: Space between */}
          <div className="flex w-full flex-col-reverse items-center justify-between gap-6 border-t border-slate-600 pt-6 text-center md:flex-row md:gap-0 md:pt-4 md:text-left">
            <h3 className="text-sm text-slate-400 md:text-base">
              © 2020 CINEMATix project. All rights reserved
            </h3>

            <ul className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 md:gap-6 md:text-base">
              <li className="cursor-pointer transition-colors hover:text-white hover:underline">
                <Link href={"/"}>Terms & Conditions</Link>
              </li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline">
                <Link href={"/"}>Privacy Policy</Link>
              </li>
              <li className="cursor-pointer transition-colors hover:text-white hover:underline">
                <Link href={"/"}>Terms Of Use</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;