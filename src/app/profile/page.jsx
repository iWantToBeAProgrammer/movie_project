"use client";

import WatchlistCard from "@/components/Profile/WatchlistCard";
import { createWatchlist, updateProfileData } from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import CardMovieList from "@/components/MovieList/CardMovieList";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import WatchlistModal from "@/components/Watchlist/WatchlistModal";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { HiOutlinePencil } from "react-icons/hi";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../loading";
import UserProfileLayout from "@/components/UserProfileLayout";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <Loading />;

  const queryClient = useQueryClient();

  const [tabValue, setTabValue] = useState("watchlist");

  const [watchlistData, setWatchlistData] = useState({
    name: "",
    description: "",
    picture: null,
  });

  const [updatedUserData, setUpdatedUserData] = useState({
    username: "",
    profilePicture: null,
  });

  const createMutation = useMutation({
    mutationFn: createWatchlist,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["watchlist"]);
      setWatchlistData({ name: "", description: "", picture: null });
      document.getElementById("watchlist-modal")?.close();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create watchlist");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfileData,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["profile"]);
      document.getElementById("profile-modal")?.close();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const {
    userInfo,
    watchedMovies,
    favoriteMovies,
    joinedWatchlists,
    savedWatchlists,
  } = useProfileData(user.id);

  const isLoading =
    userInfo.isLoading ||
    watchedMovies.isLoading ||
    favoriteMovies.isLoading ||
    joinedWatchlists.isLoading ||
    savedWatchlists.isLoading;

  if (isLoading) return <Loading />;

  const watchlists = [
    ...joinedWatchlists.data.map((item) => ({
      ...item.watchlist,
      source: "joined",
    })),
    ...savedWatchlists.data.map((item) => ({
      ...item.watchlist,
      source: "saved",
    })),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWatchlistData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setWatchlistData((prev) => ({ ...prev, picture: file }));
  };

  const handleUserImageChange = (e) => {
    const file = e.target.files[0];
    setUpdatedUserData((prev) => ({ ...prev, profilePicture: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(watchlistData);
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(updatedUserData);
  };

  const formattedData = {
    favoriteMovies: favoriteMovies.data.map((item) => item.movie),
    watchedMovies: watchedMovies.data.map((item) => item.movie),
  };

  return (
    <>
      <Navbar />
      <UserProfileLayout
        userInfo={userInfo.data}
        watchedMovies={formattedData.watchedMovies}
        favoriteMovies={formattedData.favoriteMovies}
        watchlists={watchlists}
        tabValue={tabValue}
        setTabValue={setTabValue}
        updatedUserData={updatedUserData}
        setUpdatedUserData={setUpdatedUserData}
        watchlistData={watchlistData}
        setWatchlistData={setWatchlistData}
        handleUserImageChange={handleUserImageChange}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        handleUpdateUserSubmit={handleUpdateUserSubmit}
      />
    </>
  );
}
