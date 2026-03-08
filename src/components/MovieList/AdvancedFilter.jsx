"use client";

import { useEffect, useState } from "react";
import { getGenres } from "@/libs/api-libs";
import { Funnel, X, Calendar, Star, Tag } from "@phosphor-icons/react";

const AdvancedFilter = ({ onFilterChange, currentFilters }) => {
  const [genres, setGenres] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(currentFilters);

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres();
      setGenres(data.genres || []);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleGenreClick = (genreId) => {
    const newGenres = localFilters.with_genres.includes(genreId.toString())
      ? localFilters.with_genres.filter((id) => id !== genreId.toString())
      : [...localFilters.with_genres, genreId.toString()];
    
    updateFilters({ with_genres: newGenres });
  };

  const updateFilters = (newPartialFilters) => {
    const updated = { ...localFilters, ...newPartialFilters, page: 1 };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      with_genres: [],
      primary_release_year: "",
      "vote_average.gte": "",
      page: 1
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = 
    localFilters.with_genres.length > 0 || 
    localFilters.primary_release_year || 
    localFilters["vote_average.gte"];

  return (
    <div className="mb-8 font-sans_caption">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/10 ring-1 ring-white/10"
        >
          <Funnel size={20} weight={isOpen ? "fill" : "regular"} className={isOpen ? "text-primary" : ""} />
          {isOpen ? "Hide Filters" : "Advanced Filters"}
          {hasActiveFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px]">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-primary transition-colors"
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          {/* Genre Filter */}
          <div className="md:col-span-3">
            <label className="flex items-center gap-2 text-sm font-bold text-white/60 mb-3">
              <Tag size={16} /> GENRES
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const isActive = localFilters.with_genres.includes(genre.id.toString());
                return (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-[0_0_10px_rgba(var(--color-primary),0.4)]"
                        : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-white/60 mb-3">
              <Calendar size={16} /> RELEASE YEAR
            </label>
            <select
              value={localFilters.primary_release_year}
              onChange={(e) => updateFilters({ primary_release_year: e.target.value })}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            >
              <option value="">All Years</option>
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-white/60 mb-3">
              <Star size={16} /> MINIMUM RATING
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="9"
                step="1"
                value={localFilters["vote_average.gte"] || 0}
                onChange={(e) => updateFilters({ "vote_average.gte": e.target.value })}
                className="flex-1 accent-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <span className="min-w-[40px] text-center font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                {localFilters["vote_average.gte"] || 0}+
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
