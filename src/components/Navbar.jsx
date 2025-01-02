"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className={`navbar h-16 2xl:h-20 [text-shadow:_4px_5px_10px_rgba(0,0,0,0.67)] text-xl 2xl:text-3xl ${pathname === '/' ? "absolute" : "relative"} top-0 text-neutral z-20 flex justify-center`}>
        <div className="navbar-wrapper flex items-center justify-between max-w-screen-xl w-full">
          <div className="bg-accent px-3 py-1 rounded-xl">
            <h1 className="font-bebas_neue text-neutral">
              Cinema
              <span className="font-black text-transparent font-raleway_italic bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Tix
              </span>
            </h1>
          </div>
          <div className="navbar-item font-bebas_neue flex gap-8 items-center text-xl 2xl:text-3xl">
            <Link href="/movie-list">
              <h1>MOVIE LIST</h1>
            </Link>
            <Link href="/watchlist">
              <h1>WATCHLIST</h1>
            </Link>
            <Link href="/login">
              <button className="bg-neutral bg-opacity-30 px-4 py-2 xl:py-1 box-border rounded-xl">
                sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
