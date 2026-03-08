export async function getMovieData(endpoint, params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/movies/${endpoint}?${queryString}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
}

export async function getDiscoverMovies(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/discover?${queryString}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch discover: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { results: [], total_pages: 0 };
  }
}

export async function getGenres() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/genres`);
    if (!response.ok) throw new Error("Failed to fetch genres");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { genres: [] };
  }
}

export async function getWatchProviders(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/movies/watch-providers/${id}`);
    if (!response.ok) throw new Error("Failed to fetch watch providers");
    const data = await response.json();
    return data.results?.ID || null; // Prioritize Indonesia
  } catch (error) {
    console.error(error);
    return null;
  }
}
