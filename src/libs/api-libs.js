export async function getMovieData(endpoint, params) {
  try {
    const response = await fetch(
      `${process.env.NEXT_APP_BASEURL}/movie/${endpoint}?api_key=${
        process.env.NEXT_APP_APIKEY
      }${params === undefined ? "" : params}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
}
