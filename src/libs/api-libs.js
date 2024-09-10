export default async function getMovieData(resource, query) {
  
  const response = await fetch(
    `${process.env.NEXT_APP_BASEURL}/movie/${resource}?api_key=${
      process.env.NEXT_APP_APIKEY
    }${query === undefined ? "" : query}`
  );

  const movie = await response.json();

  return movie;
}
