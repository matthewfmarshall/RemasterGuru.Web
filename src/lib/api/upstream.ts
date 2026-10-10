import { auth0 } from "@/src/lib/auth0";
import { isAuth0Configured } from "@/src/lib/auth/config";
import { getApiBaseUrl, getDevUserId } from "./config";

/** Direct Kestrel URL for server-side proxy routes (not the public BFF base). */
export function getUpstreamApiBaseUrl(): string {
  const internal =
    process.env.API_INTERNAL_URL?.trim()
    ?? process.env.REMASTERGURU_API_URL?.trim();
  if (internal && internal.length > 0) {
    return internal.replace(/\/$/, "");
  }

  return getApiBaseUrl();
}

export async function getUpstreamApiHeaders(): Promise<Record<string, string>> {
  if (!isAuth0Configured()) {
    return { "X-User-Id": getDevUserId() };
  }

  const { token } = await auth0.getAccessToken();
  return { Authorization: `Bearer ${token}` };
}
