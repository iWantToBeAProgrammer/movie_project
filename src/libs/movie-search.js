export async function getSearchData(params = {}) {
  try {
    const queryString = params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/search?query=${queryString}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return await response.json(); // Return the parsed JSON
  } catch (error) {
    console.error(error);
    return { results: [] }; // Return an empty result in case of failure
  }
}
