
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="font-raleway text-neutral">
          {children}
        </div>
      </body>
    </html>
  );
}
