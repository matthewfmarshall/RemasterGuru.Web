import { getAppBaseUrl, isAuth0Configured } from "@/src/lib/auth/config";

const DEFAULT_API_URL = "http://localhost:5055";
const DEFAULT_DEV_USER_ID = "84AD0816-39F0-480F-93F9-2D370D27CA7C";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, "");
  }

  if (isAuth0Configured()) {
    return getAppBaseUrl();
  }

  return DEFAULT_API_URL;
}

/** Dev-only user GUID sent as `X-User-Id` until real auth ships. */
export function getDevUserId(): string {
  return process.env.NEXT_PUBLIC_DEV_USER_ID ?? DEFAULT_DEV_USER_ID;
}
