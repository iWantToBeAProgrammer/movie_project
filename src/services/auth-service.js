const { createClient } = require("@/libs/supabaseServer");
const { redirect } = require("next/navigation");

async function signUpWithEmail(email, password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

async function signInWithEmail(email, password) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: "http://localhost:3000/auth/v1/callback",
    },
  });

  if (error) throw new Error(error.message);

  return { data, error };
}

async function resendEmailVerification(email) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOtp({ email });

  if (error) throw new Error(error.message);

  return data;
}

module.exports = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  resendEmailVerification,
};
