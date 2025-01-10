"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import FormCard from "@/components/Auth/FormCard";
import { supabase } from "@/libs/supabase";
import { authRequest } from "@/utility/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const login = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (email, password) => {
    setError(null);
    setSuccess("");

    try {
      const response = await authRequest("signIn", { email, password });

      setSuccess(response.message);
      setUser(response.user);
      setError("");

      router.push('/')
    } catch (error) {
      setError(error.message);

      setSuccess("");
    }
  };

  console.log(success);

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center relative">
        <FormCard onSubmit={handleSubmit} error={error} success={success} />
      </div>
    </>
  );
};

export default login;
