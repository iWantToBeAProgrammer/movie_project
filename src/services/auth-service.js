const { supabase } = require("@/libs/supabase");

async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw new Error(error.message);
  return data;
}

module.exports = {
  signUpWithEmail,
  signInWithEmail,
  signInWithOAuth,
};
