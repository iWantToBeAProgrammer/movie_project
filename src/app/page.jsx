import Card from "@/components/Card";
import PopularCard from "@/components/PopularCard";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PrintDesc from "@/components/Homepage/PrintDesc";
import Faq from "@/components/Homepage/Faq";
import { getMovieData } from "@/libs/api-libs";

export const revalidate = 3600;

export default async function Home() {
  const nowPlayingPromise = getMovieData(
    "now_playing",
    "language=en-US&page=1&region=ID"
  );
  const topRatedPromise = getMovieData(
    "top_rated",
    "language=en-US&page=1&region=ID"
  );
  const popularPromise = getMovieData(
    "popular",
    "language=en-US&page=1&region=ID"
  );

  const [nowPlaying, topRated, popular] = await Promise.all([
    nowPlayingPromise,
    topRatedPromise,
    popularPromise,
  ]);

  return (
    <>
      <Navbar />

      <Hero movieResults={nowPlaying.results} />

      <div className="container max-w-screen-xl mx-auto overflow-hidden">
        <div className="flex flex-col gap-20 movie-list-wrapper">
          <div className="flex flex-col now-playing">
            <Header title="Now Playing" linkHref="/movies/now-playing" />
            <Card results={nowPlaying.results} />
          </div>

          <div className="flex flex-col top-rated">
            <Header title="Top Rated" linkHref="/movies/top-rated" />
            <Card results={topRated.results} />
          </div>

          <div className="popular">
            <PopularCard results={popular.results} />
          </div>
        </div>

        <div className="print-desc mt-24 flex justify-center">
          <PrintDesc />
        </div>
        <div className="faq mt-24 flex mx-auto max-w-screen-lg">
          <Faq />
        </div>
      </div>
    </>
  );
}
