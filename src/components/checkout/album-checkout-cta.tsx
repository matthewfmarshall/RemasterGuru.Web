"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card } from "@/src/components/ui";
import { createDevApiClient } from "@/src/lib/api";
import type { CheckoutProductDto } from "@/src/lib/api/types";
import { CHECKOUT_PRODUCT_FALLBACKS } from "@/src/lib/marketing/pricing";

type AlbumCheckoutCtaProps = {
  albumId: string;
  albumStatus: string;
  className?: string;
};

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function AlbumCheckoutCta({
  albumId,
  albumStatus,
  className,
}: AlbumCheckoutCtaProps) {
  const [products, setProducts] = useState<CheckoutProductDto[]>([]);
  const [loadingSku, setLoadingSku] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ready = albumStatus === "ready_for_print";

  useEffect(() => {
    if (!ready) {
      return;
    }
    const client = createDevApiClient();
    void client.GET("/api/v1/checkout/products").then((result) => {
      if (!result.error && result.response.ok && Array.isArray(result.data)) {
        setProducts(result.data as CheckoutProductDto[]);
      }
    });
  }, [ready]);

  const startCheckout = useCallback(
    async (productSku: string) => {
      setError(null);
      setLoadingSku(productSku);
      const client = createDevApiClient();
      const result = await client.POST("/api/v1/checkout/sessions", {
        body: {
          albumId,
          productSku,
          shippingCountry: "US",
        },
      });
      setLoadingSku(null);
      if (result.error || !result.response.ok) {
        setError(
          "Could not start checkout. Confirm Stripe keys are set on the API.",
        );
        return;
      }
      const payload = result.data as unknown as {
        sessionId?: string;
        url?: string;
      };
      if (payload?.url) {
        window.location.href = payload.url;
        return;
      }
      setError("Checkout session did not return a redirect URL.");
    },
    [albumId],
  );

  if (!ready) {
    return null;
  }

  return (
    <Card className={className ?? "space-y-4"}>
      <div>
        <h2 className="text-base font-semibold text-zinc-900">Checkout</h2>
        <p className="mt-1 text-sm text-zinc-600">
          US shipping only. Pay with Stripe test mode, then we queue your book
          for RPI fulfillment.
        </p>
      </div>
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {(products.length > 0 ? products : [...CHECKOUT_PRODUCT_FALLBACKS]).map(
          (product) => (
          <div
            key={product.sku}
            className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4"
          >
            <p className="text-sm font-medium text-zinc-900">{product.name}</p>
            <p className="text-lg font-semibold text-zinc-900">
              {formatUsd(product.amountCents)}
            </p>
            {product.includedRemasterCredits > 0 ? (
              <p className="text-xs text-zinc-500">
                Includes {product.includedRemasterCredits} remaster credits
              </p>
            ) : (
              <p className="text-xs text-zinc-500">No remaster credits</p>
            )}
            <Button
              className="mt-auto w-full"
              disabled={loadingSku !== null}
              onClick={() => void startCheckout(product.sku)}
            >
              {loadingSku === product.sku ? "Redirecting…" : "Checkout"}
            </Button>
          </div>
        ),
        )}
      </div>
    </Card>
  );
}
