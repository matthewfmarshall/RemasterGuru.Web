import type { NextConfig } from "next";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function isAuth0ConfiguredAtBuild(): boolean {
  const domain =
    readEnv("AUTH0_DOMAIN")
    ?? readEnv("AUTH0_ISSUER_BASE_URL")?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return Boolean(
    readEnv("AUTH0_SECRET")
      && readEnv("AUTH0_CLIENT_ID")
      && readEnv("AUTH0_CLIENT_SECRET")
      && domain,
  );
}

const appBaseUrl =
  readEnv("AUTH0_BASE_URL")
  ?? readEnv("APP_BASE_URL")
  ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  env: isAuth0ConfiguredAtBuild()
    ? { NEXT_PUBLIC_APP_BASE_URL: appBaseUrl.replace(/\/$/, "") }
    : undefined,
  output: process.env.NEXT_STANDALONE_OUTPUT === "1" ? "standalone" : undefined,
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
