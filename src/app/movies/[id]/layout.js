import { Suspense } from "react";
import Loading from "@/app/loading"; // Ensure this points to your global loading component

export default function Layout({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
