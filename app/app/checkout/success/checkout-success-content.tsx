"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui";
import { createDevApiClient } from "@/src/lib/api/client";

type OrderSummary = {
  id: string;
  albumId: string;
  status: string;
  labOrderId?: string | null;
  trackingUrl?: string | null;
};

function formatOrderStatus(status: string): string {
  return status.replace(/_/g, " ");
}

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("albumId");
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!albumId) {
      return;
    }

    let cancelled = false;
    const client = createDevApiClient();

    async function loadOrder() {
      const { data, error } = await client.GET("/api/v1/orders");
      if (cancelled) {
        return;
      }
      if (error) {
        setOrderError("Could not load order status.");
        return;
      }

      const list = (data ?? []) as OrderSummary[];
      const match = list
        .filter((o) => o.albumId === albumId)
        .sort((a, b) => b.id.localeCompare(a.id))[0];
      if (match) {
        setOrder(match);
        setOrderError(null);
      }
    }

    void loadOrder();
    const interval = window.setInterval(() => void loadOrder(), 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [albumId]);

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Payment received
        </h1>
        <p className="text-sm text-zinc-600">
          Thanks! Your order is recorded. Credits and album status update after
          the Stripe webhook runs (use `stripe listen` locally).
        </p>
        {order ? (
          <p className="text-sm text-zinc-700">
            Print order status:{" "}
            <span className="font-medium capitalize">
              {formatOrderStatus(order.status)}
            </span>
            {order.labOrderId ? (
              <span className="block text-xs text-zinc-500">
                Lab ref: {order.labOrderId}
              </span>
            ) : null}
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                className="mt-1 block text-sm text-zinc-900 underline"
                target="_blank"
                rel="noreferrer"
              >
                Track shipment
              </a>
            ) : null}
          </p>
        ) : orderError ? (
          <p className="text-sm text-amber-800">{orderError}</p>
        ) : albumId ? (
          <p className="text-sm text-zinc-500">Loading order status…</p>
        ) : null}
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
