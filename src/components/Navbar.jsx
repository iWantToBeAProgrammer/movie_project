"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/libs/supabase";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, setUser } = useAuth();

  console.log(user);

  const handleLogout = async (e) => {
    e.preventDefault();

    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <>
      <div
        className={`navbar h-16 2xl:h-20  text-xl 2xl:text-3xl ${
          pathname === "/" ? "absolute" : "relative"
        } top-0 text-neutral z-50 flex justify-center ${
          pathname.startsWith("/auth") && "hidden"
        }`}
      >
        <div className="navbar-wrapper flex items-center justify-between max-w-screen-xl w-full">
          <Link href="/">
            <Image
              src={"/assets/images/logo/logo.svg"}
              width={150}
              height={150}
            />
          </Link>
          <div className="navbar-item font-bebas_neue flex gap-8 items-center text-xl 2xl:text-3xl">
            <Link href="/movies">
              <h1>MOVIE LIST</h1>
            </Link>
            <Link href="/watchlist">
              <h1>WATCHLIST</h1>
            </Link>
            {!user ? (
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-gradient-to-t from-primary to-secondary hover:from-primary/50 hover:to-primary/50 hover:border-2 hover:border-primary px-6 btn  py-2 xl:py-1 rounded-xl text-3xl"
                type="button"
              >
                sign in
              </button>
            ) : (
              <button type="button" onClick={handleLogout}>
                <UserCircle size={50} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
