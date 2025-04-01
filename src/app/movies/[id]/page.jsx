import Certification from "@/components/Certification";
import BackNavigation from "@/components/Common/BackNavigation";
import CustomButton from "@/components/CustomButton";
import SliderRecommendation from "@/components/MovieList/SliderRecommendation";
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

  const releaseDate = movie.releaseDates;
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : "N/A";

  function formatRuntime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  const runtimeFormatted = movie.runtime ? formatRuntime(movie.runtime) : "N/A";

  return (
    <div className="container mx-auto h-fit max-w-(--breakpoint-xl)">
      <BackNavigation />
      <div className="movie-details-wrapper flex flex-col">
        <div className="video-section flex h-full w-full">
          <Trailer movieTrailer={movie.movieTrailer} />
        </div>
        <div className="overview-cast-wrapper mt-10 flex gap-20">
          <div className="left-content flex flex-col gap-4 font-sans_caption">
            <h1 className="font-bebas_neue text-4xl tracking-wider">
              {movie.title}
            </h1>
            <div className="flex gap-5">
              <CustomButton type="add" size="large" movieId={movie.id} />
              <CustomButton type="watched" size="large" movieId={movie.id} />
              <CustomButton type="favorite" size="small" movieId={movie.id} />
            </div>
            <div className="flex items-center gap-2">
              <Certification result={certification} />
              <p>
                {movie.genres.join(", ")} ● {releaseYear}
              </p>
            </div>
            <p className="">Duration {runtimeFormatted}</p>
            <p className="text-pretty">{movie.overview}</p>
            <div className="grid grid-cols-3 border-t border-slate-600 pt-4">
              <p className="">Director</p>
              <p className="col-span-2 text-pretty">
                {movie.directors.join(", ")}
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-600 pt-4">
              <p className="">Writers</p>
              <p className="col-span-2 text-pretty">
                {movie.writers.join(", ")}
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-600 pt-4">
              <p className="">Studios</p>
              <p className="col-span-2 text-pretty">
                {movie.companyNames.join(", ")}
              </p>
            </div>
          </div>
          <div className="right-content flex w-1/2 flex-col">
            <div className="flex gap-2">
              <p className="border-l-8 border-secondary"></p>
              <h2 className="font-bebas_neue text-4xl font-bold tracking-wider">
                CAST
              </h2>
            </div>
            <div className="cast-list mt-4 grid grid-flow-col grid-rows-2 items-center gap-5 overflow-hidden hover:overflow-x-auto">
              {cast.map((actor, index) => (
                <div
                  key={index}
                  className="flex w-fit flex-col gap-1 text-center text-sm"
                >
                  <div className="flex h-40 w-40">
                    {actor.profile_path ? (
                      <Image
                        src={`${process.env.NEXT_APP_BASEIMG}${actor.profile_path}`}
                        alt={actor.name}
                        width={150}
                        height={150}
                        className="rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-300">
                        <Image
                          src={"/assets/images/noimage.jpeg"}
                          width={150}
                          height={150}
                          className="rounded-2xl object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold">{actor.name}</p>
                  <p className="text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="recommendation-section mt-10 flex flex-col gap-4">
          <div className="flex gap-2">
            <p className="border-l-8 border-secondary"></p>
            <h2 className="font-bebas_neue text-4xl font-bold tracking-wider">
              RECOMMENDATIONS
            </h2>
          </div>
          <div>
            <SliderRecommendation results={recommendations} />
          </div>
        </div>
        <div className="review-section mt-10 flex w-1/2 flex-col gap-4 font-sans_caption">
          <div className="flex gap-2">
            <p className="border-l-8 border-secondary"></p>
            <h2 className="font-bebas_neue text-4xl font-bold tracking-wider">
              Review
            </h2>
          </div>
          <div className="flex gap-2 font-raleway font-semibold">
            <input
              type="text"
              placeholder="add a review"
              className="w-full rounded-lg border border-white bg-transparent p-3 text-white"
            />
            <button className="rounded-lg bg-secondary p-3">Post</button>
          </div>
          <div className="review-wrapper flex h-fit w-full flex-col gap-4 rounded-lg bg-neutral p-5 text-black">
            <p className="text-pretty">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="user-date-wrapper flex items-center justify-between">
              <div className="user-profile flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
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
