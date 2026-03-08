"use client";

import { getDiscoverMovies } from "@/libs/api-libs";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/app/loading";
import CardMovieList from "@/components/MovieList/CardMovieList";
import Pagination from "@/components/Pagination";
import HeaderMovieList from "@/components/MovieList/HeaderMovieList";
import Navbar from "@/components/Navbar";
import AdvancedFilter from "@/components/MovieList/AdvancedFilter";

export default function MoviesPage() {
  const [movieData, setMovieData] = useState({ results: [], total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    with_genres: [],
    primary_release_year: "",
    "vote_average.gte": "",
    page: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = {
        page: filters.page,
        language: "en-US",
        region: "ID",
        sort_by: "popularity.desc",
      };

      if (filters.with_genres.length > 0) {
        params.with_genres = filters.with_genres.join(",");
      }
      if (filters.primary_release_year) {
        params.primary_release_year = filters.primary_release_year;
      }
      if (filters["vote_average.gte"]) {
        params["vote_average.gte"] = filters["vote_average.gte"];
      }

      const data = await getDiscoverMovies(params);
      setMovieData(data);
      setLoading(false);
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = 
    filters.with_genres.length > 0 || 
    filters.primary_release_year || 
    filters["vote_average.gte"];

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-(--breakpoint-xl) overflow-hidden px-4 pb-20 pt-28 md:px-8 xl:px-0">
        <div className="flex flex-col">
          <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></div>
              <h1 className="font-bebas_neue text-4xl tracking-wider text-white md:text-5xl lg:text-6xl uppercase">
                {hasActiveFilters ? "Filtered Movies" : "Popular Viewed Movies"}
              </h1>
            </div>
            {movieData.total_results && (
              <p className="font-sans_caption text-sm text-white/40 mb-1">
                Found <span className="text-white font-bold">{movieData.total_results.toLocaleString()}</span> movies
              </p>
            )}
          </header>

          <AdvancedFilter 
            onFilterChange={handleFilterChange} 
            currentFilters={filters} 
          />

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loading />
            </div>
          ) : movieData.results?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
                <CardMovieList results={movieData.results} />
              </div>

              <Pagination
                totalPages={Math.min(movieData.total_pages, 500)} // TMDB limit
                onPageChange={handlePageChange}
                currentPage={filters.page}
              />
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] p-12 text-center">
              <p className="text-xl font-bold text-white mb-2">No movies found</p>
              <p className="text-white/40">Try adjusting your filters to find what you&apos;re looking for.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
