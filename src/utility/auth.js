export const authRequest = async (action, body = {}) => {
  try {
    const response = await fetch("/api/auth/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);

    return result;
  } catch (error) {
    throw error;
  }
};
