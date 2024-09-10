import Image from "next/image";

const Card = ({ result }) => {
  console.log(result)
  const releaseYear = result.release_date.slice(0, 4);
  return (
    <>
      <div className="card w-[22rem] relative overflow-hidden">
        <Image
          src={`${process.env.NEXT_APP_BASEIMG}${result.poster_path}`}
          width={500}
          height={500}
        />

        <div className="group card-overlay bg-black bg-opacity-70 w-full absolute bottom-0 h-52 transform translate-y-full transition duration-500 ease-in-out">
          <div className="card-content flex items-center py-4 text-3xl text-white flex-col gap-6 justify-center h-full">
            <div className="card-text text-center">
              <h1 className="card-title ">{result.title}</h1>
              <p className="release-year">{`(${releaseYear})`}</p>
            </div>
            <button className="btn btn-md bg-gradient-to-r from-primary to-secondary">
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
