import Card from "@/components/Card";
import PopularCard from "@/components/PopularCard";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { getMovieData } from "@/libs/api-libs";

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
      <div className="container max-w-screen-xl mx-auto overflow-hidden mt-28">
        <div className="flex flex-col gap-20 movie-list-wrapper">
          <div className="flex flex-col now-playing">
            <Header title={"Now Playing"} linkHref={"/now_playing"} />
            <Card results={nowPlaying.results} />
          </div>
          <div className="flex flex-col top-rated">
            <Header title={"top rated"} linkHref={"/top_rated"} />
            <Card results={topRated.results} />
          </div>
          <div className="popular">
            <Header title={"popular viewed movies"} linkHref={"/popular"} />
            <PopularCard results={Popular.results} />
          </div>
        </div>
      </div>
    </>
  );
}
