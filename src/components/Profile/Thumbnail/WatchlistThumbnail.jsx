import { useEffect, useRef, useState } from "react";

const WatchlistThumbnail = ({ movies }) => {
  const canvasRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return; // ✅ Prevent null errors

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // ✅ Extra safeguard

    const imgSize = 300; // Canvas size
    canvas.width = imgSize;
    canvas.height = imgSize;

    const imagesToLoad = movies.slice(0, 4); // Take max 4 movies
    const gridSize = imagesToLoad.length === 4 ? 2 : 1; // 2x2 grid if 4 images

    let loadedImages = 0;
    const images = [];

    imagesToLoad.forEach((movie, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Prevent CORS issues
      img.src = `${process.env.NEXT_APP_BASEIMG}${movie.movie.posterPath}`; // Make sure this is a valid URL

      img.onload = () => {
        images[index] = img;
        loadedImages++;

        if (loadedImages === imagesToLoad.length) {
          ctx.clearRect(0, 0, imgSize, imgSize);

          if (gridSize === 1) {
            // Single full-size image
            ctx.drawImage(images[0], 0, 0, imgSize, imgSize);
          } else {
            // 2x2 grid
            const tileSize = imgSize / 2;
            images.forEach((image, i) => {
              const x = (i % 2) * tileSize;
              const y = Math.floor(i / 2) * tileSize;
              ctx.drawImage(image, x, y, tileSize, tileSize);
            });
          }

          setThumbnail(canvas.toDataURL("image/png"));
        }
      };
    });
  }, [movies]);

  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Watchlist Thumbnail"
          width={230}
          height={230}
          className="object-cover object-center rounded-2xl aspect-square"
        />
      ) : (
        <canvas ref={canvasRef} className="hidden" />
      )}
    </>
  );
};

export default WatchlistThumbnail;
