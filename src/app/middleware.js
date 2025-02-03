import { NextResponse } from "next/server";
import { supabase } from "@/libs/supabase";

export async function middleware(req) {
  const token = req.cookies.get("sb-access-token");
  const { data } = await supabase.auth.getUser(token?.value);

  const restrictedPaths = ["/profile", "/watchlist", "/comment"]; // Add restricted routes here

  if (restrictedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!data.user) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", "You must log in to access this page");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Define the middleware paths
export const config = {
  matcher: ["/profile/:path*", "/watchlist/:path*", "/comment/:path*"],
};
