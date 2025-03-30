import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getSearchData } from "@/libs/movie-search";
import { MagnifyingGlass } from "@phosphor-icons/react";
import SearchMovieCard from "./SearchMovieCard";
import Link from "next/link";

export default function SearchMovie() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => getSearchData(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  const limitedData = data?.results?.slice(0, 4);

  return (
    <div className="dropdown">
      <div className="mb-2 join">
        <input
          className="input input-lg join-item w-96 glass bg-accent/80 font-raleway text-xl font-semibold text-white focus:outline-hidden"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn join-item btn-primary btn-lg">
          <MagnifyingGlass size={24} />
        </button>
      </div>
      {debouncedQuery.length > 2 && (
        <div className="dropdown-content card z-1 w-full bg-[#D9D9D9] p-0 text-primary-content shadow-sm card-sm">
          <div className="card-body text-black">
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : data?.results?.length > 0 ? (
              <div>
                <SearchMovieCard results={limitedData} />
                <Link
                  tabIndex={0}
                  role="button"
                  href={"/"}
                  className="flex w-full items-center justify-center pb-2 font-bold text-black uppercase"
                >
                  View All Results
                </Link>
              </div>
            ) : (
              <p>No results found for "{debouncedQuery}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
