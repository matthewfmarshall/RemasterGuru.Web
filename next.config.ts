import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Next dev blocks cross-host RSC/HMR unless listed; 127.0.0.1 ≠ localhost.
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
