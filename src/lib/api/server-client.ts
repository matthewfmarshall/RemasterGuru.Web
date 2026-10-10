import { isAuth0Configured } from "@/src/lib/auth/config";
import { createApiClient, createDevApiClient, type ApiClient } from "./client";
import { getUpstreamApiBaseUrl, getUpstreamApiHeaders } from "./upstream";

/**
 * Server Components: dev `X-User-Id` or Bearer token from Auth0 (direct
 * upstream URL; avoids cookie-less self-fetch to the BFF).
 */
export async function createServerAppApiClient(
  extraHeaders?: Record<string, string>,
): Promise<ApiClient> {
  if (!isAuth0Configured()) {
    return createDevApiClient(extraHeaders);
  }

  const headers = { ...(await getUpstreamApiHeaders()), ...extraHeaders };
  return createApiClient(getUpstreamApiBaseUrl(), headers);
}
