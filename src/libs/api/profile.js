

export const fetchProfileData = async () => {
  const res = await fetch(`/api/profile`);
  if (!res.ok) throw new Error("Failed to fetch profile data");
  return res.json();
};

export const updateProfileData = async ({ username, profilePicture }) => {
  const formData = new FormData();
  formData.append("username", username);
  if (profilePicture instanceof File) {
    formData.append("profilePicture", profilePicture);
  }

  const res = await fetch("/api/profile", {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  return res.json();
};

