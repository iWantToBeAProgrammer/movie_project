"use client";

import { useQuery } from "@tanstack/react-query";
import Loading from "../loading";
import Image from "next/image";
const Ticket = () => {
  const getMovieImages = async () => {
    const response = await fetch(
      `${process.env.NEXT_APP_BASEURL}/movie/${1087192}/images`,
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

  const { data, isPending } = useQuery({
    queryKey: ["movie-images"],
    queryFn: getMovieImages,
  });

  if (isPending) return <Loading />;

  console.log(data);

  const backdropPath = `${process.env.NEXT_APP_BASEIMG}${data.backdrops.find((backdrop) => backdrop.iso_639_1 === null)?.file_path}`;
  const logoPath = `${process.env.NEXT_APP_BASEIMG}${
    data.logos.find((logo) => logo.iso_639_1 === "en")?.file_path
  }`;

  return (
    <>
      <div className="container mx-auto h-screen max-w-[1080px] bg-primary/40">
        <div className="wrapper flex flex-col items-center justify-between">
          <h1>Title</h1>
          <div className="ticket-wrapper mt-12 w-full px-12">
            <div className="ticket relative flex h-80 w-full justify-between">
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
            {/* <div className="ticket flex h-80 w-full justify-between bg-base-100"></div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticket;
