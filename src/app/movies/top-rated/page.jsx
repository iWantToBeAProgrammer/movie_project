"use client";

import { getMovieData } from "@/libs/api-libs";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/app/loading";
import CardMovieList from "@/components/MovieList/CardMovieList";
import Pagination from "@/components/Pagination";
import HeaderMovieList from "@/components/MovieList/HeaderMovieList";

export default async function TopRatedPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movieData, setMovieData] = useState({ results: [], total_pages: 1 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovieData(
        "top_rated",
        `&language=en-US&page=${currentPage}&region=ID`
      );
      setMovieData(data);
    };

    fetchData();
  }, [currentPage]);

  return (
    <div className="container max-w-screen-xl mx-auto overflow-hidden">
      <div className="flex flex-col">
        <HeaderMovieList title={"Top Rated Movies"} />
        <div className="grid grid-cols-5 gap-12">
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
  );
}
