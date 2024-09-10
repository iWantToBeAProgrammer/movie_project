// import getMovieData from "@/libs/api-libs";

// export default async function getMovieList(req, res) {
//   const { index = 0 } = req.query; // Get the index from query string

//   const response = await fetch(
//     getMovieData("now_playing", "&language=en-US&page=1&region=ID")
//   );
//   const data = await response.json();

//   const validIndex = index >= data.results.length ? 0 : index;

//   res.status(200).json(data.results[validIndex]);
// }
