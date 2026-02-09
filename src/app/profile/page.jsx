"use client";

import {
  createWatchlist,
  updateProfileData,
  updateWatchlist,
} from "@/libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../loading";
import UserProfileLayout from "@/components/UserProfileLayout";
import BackNavigation from "@/components/Common/BackNavigation";

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [tabValue, setTabValue] = useState("watchlist");

  const [watchlistData, setWatchlistData] = useState({
    id: null,
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

  const editMutation = useMutation({
    mutationFn: updateWatchlist,
    onSuccess: (data) => {
      toast.success("Watchlist updated successfully!");
      queryClient.invalidateQueries(["watchlist"]);
      document.getElementById("watchlist-modal")?.close();
      setWatchlistData({ id: null, name: "", description: "", picture: null });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update watchlist");
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
  } = useProfileData(user?.id);

  if (!user) return <Loading />;

  const isLoading =
    userInfo.isLoading ||
    watchedMovies.isLoading ||
    favoriteMovies.isLoading ||
    joinedWatchlists.isLoading ||
    savedWatchlists.isLoading;

  if (isLoading) return <Loading />;

  const watchlists = [
    ...(joinedWatchlists.data || []).map((item) => ({
      ...item.watchlist,
      source: "joined",
    })),
    ...(savedWatchlists.data || []).map((item) => ({
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

    if (watchlistData.id) {
      editMutation.mutate(watchlistData);
    } else {
      createMutation.mutate(watchlistData);
    }
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(updatedUserData);
  };

  const handleOpenCreateModal = () => {
    setWatchlistData({ id: null, name: "", description: "", picture: null });
    document.getElementById("watchlist-modal").showModal();
  };

  const formattedData = {
    favoriteMovies: (favoriteMovies.data || []).map((item) => item.movie),
    watchedMovies: (watchedMovies.data || []).map((item) => item.movie),
  };

  return (
    <>
      <Navbar />
      <div className="hidden lg:flex">
        <BackNavigation />
      </div>
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
        onOpenCreate={handleOpenCreateModal}
        handleUserImageChange={handleUserImageChange}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
        handleUpdateUserSubmit={handleUpdateUserSubmit}
      />
    </>
  );
}
