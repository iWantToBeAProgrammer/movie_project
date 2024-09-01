import Image from "next/image";
import MovieList from "./MovieList";
export default async function Home() {
  const response = await fetch(
    `${process.env.NEXT_APP_BASEURL}/movie/top_rated?api_key=${process.env.NEXT_APP_APIKEY}`
  );

  const movie = await response.json();
  const results = movie.results
  return (
    <>
      <MovieList results={results}/>
    </>
  );
}
