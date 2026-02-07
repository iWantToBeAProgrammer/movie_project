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
    "language=en-US&page=1&region=ID",
  );
  const topRatedPromise = getMovieData(
    "top_rated",
    "language=en-US&page=1&region=ID",
  );
  const popularPromise = getMovieData(
    "popular",
    "language=en-US&page=1&region=ID",
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

      <div className="container mx-auto max-w-(--breakpoint-xl) overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="movie-list-wrapper flex flex-col gap-10 md:gap-16 lg:gap-20">
          <div className="now-playing flex flex-col gap-4">
            <Header title="Now Playing" linkHref="/movies/now-playing" />
            <Card results={nowPlaying.results} />
          </div>

          <div className="top-rated flex flex-col gap-4">
            <Header title="Top Rated" linkHref="/movies/top-rated" />
            <Card results={topRated.results} />
          </div>

          <div className="popular">
            <PopularCard results={popular.results} />
          </div>
        </div>

        <div className="print-desc mt-12 flex justify-center md:mt-24">
          <PrintDesc />
        </div>

        <div className="faq mx-auto mt-12 flex max-w-(--breakpoint-lg) md:mt-24">
          <Faq />
        </div>
      </div>
    </>
  );
}
