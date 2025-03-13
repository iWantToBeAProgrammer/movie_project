"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <div className="w-full bg-black pt-10 ">
      <div className="container max-w-screen-xl mx-auto">
        <div className="flex gap-20">
          <div className="flex flex-col">
            <Link href="/">
              <Image src={"/assets/images/logo.png"} width={150} height={150} />
            </Link>
            <p className="mt-2 text-lg">"Every Movie Tells Your Tale"</p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Movies List</h3>
            <ul className="space-y-4 mt-4">
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/movies/top-rated"}>Top Rated</Link>
              </li>
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/movies/now-playing"}>Now Playing</Link>
              </li>
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/movies"}>Popular Movies</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-4 mt-4">
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/profile"}>Watchlist</Link>
              </li>
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/movies"}>Movie List</Link>
              </li>
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/"}>Print Features</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Pages</h3>
            <ul className="space-y-4 mt-4">
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/"}>Home</Link>
              </li>
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/"}>Movie List</Link>
              </li>
              <li className="text-slate-600 hover:text-white hover:underline">
                <Link href={"/"}>Profile</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex mt-24">
          <div className="flex justify-between w-full pt-4 border-t border-slate-600">
            <h3>© 2020 CINEMATix project.All right reserved</h3>
            <ul className="flex gap-4">
              <li className=" hover:underline">
                <Link href={"/"}>Terms & Conditions</Link>
              </li>
              <li className=" hover:underline">
                <Link href={"/"}>Privacy Policy</Link>
              </li>
              <li className="hover:underline">
                <Link href={"/"}>Terms Of Use</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;