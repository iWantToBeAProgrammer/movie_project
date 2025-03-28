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
      <div className="join mb-2">
        <input
          className="input w-96 focus:outline-none bg-accent/80 glass text-white font-raleway text-xl font-semibold input-bordered join-item"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn join-item btn-primary">
          <MagnifyingGlass size={24} />
        </button>
      </div>
      {debouncedQuery.length > 2 && (
        <div className="dropdown-content card card-compact bg-[#D9D9D9] text-primary-content z-[1] p-0 w-full shadow">
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
                  className="w-full flex justify-center items-center font-bold uppercase text-black pb-2"
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
