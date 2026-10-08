"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/src/components/ui";

export function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Checkout cancelled
        </h1>
        <p className="text-sm text-zinc-600">
          No charge was made. You can return to your album and try again when
          you are ready.
        </p>
        <div className="flex flex-wrap gap-3">
          {albumId ? (
            <>
              <Link
                href={`/app/albums/${albumId}/book`}
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              >
                Back to book
              </Link>
              <Link
                href={`/app/albums/${albumId}`}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900"
              >
                Album detail
              </Link>
            </>
          ) : (
            <Link
              href="/app/albums"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Albums
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
