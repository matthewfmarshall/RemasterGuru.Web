import type { NextRequest } from "next/server";
import { isAuth0Configured } from "@/src/lib/auth/config";
import { proxyApiV1Request } from "@/src/lib/api/proxy-handler";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: RouteContext) {
  if (!isAuth0Configured()) {
    return new Response("API BFF proxy requires Auth0 configuration.", {
      status: 404,
    });
  }

  const { path } = await context.params;
  return proxyApiV1Request(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
