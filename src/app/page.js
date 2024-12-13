import ClientSideComponent from "@/components/ClientSideComponent";
import MovieList from "../components/MovieList";
import Hero from "@/components/Hero";
import MovieList from "@/components/MovieList";
// import Header from "@/components/MovieList/Header";
// import PopularList from "@/components/PopularList";
import getMovieData from "@/libs/api-libs";

export default async function Home() {
  const nowPlaying = await getMovieData(
    "now_playing",
    "&language=en-US&page=1&region=ID"
  );



  const topRated = await getMovieData(
    "top_rated",
    "&language=en-US&page=1&region=ID"
  );
  const Popular = await getMovieData(
    "popular",
    "&language=en-US&page=1&region=ID"
  );

  return (
    <>
      <div className="flex font-raleway">
        {/* <MovieList results={results} /> */}
      </div>
    </>
  );
}