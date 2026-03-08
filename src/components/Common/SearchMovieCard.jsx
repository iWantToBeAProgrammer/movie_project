"use client";

import Image from "next/image";
import { Star } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ColorThief from "color-thief-browser";

const SearchMovieCard = ({ results }) => {
  const [movieColors, setMovieColors] = useState({});
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (!results || results.length === 0) return;

    // Logic ColorThief tetap sama, tapi kita bungkus try-catch extra
    // agar tidak error di beberapa browser mobile
    const colorPromises = results.map((result) => {
      return new Promise((resolve) => {
        if (!result.poster_path) {
          resolve({ id: result.id, dominantColor: "rgba(0,0,0,0.1)" });
          return;
        }

        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = `${process.env.NEXT_APP_BASEIMG}${result.poster_path}`;

        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 2);
            // Fallback jika palette kosong
            if (palette && palette.length > 0) {
              const dominantColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.2)`;
              resolve({ id: result.id, dominantColor });
            } else {
              resolve({ id: result.id, dominantColor: "rgba(0,0,0,0.1)" });
            }
          } catch (error) {
            resolve({
              id: result.id,
              dominantColor: "rgba(255, 255, 255, 0.1)",
            });
          }
        };

        img.onerror = () => {
          resolve({ id: result.id, dominantColor: "rgba(255, 255, 255, 0.1)" });
        };
      });
    });

    Promise.all(colorPromises).then((colors) => {
      const colorMap = colors.reduce((acc, color) => {
        acc[color.id] = color;
        return acc;
      }, {});
      setMovieColors(colorMap);
    });
  }, [results]);

  if (!results || results.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-1">
      {results.map((result) => {
        const movieColor = movieColors[result.id] || {
          dominantColor: "transparent",
        };
        const isHovered = hoveredId === result.id;
        const releaseYear = result.release_date?.split("-")[0] || "N/A";

        return (
          <Link
            key={result.id}
            href={`/movies/${result.id}`}
            onMouseEnter={() => setHoveredId(result.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              backgroundColor: isHovered
                ? movieColor.dominantColor
                : "transparent",
            }}
            // RESPONSIVE FIX: Padding lebih kecil di mobile, rounded lebih rapi
            className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-300 ease-in-out hover:bg-white/10"
            onClick={() => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
          >
            {/* Poster Thumbnail */}
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg shadow-lg md:h-20 md:w-14">
              <Image
                src={
                  result.poster_path
                    ? `${process.env.NEXT_APP_BASEIMG}${result.poster_path}`
                    : "/assets/images/noimage.jpg" // Pastikan ada fallback image
                }
                alt={result.title}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes="56px"
              />
            </div>

            {/* Info Wrapper: min-w-0 penting agar truncate jalan di flex item */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-primary md:text-base">
                {result.title}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
                <span className="font-medium">{releaseYear}</span>

                <span className="text-white/20">•</span>

                <div className="flex items-center gap-1">
                  <Star weight="fill" className="text-yellow-500" size={14} />
                  <span className="font-bold text-white/80">
                    {result.vote_average?.toFixed(1)}
                  </span>
                </div>

                {/* Hide certification on very small screens if needed, or keep it */}
                {result.certification && result.certification !== "N/A" && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="rounded border border-white/20 px-1.5 text-[10px] font-extrabold tracking-wider text-white/40">
                      {result.certification}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SearchMovieCard;
