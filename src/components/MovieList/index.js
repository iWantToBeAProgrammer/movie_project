import Card from "@/components/Card";

export default function MovieList({ results }) {
  // console.log(results)
  return (
    <div className="flex gap-7">
      {results.map((data) => {
        return <Card key={data.id} result={data} />;
      })}
    </div>
  );
}
