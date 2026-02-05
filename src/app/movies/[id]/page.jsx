import Certification from "@/components/Certification";
import CommentSection from "@/components/Comments/CommentSection";
import BackNavigation from "@/components/Common/BackNavigation";
import CustomButton from "@/components/CustomButton";
import SliderRecommendation from "@/components/MovieList/SliderRecommendation";
import Trailer from "@/components/Trailer";
import { getRecDetails } from "@/services/movie-rec";
import { getMovieDetails } from "@/services/movie-service";
import Image from "next/image";

const SectionHeader = ({ title }) => (
  <div className="flex gap-2">
    <p className="border-l-8 border-secondary"></p>
    <h2 className="font-bebas_neue text-4xl font-bold tracking-wider">
      {title}
    </h2>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-3 border-t border-slate-600 pt-4">
    <p>{label}</p>
    <p className="col-span-2 text-pretty">{value}</p>
  </div>
);

const formatRuntime = (mins) =>
  mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : "N/A";

export default async function MovieDetails({ params }) {
  const { id } = params;
  const [movie, recommendations] = await Promise.all([
    getMovieDetails(id),
    getRecDetails(id),
  ]);

  const releaseYear = movie.releaseDates?.substring(0, 4) || "N/A";
  const cast = movie.cast || [];

  return (
    <div className="container mx-auto h-fit max-w-(--breakpoint-xl)">
      <BackNavigation />

      <div className="movie-details-wrapper flex flex-col">
        <div className="video-section flex h-full w-full">
          <Trailer movieTrailer={movie.movieTrailer} />
        </div>

        <div className="overview-cast-wrapper mt-10 flex gap-20">
          <div className="left-content flex w-1/2 flex-col gap-4 font-sans_caption">
            <h1 className="font-bebas_neue text-4xl tracking-wider">
              {movie.title}
            </h1>

            <div className="flex gap-5">
              <CustomButton type="add" size="large" movieId={movie.id} />
              <CustomButton type="watched" size="large" movieId={movie.id} />
              <CustomButton type="favorite" size="small" movieId={movie.id} />
            </div>

            <div className="flex items-center gap-2">
              <Certification result={movie.certification || ""} />
              <p>
                {movie.genres?.join(", ")} ● {releaseYear}
              </p>
            </div>

            <p>Duration {formatRuntime(movie.runtime)}</p>
            <p className="text-pretty">{movie.overview}</p>

            <InfoRow label="Director" value={movie.directors?.join(", ")} />
            <InfoRow label="Writers" value={movie.writers?.join(", ")} />
            <InfoRow label="Studios" value={movie.companyNames?.join(", ")} />
          </div>

          <div className="right-content flex w-1/2 flex-col">
            <SectionHeader title="CAST" />

            <div className="cast-list mt-4 grid grid-flow-col grid-rows-2 items-center gap-5 overflow-hidden hover:overflow-x-auto">
              {cast.map((actor, index) => {
                const imgSrc = actor.profile_path
                  ? `${process.env.NEXT_APP_BASEIMG}${actor.profile_path}`
                  : "/assets/images/noimage.jpeg";

                return (
                  <div
                    key={index}
                    className="flex w-fit flex-col gap-1 text-center text-sm"
                  >
                    <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-gray-300">
                      <Image
                        src={imgSrc}
                        alt={actor.name}
                        width={150}
                        height={150}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-semibold">{actor.name}</p>
                    <p className="text-xs">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="recommendation-section mt-10 flex flex-col gap-4">
          <SectionHeader title="RECOMMENDATIONS" />
          <SliderRecommendation results={recommendations} />
        </div>

        <div className="review-section mt-10 flex flex-col gap-4 font-sans_caption">
          <SectionHeader title="REVIEW" />
          <CommentSection movieId={movie.id} />
        </div>
      </div>
    </div>
  );
}
