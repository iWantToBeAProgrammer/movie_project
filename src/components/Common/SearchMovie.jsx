"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getSearchData } from "@/libs/movie-search";
import { MagnifyingGlass } from "@phosphor-icons/react";
import SearchMovieCard from "./SearchMovieCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchMovie() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400); // 400ms is a sweet spot
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => getSearchData(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (debouncedQuery) {
      router.push(`/search/${encodeURIComponent(debouncedQuery)}`);
    }
  };

  // Optimization: Prefetch full search page data when hovering "View All"
  const prefetchSearchResults = () => {
    queryClient.prefetchQuery({
      queryKey: ["search", debouncedQuery, 1], // Match the SearchResultsPage query key
      queryFn: () => getSearchData(debouncedQuery, 1),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    // Class w-full penting agar di mobile dia memenuhi container drawer
    <div className="dropdown dropdown-end dropdown-bottom w-full group/search">
      {/* Form Search */}
      <form className="relative flex w-full" onSubmit={handleSearch}>
        <div className="relative w-full">
          <input
            className="input-bordered input input-sm w-full bg-white/5 text-white placeholder-white/40 backdrop-blur-md transition-all duration-300 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50 border-white/10 sm:w-64 md:input-md md:w-72 lg:w-80 pr-10"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-primary transition-colors flex items-center justify-center"
          >
            <MagnifyingGlass size={20} />
          </button>
        </div>
      </form>

      {/* Dropdown Results */}
      {debouncedQuery.length > 2 && (
        <div
          tabIndex={0}
          className="dropdown-content z-50 mt-3 w-full rounded-2xl border border-white/10 bg-neutral-900/95 p-0 shadow-2xl backdrop-blur-xl md:w-[450px]"
        >
          <div className="flex flex-col max-h-[75vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                Top Results for &quot;{debouncedQuery}&quot;
              </span>
              {isLoading && (
                <span className="loading loading-spinner loading-xs text-primary"></span>
              )}
            </div>

            <div className="custom-scrollbar overflow-y-auto p-2">
              {!isLoading && data?.results?.length > 0 ? (
                <>
                  <SearchMovieCard results={data.results.slice(0, 6)} />
                  <div className="mt-2 p-2">
                    <Link
                      href={`/search/${encodeURIComponent(debouncedQuery)}`}
                      onMouseEnter={prefetchSearchResults}
                      className="btn btn-primary btn-sm w-full font-bebas_neue lg:text-lg text-xs tracking-wider"
                      onClick={() => {
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                    >
                      View All Results ({data.total_results || 0})
                    </Link>
                  </div>
                </>
              ) : !isLoading && (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="mb-3 rounded-full bg-white/5 p-4">
                    <MagnifyingGlass size={32} className="text-white/20" />
                  </div>
                  <p className="text-sm font-medium text-white/60">
                    We couldn&apos;t find any movies for &quot;{debouncedQuery}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
