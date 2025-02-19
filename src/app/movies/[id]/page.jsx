import Card from "@/components/Card";
import Certification from "@/components/Certification";
import BackNavigation from "@/components/Common/BackNavigation";
import CustomButton from "@/components/CustomButton";
import Trailer from "@/components/Trailer";
import { getRecDetails } from "@/services/movie-rec";
import { getMovieDetails } from "@/services/movie-service";
import Image from "next/image";

export default async function movieDetails({ params }) {
  const { id } = params;
  const movie = await getMovieDetails(id);

  const recommendations = await getRecDetails(id);

  const certification = movie.certification || "";
  const cast = movie.cast ? movie.cast : [];

  const indonesiaData = movie.releaseDates?.results?.find(
    (result) => result.iso_3166_1 === "ID"
  );
  const releaseDate = indonesiaData?.release_dates[0]?.release_date || "";
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : "N/A";

  function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  const runtimeFormatted = movie.runtime ? formatRuntime(movie.runtime) : "N/A";

  return (
    <div className="container max-w-screen-xl mx-auto h-fit">
      <BackNavigation />
      <div className="movie-details-wrapper flex flex-col">
        <div className="video-section flex w-full h-full">
          <Trailer movieTrailer={movie.movieTrailer} />
        </div>
        <div className="overview-cast-wrapper flex mt-10 gap-20">
          <div className="left-content flex flex-col gap-4 font-sans_caption">
            <h1 className="text-4xl font-bebas_neue tracking-wider">
              {movie.title}
            </h1>
            <div className="flex gap-5 ">
              <CustomButton type="add" size="large" />
              <CustomButton type="watched" size="large" />
            </div>
            <div className=" flex items-center gap-2">
              <Certification result={certification} />
              <p>
                {movie.genres.join(", ")} ● {releaseYear}
              </p>
            </div>
            <p className="">Duration {runtimeFormatted}</p>
            <p className="text-pretty">{movie.overview}</p>
            <div className="grid grid-cols-3 border-t border-slate-600 pt-4">
              <p className="">Director</p>
              <p className="text-pretty col-span-2">
                {movie.directors.join(", ")}
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-600 pt-4 ">
              <p className="">Writers</p>
              <p className="text-pretty col-span-2">
                {movie.writers.join(", ")}
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-600 pt-4">
              <p className="">Studios</p>
              <p className="text-pretty col-span-2">
                {movie.companyNames.join(", ")}
              </p>
            </div>
          </div>
          <div className="right-content flex flex-col w-1/2">
            <div className="gap-2 flex">
              <p className="border-l-8 border-secondary"></p>
              <h2 className="text-4xl font-bold font-bebas_neue tracking-wider">
                CAST
              </h2>
            </div>
            <div className="cast-list items-center grid grid-rows-2 grid-flow-col gap-5 hover:overflow-x-auto mt-4 overflow-hidden">
              {cast.map((actor, index) => (
                <div
                  key={index}
                  className="text-sm flex flex-col text-center gap-1 w-fit"
                >
                  <div className="w-40 h-40 flex">
                    {actor.profile_path ? (
                      <img
                        src={`${process.env.NEXT_APP_BASEIMG}${actor.profile_path}`}
                        alt={actor.name}
                        className="rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-2xl bg-gray-300 flex items-center justify-center">
                        <Image
                          src={"/assets/images/noimage.jpeg"}
                          width={150}
                          height={150}
                          className="rounded-2xl object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-xs">{actor.name}</p>
                  <p className="text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="recommendation-section flex flex-col mt-10 gap-4">
          <div className="gap-2 flex">
            <p className="border-l-8 border-secondary"></p>
            <h2 className="text-4xl font-bold font-bebas_neue tracking-wider">
              RECOMMENDATIONS
            </h2>
          </div>
          <div>
            <Card results={recommendations} />
          </div>
        </div>
        <div className="review-section flex flex-col mt-10 w-1/2 gap-4 font-sans_caption">
          <div className="gap-2 flex">
            <p className="border-l-8 border-secondary"></p>
            <h2 className="text-4xl font-bold font-bebas_neue tracking-wider">
              Review
            </h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="add a review"
              className="p-3 w-full rounded-lg bg-transparent border-white border text-white"
            />
            <button className="p-3 bg-secondary rounded-lg">POST</button>
          </div>
          <div className="review-wrapper w-full h-fit flex flex-col bg-white text-black p-5 rounded-lg gap-4">
            <p className="text-pretty">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="user-date-wrapper flex items-center justify-between">
              <div className="user-profile flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-600">#</span>
                </div>
                <p className="user-name text-secondary">Putra</p>
              </div>
              <p className="date-created text-[#484848]">32 Januari 2099</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
