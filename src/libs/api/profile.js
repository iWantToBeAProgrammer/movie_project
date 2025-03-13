export const fetchProfileData = async () => {
  const res = await fetch(`/api/profile`);
  if (!res.ok) throw new Error("Failed to fetch profile data");
  return res.json();
};
