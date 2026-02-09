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
    // Class w-full penting agar di mobile dia memenuhi container drawer
    <div className="dropdown dropdown-end dropdown-bottom w-full">
      {/* Form Search */}
      <form className="relative join w-full" onSubmit={handleSearch}>
        <input
          // PERBAIKAN RESPONSIVE:
          // 1. w-full di mobile (biar ngisi drawer)
          // 2. sm:w-64 dst untuk desktop
          // 3. text-base di mobile (biar iPhone gak auto-zoom pas ngetik)
          className="input-bordered input input-sm join-item w-full bg-white/10 text-white placeholder-white/60 backdrop-blur-md transition-all duration-300 focus:bg-white/20 focus:outline-none sm:w-64 md:input-md md:w-72 lg:w-80"
          placeholder="Search movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn join-item border-none bg-primary text-white btn-sm hover:bg-primary/80 md:btn-md"
        >
          <MagnifyingGlass size={20} className="md:h-6 md:w-6" />
        </button>
      </form>

      {/* Dropdown Results */}
      {debouncedQuery.length > 2 && (
        <div
          tabIndex={0}
          // PERBAIKAN:
          // 1. md:w-[400px]: Di desktop lebih lebar biar info lega
          // 2. w-full: Di mobile ngikutin lebar input
          // 3. max-h-[60vh] overflow-y-auto: Biar bisa discroll kalau hasil banyak
          className="dropdown-content menu z-50 mt-2 w-full rounded-xl bg-[#e5e5e5] p-0 shadow-2xl md:w-[400px]"
        >
          <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-2 text-black md:p-3">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <span className="loading text-primary loading-spinner"></span>
              </div>
            ) : data?.results?.length > 0 ? (
              <>
                <SearchMovieCard results={data.results.slice(0, 5)} />
                <div className="px-2 pt-2 pb-1">
                  <Link
                    href={`/search/${encodeURIComponent(debouncedQuery)}`}
                    className="btn w-full text-xs font-bold text-black uppercase btn-ghost btn-sm hover:bg-black/10"
                    onClick={() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                  >
                    View All Results
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-gray-600">
                  Movie not found for &quot;{debouncedQuery}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
