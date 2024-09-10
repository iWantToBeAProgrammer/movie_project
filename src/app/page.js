import ClientSideComponent from "@/components/ClientSideComponent";
import MovieList from "../components/MovieList";
import Hero from "@/components/Hero";
import getMovieData from "@/libs/api-libs";

export default async function Home() {
  const movie = await getMovieData(
    "now_playing",
    "&language=en-US&page=1&region=ID"
  );


  return (
    <>
      <div className="flex font-raleway">
        {/* <MovieList results={results} /> */}
      </div>
      <Hero movieResults={movie.results}/>
    </>
  );
}
