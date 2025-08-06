"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import Loading from "../loading";
import Image from "next/image";
const Ticket = () => {
  const movieIds = [1100988, 1087192, 617126];

  const getMovieImages = async (id) => {
    const response = await fetch(
      `${process.env.NEXT_APP_BASEURL}/movie/${id}/images`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_APP_APIKEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) throw new Error("failed to fetch");

    return response.json();
  };

  const queries = useQueries({
    queries: movieIds.map((id) => ({
      queryKey: ["movie-images", id],
      queryFn: () => getMovieImages(id),
    })),
  });
  const isAnyPending = queries.some((query) => query.isPending);

  if (isAnyPending) return <Loading />;

  return (
    <>
      <div className="container mx-auto min-h-screen max-w-[1080px]">
        <div className="wrapper flex flex-col items-center justify-between py-8">
          <h1>Title</h1>
          <div className="ticket-wrapper mt-12 w-full px-12 flex flex-col gap-3">
            {queries.map((query, index) => {
              if (!query.data) return null;

              const movieId = movieIds[index];
              const backdropPath = `${process.env.NEXT_APP_BASEIMG}${
                query.data.backdrops?.find(
                  (backdrop) => backdrop.iso_639_1 === null,
                )?.file_path || ""
              }`;
              const logoPath = `${process.env.NEXT_APP_BASEIMG}${
                query.data.logos?.find((logo) => logo.iso_639_1 === "en")
                  ?.file_path || ""
              }`;
              return (
                <div
                  key={index}
                  className="ticket relative flex h-72 w-full justify-between"
                >
                  <div
                    style={{ "--backdrop-url": `url(${backdropPath})` }}
                    className="relative flex w-full justify-between bg-[image:var(--backdrop-url)] bg-cover bg-center bg-no-repeat"
                  >
                    <div className="absolute top-0 left-0 h-full w-full bg-black/70">
                      <div className="ticket-content flex flex-col gap-4 p-8 font-sans_caption">
                        <Image
                          src={logoPath}
                          alt="Movie logo"
                          width={400}
                          height={240}
                        />
                        <div className="flex flex-col">
                          <span>Action • Drama </span>
                          <span>2h 36m • 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-1/5 bg-primary"></div>
                </div>
              );
            })}
            {/* <div className="ticket flex h-80 w-full justify-between bg-base-100"></div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticket;
