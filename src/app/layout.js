import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Common/Footer";
import QueryProvider from "./contexts/QueryProvider";
import localFont from "next/font/local";

const bebasNeue = localFont({
  src: "../../public/assets/fonts/Bebas_Neue,Raleway/Bebas_Neue/BebasNeue-Regular.ttf",
  variable: "--font-bebas_neue",
  display: "swap",
});

const raleway = localFont({
  src: "../../public/assets/fonts/Bebas_Neue,Raleway/Raleway/Raleway-VariableFont_wght.ttf",
  variable: "--font-raleway",
  display: "swap",
});

const ralewayItalic = localFont({
  src: "../../public/assets/fonts/Bebas_Neue,Raleway/Raleway/Raleway-Italic-VariableFont_wght.ttf",
  variable: "--font-raleway_italic",
  display: "swap",
});

const sansCaption = localFont({
  src: "../../public/assets/fonts/PT_Sans_Caption/PTSansCaption-Regular.ttf",
  variable: "--font-sans_caption",
  display: "swap",
});

export const metadata = {
  title: {
    default: "CinemaTix",
    template: "%s | CinemaTix",
  },
  description:
    "Discover, track, and share your favorite movies with beautiful, ticket-style visuals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${bebasNeue.variable} ${raleway.variable} ${ralewayItalic.variable} ${sansCaption.variable}`}
      >
        <AuthProvider>
          <QueryProvider>
            <Toaster position="bottom-center" />
            <main className="flex-1 font-raleway text-neutral">{children}</main>
            <Footer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
