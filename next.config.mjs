/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "https://image.tmdb.org/t/p/w500",
      },
    ],
  },
};

export default nextConfig;
