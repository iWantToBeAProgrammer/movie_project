export default function movieDetails({ params }) {
  const { id } = params;
  return (
    <>
      <h1>Movie Details id: {id}</h1>
    </>
  );
}
