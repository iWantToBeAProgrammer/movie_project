"use client";

import ErrorNotification from "@/components/Auth/ErrorNotification";
import FormCard from "@/components/Auth/FormCard";
import { authRequest } from "@/utility/auth";
import { useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";

const Register = () => {
  const [error, setError] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 1. Tambah State Loading

  const handleSubmit = async (email, password, passwordConfirmation) => {
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authRequest("signUp", { email, password });

      setVerificationEmail(response.user?.email);
      document.getElementById("verification-modal").showModal();

      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')",
        }}
      ></div>

      <div className="fixed inset-0 z-0 bg-black/60 backdrop-blur-[3px]"></div>

      <div className="z-10 w-full max-w-5xl px-4 md:px-0">
        <FormCard
          onSubmit={handleSubmit}
          error={error}
          verificationEmail={verificationEmail}
          isLoading={isLoading}
        />
      </div>

      <dialog className="modal" id="verification-modal">
        <ErrorNotification
          verificationEmail={verificationEmail}
          title={"Email Verification"}
          icon={<MdOutlineMarkEmailUnread size={104} />}
          desc={`We have sent an email to ${verificationEmail} to confirm its validity. Please check your email and click the link to complete your registration.`}
        />
      </dialog>
    </div>
  );
};

export default Register;
