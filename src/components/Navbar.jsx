"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { supabase } from "@/libs/supabase";
import {
  CaretDown,
  MagnifyingGlass,
  UserCircle,
  List,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchMovie from "./Common/SearchMovie";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const userImage = user?.profilePicture;

  const menuItems = [
    { label: "Popular", href: "/movies" },
    { label: "Now Playing", href: "/movies/now-playing" },
    { label: "Top Rated", href: "/movies/top-rated" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <nav className="absolute top-0 left-0 z-50 flex w-full justify-center px-4 py-2">
      <div className="navbar max-w-7xl px-6">
        {/* Mobile Menu (Drawer/Dropdown) */}
        <div className="navbar-start lg:hidden">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <List size={24} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-50 mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 text-neutral shadow"
            >
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="navbar-start hidden lg:flex">
          <Link href="/" className="transition hover:opacity-80">
            <Image
              src="/assets/images/logo/logo.svg"
              width={120}
              height={40}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Center Logo for Mobile */}
        <div className="navbar-center lg:hidden">
          <Link href="/">
            <Image
              src="/assets/images/logo/logo.svg"
              width={100}
              height={30}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Desktop Menu & Search */}
        <div className="navbar-end flex items-center gap-4">
          {/* Dropdown Movie List */}
          <div className="dropdown-hover dropdown dropdown-end hidden lg:block">
            <div
              tabIndex={0}
              role="button"
              className="flex cursor-pointer items-center gap-1 font-bebas_neue text-xl transition hover:text-primary"
            >
              Movies <CaretDown size={18} weight="bold" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu w-44 rounded-xl bg-white p-2 font-semibold text-black shadow-xl"
            >
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <SearchMovie />
          </div>

          {/* Auth Section */}
          {!user ? (
            <Link
              href="/auth/login"
              className="btn rounded-lg px-6 font-bebas_neue text-xl btn-sm btn-primary md:btn-md"
            >
              Sign In
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn avatar btn-circle btn-ghost transition hover:scale-105"
              >
                {userImage ? (
                  <div className="relative w-24 overflow-hidden rounded-full border border-white/20 md:w-11">
                    <Image
                      src={userImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                ) : (
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center justify-center rounded-full bg-accent p-1"
                  >
                    <p className="w-full h-full flex justify-center items-center">
                        <UserCircle size={42} />
                    </p>
                  </div>
                )}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu mt-2 w-44 rounded-xl bg-white p-2 font-semibold text-black shadow-xl"
              >
                <li>
                  <Link href="/profile">My Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
