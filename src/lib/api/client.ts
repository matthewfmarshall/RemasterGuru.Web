import createClient from "openapi-fetch";
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
  return createApiClient(getApiBaseUrl(), {
    "X-User-Id": getDevUserId(),
    ...extraHeaders,
  });
}
