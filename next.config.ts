import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_R2_AVATARS_URL!).hostname,
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_R2_COVERS_URL!).hostname,
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_R2_BANNERS_URL!).hostname,
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
