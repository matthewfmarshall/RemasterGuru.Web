import Link from "next/link";
import {
  catchNetworkFailure,
  type CreditsBalanceDto,
} from "@/src/lib/api";
import { createServerAppApiClient } from "@/src/lib/api/server-client";
import { isAuth0Configured } from "@/src/lib/auth/config";
import { auth0 } from "@/src/lib/auth0";

async function loadCredits(): Promise<
  { ok: true; data: CreditsBalanceDto } | { ok: false; message: string }
> {
  const client = await createServerAppApiClient();
  const network = await catchNetworkFailure(() =>
    client.GET("/api/v1/credits/balance"),
  );
  if (!network.ok) {
    return { ok: false, message: network.message };
  }
  const { data, error, response } = network.result;
  if (error || !response.ok) {
    return {
      ok: false,
      message: error
        ? "Could not load credits"
        : `Credits unavailable (${response.status})`,
    };
  }
  return { ok: true, data: data as unknown as CreditsBalanceDto };
}

export async function AppHeader() {
  const credits = await loadCredits();
  const authEnabled = isAuth0Configured();
  const session = authEnabled ? await auth0.getSession() : null;

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-900"
          >
            Remaster Guru
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href="/app/albums"
              className="font-medium text-zinc-700 hover:text-zinc-900"
            >
              Albums
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-600">
          {credits.ok ? (
            <span>
              Credits:{" "}
              <span className="font-semibold text-zinc-900">
                {credits.data.balance}
              </span>
            </span>
          ) : (
            <span className="text-amber-800" title={credits.message}>
              Credits: —
            </span>
          )}
          {authEnabled ? (
            session ? (
              <a
                href="/auth/logout"
                className="font-medium text-zinc-700 hover:text-zinc-900"
              >
                Log out
              </a>
            ) : (
              <a
                href="/auth/login?returnTo=/app/albums"
                className="font-medium text-zinc-700 hover:text-zinc-900"
              >
                Log in
              </a>
            )
          ) : null}
        </div>
      </div>
    </header>
  );
}
