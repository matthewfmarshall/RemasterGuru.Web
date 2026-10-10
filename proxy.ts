import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0, auth0MiddlewareEnabled } from "@/src/lib/auth0";

export async function proxy(request: NextRequest) {
  if (!auth0MiddlewareEnabled()) {
    return NextResponse.next();
  }

  return auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons/).*)",
  ],
};
