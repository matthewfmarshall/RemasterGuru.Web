import type { NextRequest } from "next/server";
import { getUpstreamApiBaseUrl, getUpstreamApiHeaders } from "./upstream";

export async function proxyApiV1Request(
  request: NextRequest,
  pathSegments: string[],
): Promise<Response> {
  const upstreamBase = getUpstreamApiBaseUrl();
  const path = `/api/v1/${pathSegments.join("/")}`;
  const target = new URL(path, `${upstreamBase}/`);
  target.search = request.nextUrl.search;

  const headers = new Headers(await getUpstreamApiHeaders());
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const method = request.method.toUpperCase();
  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
