import Certification from "@/components/Certification";
import CommentSection from "@/components/Comments/CommentSection";
import BackNavigation from "@/components/Common/BackNavigation";
import CustomButton from "@/components/CustomButton";
import SliderRecommendation from "@/components/MovieList/SliderRecommendation";
import Navbar from "@/components/Navbar";
import Trailer from "@/components/Trailer";
import { getRecDetails } from "@/services/movie-rec";
import { getMovieDetails } from "@/services/movie-service";
import Image from "next/image";

// Header Section Responsive (Text size & Border size)
const SectionHeader = ({ title }) => (
  <div className="flex gap-2">
    <p className="border-l-4 border-secondary md:border-l-8"></p>
    <h2 className="font-bebas_neue text-3xl font-bold tracking-wider md:text-4xl">
      {title}
    </h2>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-3 border-t border-slate-600 pt-4 text-sm md:text-base">
    <p className="font-semibold text-gray-400">{label}</p>
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
    <>
      <Navbar />
      <div className="container mx-auto mt-20 h-fit max-w-(--breakpoint-xl) px-4 md:px-0 lg:mt-20">
        <div className="lg:flex hidden">
          <BackNavigation />
        </div>

        <div className="movie-details-wrapper flex flex-col">
          {/* Video Section */}
          <div className="video-section flex h-full w-full">
            <Trailer movieTrailer={movie.movieTrailer} />
          </div>

          {/* RESPONSIVE LAYOUT: 
           Mobile: flex-col (Menumpuk) & gap-10
           Desktop (lg): flex-row (Sebelahan) & gap-20
        */}
          <div className="overview-cast-wrapper mt-8 flex flex-col gap-10 md:mt-10 lg:flex-row lg:gap-20">
            {/* LEFT CONTENT: Detail Film */}
            {/* Mobile: w-full, Desktop: w-1/2 */}
            <div className="left-content flex w-full flex-col gap-4 font-sans_caption lg:w-1/2">
              <h1 className="font-bebas_neue text-3xl tracking-wider md:text-5xl">
                {movie.title}
              </h1>

              {/* Tombol Action */}
              <div className="flex flex-wrap items-center gap-3 md:gap-5">
                <CustomButton type="add" size="large" movieId={movie.id} />
                <CustomButton type="watched" size="large" movieId={movie.id} />
                <CustomButton type="favorite" size="small" movieId={movie.id} />
              </div>

              {/* Metadata (Cert, Genre, Year) */}
              <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                <Certification result={movie.certification || ""} />
                <p>
                  {movie.genres?.join(", ")} ● {releaseYear}
                </p>
              </div>

              <p className="text-sm md:text-base">
                Duration {formatRuntime(movie.runtime)}
              </p>
              <p className="text-sm leading-relaxed text-pretty text-gray-200 md:text-base">
                {movie.overview}
              </p>

              <div className="mt-2 flex flex-col gap-2">
                <InfoRow label="Director" value={movie.directors?.join(", ")} />
                <InfoRow label="Writers" value={movie.writers?.join(", ")} />
                <InfoRow
                  label="Studios"
                  value={movie.companyNames?.join(", ")}
                />
              </div>
            </div>

            {/* RIGHT CONTENT: Cast */}
            {/* Mobile: w-full, Desktop: w-1/2 */}
            <div className="right-content flex w-full flex-col lg:w-1/2">
              <SectionHeader title="CAST" />

              {/* Cast List Responsive:
                - overflow-x-auto: Agar bisa discroll di HP (swipe) tanpa perlu hover
                - pb-4: Memberi ruang scrollbar
            */}
              <div className="cast-list scrollbar-hide mt-4 grid grid-flow-col grid-rows-2 items-start gap-4 overflow-x-auto pb-4 md:gap-5">
                {cast.map((actor, index) => {
                  const imgSrc = actor.profile_path
                    ? `${process.env.NEXT_APP_BASEIMG}${actor.profile_path}`
                    : "/assets/images/noimage.jpeg";

                  return (
                    <div
                      key={index}
                      className="flex w-28 flex-col gap-2 text-center text-sm md:w-32 lg:w-40"
                    >
                      <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-gray-800 shadow-md md:h-32 md:w-32 md:rounded-2xl lg:h-40 lg:w-40">
                        <Image
                          src={imgSrc}
                          alt={actor.name}
                          width={160}
                          height={160}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col px-1">
                        <p className="line-clamp-1 text-xs font-bold md:text-sm">
                          {actor.name}
                        </p>
                        <p className="line-clamp-1 text-[10px] text-gray-400 md:text-xs">
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="recommendation-section mt-12 flex flex-col gap-4">
            <SectionHeader title="RECOMMENDATIONS" />
            <SliderRecommendation results={recommendations} />
          </div>

          {/* Review Section */}
          <div className="review-section mt-12 mb-20 flex flex-col gap-4 font-sans_caption">
            <SectionHeader title="REVIEW" />
            <CommentSection movieId={movie.id} />
          </div>
        </div>
      </div>
    </>
  );
}
