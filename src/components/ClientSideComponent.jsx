// src/components/ClientSideComponent.js
"use client"; // Make sure to use 'use client' to enable client-side features

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";

export default function ClientSideComponent({ initialMovie }) {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set the initial movie
    setCurrentMovie(initialMovie.results[currentIndex]);
  }, [initialMovie, currentIndex]);

  // Fetch the next movie based on index
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (!currentMovie) return <div>Loading...</div>;

  return (
    <div>
      <Hero result={currentMovie} />
    </div>
  );
}