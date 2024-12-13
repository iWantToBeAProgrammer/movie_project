import Card from "@/components/Card";

export default function MovieList({ results }) {
  return (
    <div className="flex flex-grow gap-7">
      {results.map((data) => {
        return <Card key={data.id} result={data} />;
      })}
    </div>
  );
}