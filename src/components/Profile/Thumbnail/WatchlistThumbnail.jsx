import { useEffect, useRef, useState } from "react";

const WatchlistThumbnail = ({ movies, setThumbnailUrl = () => {} }) => {
  const canvasRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!movies || movies.length === 0) {
      const defaultImg = "/assets/images/watchlist-default.jpg";
      setThumbnail(defaultImg);
      setThumbnailUrl(defaultImg); // ✅ Send default image to parent
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgSize = 300;
    canvas.width = imgSize;
    canvas.height = imgSize;

    const imagesToLoad = movies.slice(0, 4);
    const gridSize = imagesToLoad.length === 4 ? 2 : 1;

    let loadedImages = 0;
    const images = [];

    imagesToLoad.forEach((movie, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${process.env.NEXT_APP_BASEIMG}${movie?.movie?.posterPath || movie.posterPath}`;

      img.onload = () => {
        images[index] = img;
        loadedImages++;

        if (loadedImages === imagesToLoad.length) {
          ctx.clearRect(0, 0, imgSize, imgSize);

          if (gridSize === 1) {
            ctx.drawImage(images[0], 0, 0, imgSize, imgSize);
          } else {
            const tileSize = imgSize / 2;
            images.forEach((image, i) => {
              const x = (i % 2) * tileSize;
              const y = Math.floor(i / 2) * tileSize;
              ctx.drawImage(image, x, y, tileSize, tileSize);
            });
          }

          const imageUrl = canvas.toDataURL("image/png"); // ✅ Get base64 image URL
          setThumbnail(imageUrl);
          if (typeof setThumbnailUrl === "function") {
            setThumbnailUrl(imageUrl);
          }
        }
      };
    });
  }, [movies]);

  return (
    <>
      <img
        src={thumbnail || "/assets/images/watchlist-default.jpg"}
        alt="Watchlist Thumbnail"
        width={512}
        height={512}
        className="object-cover object-center w-full h-full rounded-2xl"
      />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};

export default WatchlistThumbnail;
