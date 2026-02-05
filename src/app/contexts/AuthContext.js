"use client";
import { createBrowserClient } from "@supabase/ssr";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const fetchUserProfile = async (sessionUser) => {
    if (!sessionUser) return null;

    try {
      const googleAvatar = sessionUser.user_metadata?.avatar_url;

      const res = await fetch(`/api/user/${sessionUser.id}`);

      if (res.ok) {
        const dbUser = await res.json();

        return {
          ...sessionUser,
          profilePicture: dbUser.profilePicture || googleAvatar,
          username: dbUser.username || sessionUser.email?.split("@")[0],
        };
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }

    return sessionUser;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { user: sessionUser },
        } = await supabase.auth.getUser();
        if (sessionUser) {
          const fullUser = await fetchUserProfile(sessionUser);
          setUser(fullUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const fullUser = await fetchUserProfile(session.user);
        setUser(fullUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
