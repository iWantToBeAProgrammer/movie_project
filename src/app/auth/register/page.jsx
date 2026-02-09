"use client";

import ErrorNotification from "@/components/Auth/ErrorNotification";
import FormCard from "@/components/Auth/FormCard";
import { authRequest } from "@/utility/auth";
import { useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";

const register = () => {
  const [error, setError] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState("");

  const handleSubmit = async (email, password, passwordConfirmation) => {
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authRequest("signUp", { email, password });
      setVerificationEmail(response.user?.email);
      document.getElementById("verification-modal").showModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="relative flex h-screen w-full items-center justify-center">
        <FormCard
          onSubmit={handleSubmit}
          error={error}
          verificationEmail={verificationEmail}
        />

        <dialog className="modal" id="verification-modal">
          <ErrorNotification
            verificationEmail={verificationEmail}
            title={"Email Verification"}
            icon={<MdOutlineMarkEmailUnread size={104} />}
            desc={`We have sent an email to ${verificationEmail} to confirm its validity. Please check your email and click the link to complete your registration.`}
          />
        </dialog>
      </div>
    </>
  );
};

export default register;
