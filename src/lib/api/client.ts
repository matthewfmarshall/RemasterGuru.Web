import createClient from "openapi-fetch";
import { isAuth0Configured } from "@/src/lib/auth/config";
import { getApiBaseUrl, getDevUserId } from "./config";
import type { paths } from "./schema";

export type ApiClient = ReturnType<typeof createClient<paths>>;

export function createApiClient(
  baseUrl: string,
  headers?: Record<string, string>,
): ApiClient {
  const normalized = baseUrl.replace(/\/$/, "");
  return createClient<paths>({
    baseUrl: normalized,
    headers,
  });
}

/**
 * Typed openapi-fetch client with `X-User-Id` from `NEXT_PUBLIC_DEV_USER_ID`.
 * Safe on server and in client components (env is inlined at build time).
 */
export function createDevApiClient(
  extraHeaders?: Record<string, string>,
): ApiClient {
  const headers: Record<string, string> = { ...extraHeaders };
  if (!isAuth0Configured()) {
    headers["X-User-Id"] = getDevUserId();
  }

  return createApiClient(getApiBaseUrl(), headers);
}

/** Browser / Client Components: same-origin BFF when Auth0 is on. */
export const createAppApiClient = createDevApiClient;
