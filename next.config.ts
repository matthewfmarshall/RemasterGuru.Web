import type { NextConfig } from "next";
import { getAuth0Domain, getAppBaseUrl } from "./src/lib/auth/config";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function isAuth0ConfiguredAtBuild(): boolean {
  return Boolean(
    readEnv("AUTH0_SECRET")
      && readEnv("AUTH0_CLIENT_ID")
      && readEnv("AUTH0_CLIENT_SECRET")
      && getAuth0Domain(),
  );
}

const nextConfig: NextConfig = {
  env: isAuth0ConfiguredAtBuild()
    ? { NEXT_PUBLIC_APP_BASE_URL: getAppBaseUrl() }
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
