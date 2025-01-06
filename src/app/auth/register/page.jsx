"use client";

import FormCard from "@/components/Auth/FormCard";
import { authRequest } from "@/utility/auth";
import { useState } from "react";

const register = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (email, password, passwordConfirmation) => {
    setError(null); // Reset error state
    setMessage(""); // Reset message state

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authRequest("signUp", { email, password });
      setMessage(
        "Registration successful! Please check your email to verify your account."
      );
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <FormCard onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default register;
