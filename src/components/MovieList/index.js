import Card from "@/components/Card";

export default function MovieList({ results }) {
  return (
    <div className="flex flex-grow gap-7">
      {results.map((result) => {
        console.log("results:", result)
        return <Card key={result.id} result={result} />;
      })}
    </div>
  );
}