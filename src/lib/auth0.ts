import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { getAppBaseUrl, getAuth0Domain, isAuth0Configured } from "@/src/lib/auth/config";

const audience = process.env.AUTH0_AUDIENCE?.trim();

export const auth0 = new Auth0Client({
  domain: getAuth0Domain(),
  appBaseUrl: getAppBaseUrl(),
  authorizationParameters: audience ? { audience } : undefined,
});

export function auth0MiddlewareEnabled(): boolean {
  return isAuth0Configured();
}
