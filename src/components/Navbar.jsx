"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/libs/supabase";
import { CaretDown } from "@phosphor-icons/react";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
        className={`navbar h-16 2xl:h-20  text-xl 2xl:text-3xl absolute top-0 left-0 text-neutral z-50 flex justify-center`}
      >
        <div className="navbar-wrapper flex items-center justify-between max-w-screen-xl w-full">
          <Link href="/">
            <Image
              src={"/assets/images/logo/logo.svg"}
              width={150}
              height={150}
            />
          </Link>
          <div className="navbar-item  flex gap-8 items-center text-xl 2xl:text-3xl">
            <div className="dropdown dropdown-end dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 font-bebas_neue"
              >
                Movie List{" "}
                <CaretDown className="text-primary" size={28} weight="bold" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-xl z-[1] w-44 p-2 shadow text-raleway text-[#333333] font-semibold"
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
              <button
                onClick={() => router.push("/auth/login")}
                className="font-bebas_neue bg-gradient-to-t from-primary to-secondary hover:from-primary/50 hover:to-primary/50 hover:border-2 hover:border-primary px-6 btn  py-2 xl:py-1 rounded-xl text-3xl"
                type="button"
              >
                sign in
              </button>
            ) : (
              <div className="dropdown dropdown-end dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 font-bebas_neue"
                >
                  <button type="button" onClick={() => router.push("/profile")}>
                    <UserCircle size={50} />
                  </button>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-white rounded-xl z-[1] w-44 p-2 shadow text-raleway text-[#333333] font-semibold"
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
