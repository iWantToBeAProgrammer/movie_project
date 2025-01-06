"use client";

import FormCard from "@/components/Auth/FormCard";
import { authRequest } from "@/utility/auth";
import { useState } from "react";

const register = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (email, password, passwordConfirmation) => {
    setError(null); 
    setMessage(""); 

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authRequest("signUp", { email, password });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setMessage(result.message);
      setError("");
    } catch (err) {
      setError(error);
      setMessage("");
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <FormCard onSubmit={handleSubmit} />
        <div className="absolute bottom-10 text-center">
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default register;
