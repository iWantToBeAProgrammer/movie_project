"use client";

import { authRequest } from "@/utility/auth";
import { CaretLeft, FacebookLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";

export default function FormCard({ onSubmit, error, success, OAuthSubmit }) {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(email, password, passwordConfirmation);
  };

  return (
    <>
      <div className="form-card w-full flex rounded-2xl bg-[#1A1919] relative">
        <div className="back-button absolute top-10 left-10">
          <button type="button" onClick={() => router.push("/")}>
            <CaretLeft size={50} weight="bold" />
          </button>
        </div>

        <div className="form-card-left w-1/2 h-full">{/* Left assets */}</div>
        <div className="form-card-right w-1/2 h-full py-24">
          <div className="form-right-wrapper mx-auto w-full h-full justify-center items-center flex flex-col">
            <div className="title-wrapper flex gap-3 items-center">
              <h1 className="text-4xl">
                Welcome to CINEMA
                <span className="font-raleway_italic bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-black">
                  Tix
                </span>
              </h1>
            </div>

            <div className="form-wrapper w-full mt-8">
              <form
                onSubmit={handleSubmit}
                className="form-control gap-6 px-12"
              >
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b-2 bg-transparent border-white px-3 w-full font-semibold py-2 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-b-2 bg-transparent border-white px-3 w-full font-semibold py-2 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`${
                    pathname === "/auth/login" && "hidden"
                  } border-b-2 bg-transparent border-white px-3 w-full font-semibold py-2 focus:outline-none`}
                />

                <button
                  type="submit"
                  className="form-button btn btn-outline font-bebas_neue text-3xl border-primary hover:text-white hover:bg-primary hover:border-primary tracking-wider"
                >
                  {pathname === "/auth/login" ? "Sign in" : "Sign up"}
                </button>

                <div className="divider divider-accent font-raleway_italic">
                  OR
                </div>

                <button type="button" className="btn btn-primary font-bebas_neue text-2xl tracking-wider uppercase" onClick={() => OAuthSubmit("google")}>
                  <div className="flex items-center gap-2  h-full">
                    <AiFillGoogleCircle size={32} /> Sign in with google
                  </div>
                </button>

                <p className="text-center">
                  {pathname === "/auth/login"
                    ? "Don't have an account? "
                    : "Already Have an Account? "}
                  <Link
                    className="uppercase underline text-white"
                    href={
                      pathname === "/auth/login"
                        ? "/auth/register"
                        : "/auth/login"
                    }
                  >
                    {pathname === "/auth/login" ? "Sign Up" : "Sign in"}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 text-center w-full">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </div>
    </>
  );
}
