"use client";

import { authRequest } from "@/utility/auth";
import { CaretLeft, FacebookLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import ErrorNotification from "./ErrorNotification";
import { useAuth } from "@/app/contexts/AuthContext";

export default function FormCard({
  onSubmit,
  error,
  OAuthSubmit,
  verificationEmail,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { user } = useAuth();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (popup && user) {
      popup.close();
      setPopup(null);
      window.location.href = "/"; // redirect to home or wherever
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
    <>
      <div className="form-card relative flex w-full rounded-2xl bg-[#1A1919]">
        <div className="back-button absolute top-10 left-10">
          <button type="button" onClick={() => router.push("/")}>
            <CaretLeft size={50} weight="bold" />
          </button>
        </div>

        <div className="form-card-left h-full w-1/2">{/* Left assets */}</div>
        <div className="form-card-right h-full w-1/2 py-24">
          <div className="form-right-wrapper mx-auto flex h-full w-full flex-col items-center justify-center">
            <div className="title-wrapper flex items-center gap-3">
              <h1 className="text-4xl">
                Welcome to CINEMA
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text font-raleway_italic font-black text-transparent">
                  Tix
                </span>
              </h1>
            </div>

            <div className="form-wrapper mt-8 w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 px-12"
              >
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b-2 border-white bg-transparent px-3 py-2 font-semibold focus:outline-hidden"
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-white bg-transparent px-3 py-2 font-semibold focus:outline-hidden"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`${
                    pathname === "/auth/login" && "hidden"
                  } w-full border-b-2 border-white bg-transparent px-3 py-2 font-semibold focus:outline-hidden`}
                />

                <button
                  type="submit"
                  className="form-button btn w-full border-primary font-bebas_neue text-3xl tracking-wider btn-outline btn-lg hover:border-primary hover:bg-primary hover:text-white"
                >
                  {pathname === "/auth/login" ? "Sign in" : "Sign up"}
                </button>

                <div className="divider divider-accent font-raleway_italic">
                  OR
                </div>

                <button
                  type="button"
                  className="btn w-full font-bebas_neue text-2xl tracking-wider uppercase btn-lg btn-primary"
                  onClick={handleGoogleSubmit}
                >
                  <div className="flex h-full items-center gap-2">
                    <AiFillGoogleCircle size={32} /> Sign in with google
                  </div>
                </button>

                <p className="text-center">
                  {pathname === "/auth/login"
                    ? "Don't have an account? "
                    : "Already Have an Account? "}
                  <Link
                    className="text-white uppercase underline"
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

        <div className="absolute bottom-10 w-full text-center">
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </>
  );
}
