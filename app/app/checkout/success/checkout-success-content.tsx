"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/src/components/ui";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const sessionId = searchParams.get("session_id");

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Payment received
        </h1>
        <p className="text-sm text-zinc-600">
          Thanks! Your order is recorded. When Stripe webhooks are configured,
          credits and album status update automatically after checkout.
        </p>
        {sessionId ? (
          <p className="text-xs text-zinc-500">Session: {sessionId}</p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {albumId ? (
            <Link
              href={`/app/albums/${albumId}`}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Back to album
            </Link>
          ) : null}
          <Link
            href="/app/albums"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
          >
            All albums
          </Link>
        </div>
      </Card>
    </div>
  );
}
