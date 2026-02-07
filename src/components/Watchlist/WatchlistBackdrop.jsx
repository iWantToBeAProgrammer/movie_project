"use client";

import ColorThief from "color-thief-browser";
import { useEffect, useState } from "react";

export default function WatchlistBackdrop({ imageUrl, children }) {
  const [bgColor, setBgColor] = useState("#oklch(0.18 0.0067 17.8)");

  useEffect(() => {
    if (!imageUrl) return; // ✅ Prevent errors

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setBgColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (error) {
        console.error("Color extraction failed:", error);
      }
    };
  }, [imageUrl]);

  return (
    <div
      className="h-48 lg:h-80 w-full flex items-center justify-center text-white"
      style={{ background: `linear-gradient(to top,oklch(0.18 0.0067 17.8) 12%, ${bgColor} 100%` }}
    >
      {children}
    </div>
  );
}
