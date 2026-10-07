"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createApiClient } from "@/src/lib/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const devUserId =
  process.env.NEXT_PUBLIC_DEV_USER_ID ??
  "00000000-0000-4000-8000-000000000001";

export default function ApiCheckPage() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const client = createApiClient(apiUrl, { "X-User-Id": devUserId });

    async function load() {
      const { data, error, response } = await client.GET("/api/v1/credits/balance");
      if (cancelled) return;
      if (error || !response.ok) {
        setStatus("error");
        setDetail(
          error
            ? JSON.stringify(error)
            : `HTTP ${response.status} ${response.statusText}`,
        );
        return;
      }
      setStatus("ok");
      setDetail(JSON.stringify(data, null, 2));
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8">
      <Link href="/" className="text-sm text-zinc-600 underline underline-offset-4">
        ← Home
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">API check</h1>
      <p className="text-sm text-zinc-600">
        Typed <code className="rounded bg-zinc-100 px-1">GET /api/v1/credits/balance</code>{" "}
        via openapi-fetch ({apiUrl})
      </p>
      <p className="text-sm text-zinc-600">
        Dev user: <code className="rounded bg-zinc-100 px-1">{devUserId}</code>
      </p>
      <p className="font-medium text-zinc-900">
        Status:{" "}
        {status === "loading" ? "loading…" : status === "ok" ? "ok" : "error"}
      </p>
      {detail ? (
        <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100">
          {detail}
        </pre>
      ) : null}
    </main>
  );
}
