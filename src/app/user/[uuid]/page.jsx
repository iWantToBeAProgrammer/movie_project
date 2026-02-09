"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import UserProfileLayout from "@/components/UserProfileLayout";

export default function PublicProfilePage() {
  const { uuid } = useParams();
  const [tabValue, setTabValue] = useState("watchlist");
  const getUserData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/user/${uuid}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) throw new Error("Fetch failed");

    return response.json();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user", uuid],
    enabled: !!uuid,
    queryFn: getUserData,
  });

  // Flatten and format data
  const watchlists = data.members.map((m) => ({
    ...m.watchlist,
    source: "public",
  }));

  if (isLoading) return <Loading />;

  return (
    <UserProfileLayout
      userInfo={data}
      watchedMovies={[]}
      favoriteMovies={[]}
      watchlists={watchlists}
      tabValue={tabValue}
      setTabValue={setTabValue}
      isPublicView
    />
  );
}
