export async function getUserSearchData(query, page = 1) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/user-search?query=${encodeURIComponent(query)}&page=${page}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [], total_pages: 1, total_results: 0 };
  }
}
