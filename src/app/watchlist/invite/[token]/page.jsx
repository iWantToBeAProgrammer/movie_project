// app/watchlist/invite/[token]/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
export default function InviteJoinPage({ params }) {
  const router = useRouter();

  useEffect(() => {
    const joinWatchlist = async () => {
      const res = await fetch(`/api/watchlist/invite/${params.token}`);
      if (res.redirected) {
        router.push(res.url);
      } else if (res.ok) {
        router.push("/profile");
      } else {
        toast.error("Invalid invite link.");
        router.push("/");
      }
    };

    joinWatchlist();
  }, [params.token, router]);

  return <Loading />;
}
