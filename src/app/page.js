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
      <Hero movieResults={nowPlaying.results} />
      <div className="container max-w-screen-xl mx-auto overflow-hidden">
        <div className="flex flex-col movie-list-wrapper gap-7">
          <div className="flex now-playing">
            {/* <Header title={"now playing"} linkHref={"/now_playing"} /> */}
            <MovieList results={nowPlaying.results} />
          </div>
          <div className="flex top-rated">
            {/* <Header title={"top rated"} linkHref={"/top_rated"} /> */}
            <MovieList results={topRated.results} />
          </div>
          <div className="popular">
            {/* <Header title={"popular viewed movies"} linkHref={"/popular"} /> */}
            {/* <PopularList results={Popular.results} /> */}
          </div>
        </div>
      </div>
    </>
  );
}