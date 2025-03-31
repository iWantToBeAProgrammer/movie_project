import Image from "next/image";
import Certification from "../Certification";
import { Minus, Star } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import ColorThief from "color-thief-browser";

const SearchMovieCard = ({ results }) => {
  const [movieColors, setMovieColors] = useState({});

  useEffect(() => {
    const colorPromises = results.map((result) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = `${process.env.NEXT_APP_BASEIMG}${result.poster_path}`;

        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 5);

            const dominantColor = `rgba(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]}, 0.5)`;
            const secondaryColor = `rgba(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]}, 0.5)`;

            resolve({
              id: result.id,
              dominantColor,
              secondaryColor,
            });
          } catch (error) {
            console.error("Color extraction error:", error);
            resolve({
              id: result.id,
              dominantColor: "rgba(0,0,0,0.1)",
              secondaryColor: "rgba(0,0,0,0.05)",
            });
          }
        };

        img.onerror = () => {
          resolve({
            id: result.id,
            dominantColor: "rgba(0,0,0,0.1)",
            secondaryColor: "rgba(0,0,0,0.05)",
          });
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

  return (
    <>
      {results.map((result, key) => {
        const movieColor = movieColors[result.id] || {};

        return (
          <div key={key} className="flex flex-col">
            <Link
              tabIndex={0}
              href={`/movies/${result.id}`}
              className="card mx-0 card-side px-0 text-base-100 transition-colors duration-300 ease-in"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  movieColor.dominantColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "inherit")
              }
              role="button"
            >
              <figure>
                <Image
                  width={50}
                  height={50}
                  src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
                  alt="Movie"
                />
              </figure>
              <div className="card-body w-3/4">
                <h2 className="card-title line-clamp-1 text-base font-semibold">
                  {result.title}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="rounded-lg border border-primary px-1 py-0.5 font-bebas_neue font-black">
                    {result.certification !== "" ? (
                      result.certification
                    ) : (
                      <Minus />
                    )}
                  </div>
                  <p className="list-item list-inside list-disc font-sans_caption">
                    {result.release_date}
                  </p>
                  <p className="flex list-inside list-disc items-center gap-2 font-sans_caption">
                    <Star weight="fill" color="orange" />
                    {result.vote_average}
                  </p>
                </div>
              </div>
            </Link>
            <div className="divider mx-0 divider-accent"></div>
          </div>
        );
      })}
    </>
  );
};

export default SearchMovieCard;
