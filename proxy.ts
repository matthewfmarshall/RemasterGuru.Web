import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithAuthCallbackOAuthDetail } from "@/src/lib/auth/auth-callback-context";
import { auth0, auth0MiddlewareEnabled } from "@/src/lib/auth0";

export async function proxy(request: NextRequest) {
  if (!auth0MiddlewareEnabled()) {
    return NextResponse.next();
  }

  const oauthDetail =
    request.nextUrl.pathname === "/auth/callback"
      ? (() => {
          const description = request.nextUrl.searchParams.get("error_description");
          if (!description) {
            return undefined;
          }
          return {
            error: request.nextUrl.searchParams.get("error"),
            description,
          };
        })()
      : undefined;

  return runWithAuthCallbackOAuthDetail(oauthDetail, () => auth0.middleware(request));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons/).*)",
  ],
};
