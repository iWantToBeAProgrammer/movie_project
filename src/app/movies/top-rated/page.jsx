"use client";

import { getMovieData } from "@/libs/api-libs";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/app/loading";
import CardMovieList from "@/components/MovieList/CardMovieList";
import Pagination from "@/components/Pagination";
import HeaderMovieList from "@/components/MovieList/HeaderMovieList";
import Navbar from "@/components/Navbar";
import BackNavigation from "@/components/Common/BackNavigation";

export default function MoviesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movieData, setMovieData] = useState({ results: [], total_pages: 1 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovieData(
        "top_rated",
        `&language=en-US&page=${currentPage}&region=ID`,
      );
      setMovieData(data);
    };

    fetchData();
  }, [currentPage]);

  return (
    <>
      <div className="container mx-auto max-w-(--breakpoint-xl) overflow-hidden px-4 md:px-8 xl:px-0">
        <Navbar />
        <div className="mt-8 flex flex-col md:mt-12 lg:mt-16">
          <HeaderMovieList title={"Top Rated Movies"} />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-12">
            <Suspense fallback={<Loading />}>
              <CardMovieList results={movieData.results} />
            </Suspense>
          </div>

          <Pagination
            totalPages={movieData.total_pages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
}
