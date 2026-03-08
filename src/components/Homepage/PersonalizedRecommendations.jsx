"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Header from "@/components/Header";

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setRecommendations(data.results || []);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommended-for-you flex flex-col gap-4">
      <Header title="Recommended For You" linkHref="/movies" />
      <Card results={recommendations} />
    </div>
  );
};

export default PersonalizedRecommendations;
