"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchCard from "@/components/Search/SearchCard";
import { getSearchData } from "@/libs/movie-search";
import { useQuery } from "@tanstack/react-query";
import PaginationSearch from "@/components/Search/PaginationSearch";
import Loading from "@/app/loading";

export default function SearchResultsPage({ params }) {
  const query = decodeURIComponent(params.query);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["search", query, currentPage],
    queryFn: () => getSearchData(query, currentPage),
    placeholderData: (previousData) => previousData, // Smooth transition between pages
    staleTime: 1000 * 60 * 10, // Keep data fresh for 10 minutes
    gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-base-100 pb-20 pt-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></div>
              <h1 className="font-bebas_neue text-4xl tracking-wider text-white md:text-5xl lg:text-6xl">
                Results for: <span className="text-primary italic">&quot;{query}&quot;</span>
              </h1>
            </div>
          </header>

          {data?.results?.length > 0 ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4">
                {data.results.map((movie) => (
                  <SearchCard key={movie.id} movie={movie} />
                ))}
              </div>

              {data.total_pages > 1 && (
                <div className="mt-12">
                  <PaginationSearch
                    currentPage={currentPage}
                    totalPages={data.total_pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02] p-12 text-center">
              <div className="mb-4 rounded-full bg-white/5 p-6">
                <svg className="h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
              <p className="text-white/40 max-w-md">
                We couldn&apos;t find any movies matching &quot;{query}&quot;. Try different keywords or check for typos.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
