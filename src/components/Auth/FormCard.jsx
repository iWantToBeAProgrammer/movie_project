"use client";

import { authRequest } from "@/utility/auth";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useAuth } from "@/app/contexts/AuthContext";
import Image from "next/image";

export default function FormCard({ onSubmit, error, isLoading }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/auth/login"; // Helper variable

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { user } = useAuth();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (popup && user) {
      popup.close();
      setPopup(null);
      window.location.href = "/";
    }
  }, [popup, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email, password, passwordConfirmation);
    }
  };

  const handleGoogleSubmit = async () => {
    const response = await authRequest("google");
    const newPopup = popupCenter(response.url, "Google Sign in");
    setPopup(newPopup);
  };

  const popupCenter = (url, title) => {
    const width = 500;
    const height = 550;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    return window.open(
      url,
      title,
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  return (
    <div className="relative flex w-full overflow-hidden rounded-2xl bg-[#1A1919]/90 shadow-2xl backdrop-blur-md md:flex-row">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 z-20 text-white/50 transition-colors hover:text-white md:top-6 md:left-6"
      >
        <CaretLeft size={32} weight="bold" />
      </button>

      <div className="relative hidden w-1/2 md:block">
        <Image
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop"
          alt="Cinema Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

        <div className="absolute bottom-10 left-10 p-4">
          <h2 className="font-bebas_neue text-5xl tracking-widest text-white drop-shadow-lg">
            WATCH
            <br />
            ANYWHERE.
          </h2>
        </div>
      </div>

      <div className="w-full bg-[#121212] p-8 md:w-1/2 md:p-12 lg:p-16">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              {isLogin ? "Welcome Back!" : "Join the Club"}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              to CINEMA
              <span className="ml-1 bg-linear-to-r from-primary to-secondary bg-clip-text font-raleway_italic font-black text-transparent">
                Tix
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div className="group relative">
              <input
                type="text"
                placeholder=" "
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full border-b-2 border-gray-600 bg-transparent py-2.5 text-white outline-hidden transition-colors focus:border-primary"
                required
              />
              <label className="absolute top-2.5 left-0 cursor-text text-gray-500 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400">
                Email Address
              </label>
            </div>

            <div className="group relative">
              <input
                type="password"
                placeholder=" "
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full border-b-2 border-gray-600 bg-transparent py-2.5 text-white outline-hidden transition-colors focus:border-primary"
                required
              />
              <label className="absolute top-2.5 left-0 cursor-text text-gray-500 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400">
                Password
              </label>
            </div>

            {!isLogin && (
              <div className="group relative">
                <input
                  type="password"
                  placeholder=" "
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="peer w-full border-b-2 border-gray-600 bg-transparent py-2.5 text-white outline-hidden transition-colors focus:border-primary"
                  required
                />
                <label className="absolute top-2.5 left-0 cursor-text text-gray-500 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400">
                  Confirm Password
                </label>
              </div>
            )}

            {error && (
              <div className="rounded border border-red-500/20 bg-red-500/10 p-2 text-center text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-3 font-bebas_neue text-xl tracking-widest text-white transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-sm loading-spinner"></span>
                  <span>Processing...</span>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-gray-700"></div>
              <span className="mx-4 shrink font-raleway_italic text-sm text-gray-500">
                OR
              </span>
              <div className="grow border-t border-gray-700"></div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-600 py-3 transition-colors hover:bg-white/5"
              onClick={handleGoogleSubmit}
            >
              <AiFillGoogleCircle size={24} className="text-white" />
              <span className="font-semibold text-white">
                Continue with Google
              </span>
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                href={isLogin ? "/auth/register" : "/auth/login"}
                className="font-bold text-primary hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
