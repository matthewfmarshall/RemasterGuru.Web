import { OAuth2Error, SdkError } from "@auth0/nextjs-auth0/errors";
import type { OnCallbackContext } from "@auth0/nextjs-auth0/types";
import { NextResponse } from "next/server";
import { getAuthCallbackOAuthDetail } from "@/src/lib/auth/auth-callback-context";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isGenericOAuthMessage(message: string): boolean {
  return (
    message === "An error occurred during the authorization flow." ||
    message === "An error occurred while interacting with the authorization server."
  );
}

export function authCallbackErrorDetail(error: SdkError): {
  title: string;
  detail: string;
  code?: string;
} {
  const fromRequest = getAuthCallbackOAuthDetail();
  if (fromRequest?.description) {
    return {
      title: "Sign-in was denied by Auth0",
      detail: fromRequest.description,
      code: fromRequest.error ?? undefined,
    };
  }

  const cause = error.cause;
  if (cause instanceof OAuth2Error) {
    const detail = isGenericOAuthMessage(cause.message)
      ? (cause.code ?? "authorization_error")
      : cause.message;
    return {
      title: "Sign-in was denied by Auth0",
      detail,
      code: cause.code,
    };
  }
  if (cause instanceof Error && cause.message) {
    return {
      title: error.message,
      detail: cause.message,
      code: error.code,
    };
  }
  return {
    title: "Sign-in failed",
    detail: error.message,
    code: error.code,
  };
}

export function authCallbackErrorResponse(error: SdkError): NextResponse {
  const { title, detail, code } = authCallbackErrorDetail(error);
  console.error("[RemasterGuru] Auth0 callback failed", {
    code: error.code,
    message: error.message,
    detail,
    oauthCode: code,
  });

  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · Remaster Guru</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; color: #18181b; line-height: 1.5; max-width: 40rem; }
    h1 { font-size: 1.25rem; margin: 0 0 0.75rem; }
    p { margin: 0 0 1rem; }
    .detail { border: 1px solid #fecaca; background: #fef2f2; color: #7f1d1d; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; word-break: break-word; }
    a { color: #18181b; text-decoration: underline; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="detail">${escapeHtml(detail)}</p>
  <p>If you just created the Auth0 API, open <strong>Applications → APIs → Remaster Guru API → Application Access</strong> and enable <strong>Remaster Guru Web</strong> (Regular Web Application). See <code>docs/auth0-setup.md</code> in this repo.</p>
  <p><a href="/auth/login">Try sign-in again</a> · <a href="/">Home</a></p>
</body>
</html>`;

  return new NextResponse(body, {
    status: 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export function authCallbackSuccessResponse(ctx: OnCallbackContext): NextResponse {
  const appBaseUrl = ctx.appBaseUrl;
  if (!appBaseUrl) {
    throw new Error("appBaseUrl could not be resolved for the callback redirect.");
  }
  const destination = new URL(ctx.returnTo || "/app/albums", appBaseUrl);
  return NextResponse.redirect(destination);
}
