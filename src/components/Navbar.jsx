"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/libs/supabase";
import { CaretDown } from "@phosphor-icons/react";
import { MagnifyingGlass, UserCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchMovie from "./Common/SearchMovie";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, setUser } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();

    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <>
      <div
        className={`absolute top-2 left-0 z-50 navbar flex h-16 justify-center text-xl text-neutral 2xl:h-20 2xl:text-3xl`}
      >
        <div className="navbar-wrapper flex w-full max-w-(--breakpoint-xl) items-center justify-between">
          <Link href="/">
            <Image
              src={"/assets/images/logo/logo.svg"}
              width={150}
              height={150}
            />
          </Link>
          <div className="navbar-item flex items-center gap-12 text-xl 2xl:text-3xl">
            <SearchMovie />

            <div className="dropdown-hover group dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 font-bebas_neue"
              >
                Movie List{" "}
                <CaretDown
                  className="transform text-primary transition-transform duration-500 group-hover:-rotate-180"
                  size={28}
                  weight="bold"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content text-raleway menu z-1 w-44 rounded-xl bg-white p-2 font-semibold text-[#333333] shadow-sm"
              >
                <li>
                  <Link href={"/movies"}>Popular Movies</Link>
                </li>
                <li>
                  <Link href={"/movies/now-playing"}>Now Playing</Link>
                </li>
                <li>
                  <Link href={"/movies/top-rated"}>Top Rated</Link>
                </li>
              </ul>
            </div>
            {!user ? (
              <Link
                href={"/auth/login"}
                className="btn rounded-xl bg-linear-to-t from-primary to-secondary px-6 py-2 font-bebas_neue text-3xl btn-lg hover:border-2 hover:border-primary hover:from-primary/50 hover:to-primary/50 xl:py-1"
                role="button"
                tabIndex={0}
              >
                sign in
              </Link>
            ) : (
              <div className="dropdown-hover dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 font-bebas_neue"
                >
                  <UserCircle size={50} />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content text-raleway menu z-1 w-44 rounded-xl bg-white p-2 font-semibold text-[#333333] shadow-sm"
                >
                  <li>
                    <Link href={"/profile"}>My Profile</Link>
                  </li>
                  <li>
                    <button type="button" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
