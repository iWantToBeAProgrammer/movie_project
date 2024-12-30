"use client"; // Make sure to use 'use client' to enable client-side features

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";

export default function ClientSideComponent({ initialMovie }) {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentMovie(initialMovie.results[currentIndex]);
  }, [initialMovie, currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!currentMovie) return <div>Loading...</div>;

  return (
    <div>
      <Hero result={currentMovie} />
    </div>
  );
}
