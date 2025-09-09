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
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
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
      <div className="mx-auto mt-28 w-full max-w-(--breakpoint-xl) overflow-hidden">
        <div className="mb-12 flex border-b border-slate-600 pb-1">
          <h1 className="flex border-l-8 border-primary pl-2 text-4xl tracking-wider">
            Results for: "{query}"
          </h1>
        </div>

        {data?.results?.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {data.results.map((movie) => (
                <SearchCard key={movie.id} movie={movie} />
              ))}
            </div>

            {data.total_pages > 1 && (
              <PaginationSearch
                currentPage={currentPage}
                totalPages={data.total_pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">Try different keywords</p>
          </div>
        )}
      </div>
    </>
  );
}
