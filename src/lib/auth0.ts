import { Auth0Client } from "@auth0/nextjs-auth0/server";
import {
  authCallbackErrorResponse,
  authCallbackSuccessResponse,
} from "@/src/lib/auth/auth-callback";
import { getAppBaseUrl, getAuth0Domain, isAuth0Configured } from "@/src/lib/auth/config";

const audience = process.env.AUTH0_AUDIENCE?.trim();

export const auth0 = new Auth0Client({
  domain: getAuth0Domain(),
  appBaseUrl: getAppBaseUrl(),
  authorizationParameters: audience ? { audience } : undefined,
  onCallback: async (error, ctx, session) => {
    if (error) {
      return authCallbackErrorResponse(error);
    }
    return authCallbackSuccessResponse(ctx);
  },
});

export function auth0MiddlewareEnabled(): boolean {
  return isAuth0Configured();
}
