/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
      },
      {
        hostname: "zvqmfukwxitfwonmibhw.supabase.co",
      },
      {
        hostname: "i.ytimg.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  env: {
    NEXT_APP_APIKEY: process.env.NEXT_APP_APIKEY,
    NEXT_PUBLIC_APIKEY: process.env.NEXT_PUBLIC_APIKEY,
    NEXT_APP_BASEURL: process.env.NEXT_APP_BASEURL,
    NEXT_APP_BASEIMG: process.env.NEXT_APP_BASEIMG,
  },
};

export default nextConfig;
