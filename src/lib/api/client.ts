import createClient from "openapi-fetch";
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
