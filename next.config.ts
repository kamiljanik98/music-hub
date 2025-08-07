import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    domains: ["pwfxluewdlealedfbwgd.supabase.co", "images.squarespace-cdn.com", "www.vibe.com"],
  },
};

const withPwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPwaConfig(baseConfig);
