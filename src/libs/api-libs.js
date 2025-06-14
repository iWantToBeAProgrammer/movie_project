export async function getMovieData(endpoint, params = {}) {
  try {
    // Convert params object to URLSearchParams
    const queryString = new URLSearchParams(params).toString();

    // Fetch data from the dynamic API route
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/movies/${endpoint}?${queryString}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
    }

    return await response.json(); // Return the parsed JSON
  } catch (error) {
    console.error(error);
    return { results: [] }; // Return an empty result in case of failure
  }
}
