import Card from "@/components/Card";
import PopularCard from "@/components/PopularCard";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { getMovieData } from "@/libs/api-libs";
import { Suspense } from "react";
import Loading from "./loading";
import Navbar from "@/components/Navbar";

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
      <Suspense fallback={<Loading />}>
        <Navbar />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Hero movieResults={nowPlaying.results} />
      </Suspense>
      <div className="container max-w-screen-xl mx-auto overflow-hidden mt-28">
        <div className="flex flex-col gap-20 movie-list-wrapper">
          <div className="flex flex-col now-playing">
            <Suspense fallback={<Loading />}>
              <Header title={"Now Playing"} linkHref={"/movies/now-playing"} />
              <Card results={nowPlaying.results} />
            </Suspense>
          </div>
          <div className="flex flex-col top-rated">
            <Suspense fallback={<Loading />}>
              <Header title={"top rated"} linkHref={"/movies/top-rated"} />
              <Card results={topRated.results} />
            </Suspense>
          </div>
          <div className="popular">
            <Suspense fallback={<Loading />}>
              <PopularCard results={Popular.results} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
