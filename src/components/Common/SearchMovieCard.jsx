"use client";

import Image from "next/image";
import { Minus, Star } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ColorThief from "color-thief-browser";

const SearchMovieCard = ({ results }) => {
  const [movieColors, setMovieColors] = useState({});
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (!results || results.length === 0) return;

    const colorPromises = results.map((result) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = `${process.env.NEXT_APP_BASEIMG}${result.poster_path}`;

        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 2);
            const dominantColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.2)`;
            resolve({ id: result.id, dominantColor });
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
    <div className="flex w-full flex-col">
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
            className="flex items-center gap-3 rounded-lg border-b border-white/10 p-2 transition-colors duration-300 ease-in-out last:border-none hover:backdrop-blur-sm"
          >
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md shadow-sm">
              <Image
                src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
                alt={result.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="truncate text-sm leading-tight font-bold text-black md:text-base">
                {result.title}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-xs text-black/70">
                <span>{releaseYear}</span>
                <span className="text-black/30">•</span>
                <div className="flex items-center gap-1">
                  <Star weight="fill" className="text-yellow-500" size={12} />
                  <span className="font-semibold">
                    {result.vote_average?.toFixed(1)}
                  </span>
                </div>

                <span className="text-black/30">•</span>

                {result.certification ? (
                  <span className="rounded border border-black/20 px-1 text-[10px] font-bold">
                    {result.certification}
                  </span>
                ) : (
                  <span className="text-[10px] text-black/40 italic">NR</span>
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
