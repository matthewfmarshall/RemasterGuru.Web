/**
 * Public marketing prices and SKUs. Keep in sync with
 * `RemasterGuru.Api` → `Checkout/CheckoutProductCatalog.cs`
 * (amounts, SKUs, and included remaster credits).
 */
export const BOOK_PAGE_COUNT = 24;

export const MARKETING_PRODUCTS = {
  restoreBundle: {
    sku: "book-restore-bundle",
    displayName: "Restore bundle",
    priceUsd: 89,
    amountCents: 8900,
    includedPhotoRestorations: 8,
  },
  albumOnly: {
    sku: "book-album-only",
    displayName: "Album only",
    priceUsd: 59,
    amountCents: 5900,
    includedPhotoRestorations: 0,
  },
} as const;

export function formatMarketingPrice(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

/** Fallback when `GET /api/v1/checkout/products` is unavailable in dev. */
export const CHECKOUT_PRODUCT_FALLBACKS = [
  {
    sku: MARKETING_PRODUCTS.restoreBundle.sku,
    name: `${BOOK_PAGE_COUNT}-page hardcover + ${MARKETING_PRODUCTS.restoreBundle.includedPhotoRestorations} photo restorations`,
    description: "",
    amountCents: MARKETING_PRODUCTS.restoreBundle.amountCents,
    includedRemasterCredits:
      MARKETING_PRODUCTS.restoreBundle.includedPhotoRestorations,
  },
  {
    sku: MARKETING_PRODUCTS.albumOnly.sku,
    name: `${BOOK_PAGE_COUNT}-page hardcover (album only)`,
    description: "",
    amountCents: MARKETING_PRODUCTS.albumOnly.amountCents,
    includedRemasterCredits: 0,
  },
] as const;
