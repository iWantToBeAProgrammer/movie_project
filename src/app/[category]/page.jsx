"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getMovieData } from "@/libs/api-libs";
import CardMovieList from "@/components/MovieList/CardMovieList";
import Pagination from "@/components/Pagination";

export default function CategoryPage({ params }) {
  const { category } = params;
  const [currentPage, setCurrentPage] = useState(1);
  const [movieData, setMovieData] = useState({ results: [], total_pages: 1 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovieData(
        category,
        `&language=en-US&page=${currentPage}&region=ID`
      );
      setMovieData(data);
    };

    fetchData();
  }, [category, currentPage]);

  return (
    <div className="container max-w-screen-xl mx-auto overflow-hidden">
      <div className="flex flex-col gap-20 movie-list-wrapper">
        <div className="flex flex-col">
          <Header
            title={
              category === "now_playing"
                ? "Now Playing"
                : category === "top_rated"
                ? "Top Rated"
                : "Popular Viewed Movies"
            }
          />
          <div className="grid grid-cols-5 gap-12">
            <CardMovieList results={movieData.results} />
          </div>

          {/* Pagination */}
          <Pagination
            totalPages={movieData.total_pages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}
