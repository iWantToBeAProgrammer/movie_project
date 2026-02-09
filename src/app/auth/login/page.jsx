"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import ErrorNotification from "@/components/Auth/ErrorNotification";
import FormCard from "@/components/Auth/FormCard";
import { supabase } from "@/libs/supabase";
import { authRequest } from "@/utility/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineMarkEmailUnread } from "react-icons/md";

const login = () => {
  const [error, setError] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (email, password) => {
    setError(null);

    try {
      const response = await authRequest("signIn", { email, password });
      if (response.verification_status === "verification_required") {
        // Show verification modal
        setVerificationEmail(response.email);
        document.getElementById("verification-modal").showModal();
      } else {
        setUser(response.user);
        router.push("/");
      }
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

export default login;
