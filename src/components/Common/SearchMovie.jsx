"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getSearchData } from "@/libs/movie-search";
import { MagnifyingGlass } from "@phosphor-icons/react";
import SearchMovieCard from "./SearchMovieCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchMovie() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => getSearchData(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (debouncedQuery) {
      router.push(`/search/${encodeURIComponent(debouncedQuery)}`);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* Form Search */}
      <form className="relative join" onSubmit={handleSearch}>
        <input
          className="input input-md join-item w-48 glass bg-accent/80 font-raleway text-sm font-semibold text-white transition-all duration-300 focus:outline-hidden sm:w-64 md:input-lg md:w-80 md:text-xl lg:w-96"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn join-item text-white btn-md btn-primary md:btn-lg"
        >
          <MagnifyingGlass size={20} className="md:h-6 md:w-6" />
        </button>
      </form>

      {/* Dropdown Results */}
      {debouncedQuery.length > 2 && (
        <div className="dropdown-content menu z-50 mt-2 w-full rounded-box bg-[#D9D9D9] p-0 shadow-lg">
          <div className="p-2 text-black md:p-4">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <span className="loading text-primary loading-spinner"></span>
              </div>
            ) : data?.results?.length > 0 ? (
              <>
                <SearchMovieCard results={data.results.slice(0, 4)} />
                <Link
                  href={`/search/${encodeURIComponent(debouncedQuery)}`}
                  className="btn mt-2 w-full text-xs font-bold text-black hover:text-white uppercase btn-ghost btn-sm md:text-sm"
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  View All Results
                </Link>
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm font-bold md:text-base">
                  "Sorry, we couldn’t find the movie… <br />
                  but our hearts are always here for you! ❤️🎬"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
