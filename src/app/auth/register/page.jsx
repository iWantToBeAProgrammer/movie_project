"use client";

import FormCard from "@/components/Auth/FormCard";
import { authRequest } from "@/utility/auth";
import { useState } from "react";

const register = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (email, password, passwordConfirmation) => {
    setError(null);
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authRequest("signUp", { email, password });
      setSuccess(response.message);
      setError("");
    } catch (error) {
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center relative">
        <FormCard onSubmit={handleSubmit} error={error} success={success} />
      </div>
    </>
  );
};

export default register;
