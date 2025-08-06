import { useQuery } from "@tanstack/react-query";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useProfileData = (userId) => {
  const userInfo = useQuery({
    queryKey: ["profile", "info", userId],
    enabled: !!userId,
    queryFn: () =>
      fetcher(`${process.env.NEXT_PUBLIC_BASEURL}/api/profile/${userId}/info`),
  });

  const watchedMovies = useQuery({
    queryKey: ["profile", "watched", userId],
    enabled: !!userId,
    queryFn: () =>
      fetcher(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/profile/${userId}/watched`,
      ),
  });

  const favoriteMovies = useQuery({
    queryKey: ["profile", "favorites", userId],
    enabled: !!userId,
    queryFn: () =>
      fetcher(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/profile/${userId}/favorites`,
      ),
  });

  const joinedWatchlists = useQuery({
    queryKey: ["profile", "watchlists", userId],
    enabled: !!userId,
    queryFn: () =>
      fetcher(
        `${process.env.NEXT_PUBLIC_BASEURL}/api/profile/${userId}/watchlists`,
      ),
  });

  const savedWatchlists = useQuery({
    queryKey: ["profile", "saved", userId],
    enabled: !!userId,
    queryFn: () =>
      fetcher(`${process.env.NEXT_PUBLIC_BASEURL}/api/profile/${userId}/saved`),
  });

  return {
    userInfo,
    watchedMovies,
    favoriteMovies,
    joinedWatchlists,
    savedWatchlists,
  };
};
