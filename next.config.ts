import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-bdfe3dcb9ba24b7aa40161c8c9549b03.r2.dev",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "pub-ae08b2c1be684bfd8ba00d8f73202b73.r2.dev",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "pub-ff23e057c6dd40d0b5b7f4ec34428b1a.r2.dev",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
