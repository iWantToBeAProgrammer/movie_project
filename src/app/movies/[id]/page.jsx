import { getMovieDetails } from "@/libs/movie-service";

export default async function movieDetails({ params }) {
  const { id } = params;

  const movie = await getMovieDetails(id);

  return (
    <>
      <h1>Movie Details id: {id}</h1>
      <img
        src={`${process.env.NEXT_APP_BASEIMG}${movie.posterPath}`}
        alt="image details"
      />
      <h1 className="text-5xl font-bold">{movie.title}</h1>
    </>
  );
}
