"use client";

import { CaretLeft, FacebookLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoMailUnreadOutline } from "react-icons/io5";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useState } from "react";
import { supabase } from "@/libs/supabase";
import { authRequest } from "@/utility/auth";

export default function FormCard({}) {
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) {
      setError("No registered email found.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: registeredEmail,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Verification email has been resent!");
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setRegisteredEmail(formData.email);
    }

    setLoading(false);
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
          <div className="form-right-wrapper mx-auto w-full h-full flex flex-col justify-center items-center">
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
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-b-2 bg-transparent border-white px-3 w-full font-semibold py-2 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-b-2 bg-transparent border-white px-3 w-full font-semibold py-2 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Confirm Password"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  className={`${
                    pathname === "/auth/login" && "hidden"
                  } border-b-2 bg-transparent border-white px-3 w-full font-semibold py-2 focus:outline-none`}
                  required
                />


                <button
                  type="submit"
                  className="form-button btn btn-outline font-bebas_neue text-3xl border-primary hover:text-white hover:bg-primary hover:border-primary tracking-wider"
                  disabled={loading}
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

        {error && (
          <div className="absolute bottom-10 text-center w-full">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>

      {success && (
        <dialog
          id="success_modal"
          className="modal bg-black bg-opacity-75"
          open
        >
          <div className="modal-box border-2 border-primary">
            <div>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
            <div className="flex flex-col items-center">
              <IoMailUnreadOutline size={100} />
              <h3 className="font-bold text-2xl text-primary">
                EMAIL VERIFICATION
              </h3>
              <p className="py-4 my-2 text-center">
                We have sent an email to{" "}
                <a
                  href={`mailto:${registeredEmail}`}
                  className="text-blue-500 underline"
                >
                  {registeredEmail}
                </a>{" "}
                to confirm its validity. Please check your email and click the
                link to complete your registration.
              </p>
            </div>
            <div>
              <p className="py-2 text-xs text-center border-t border-t-slate-200 border-opacity-50">
                Didn't get an email?
                <a
                  onClick={handleResendVerification}
                  className="text-blue-500 underline ml-1 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Resending..." : "Resend verification mail"}
                </a>{" "}
              </p>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
