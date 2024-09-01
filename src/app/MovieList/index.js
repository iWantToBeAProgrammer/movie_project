export default function MovieList({ results }) {
  return (
    <div>
      <div>anak monyeawdawdt</div>
      {results.map((data) => {
        return (
          <div key={data.id}>
            {console.log(data.original_title)}
            <h2 className="text-5xl text-black">
              {data.original_title} adsawda
            </h2>
          </div>
        );
      })}
    </div>
  );
}
