/** Browser-safe restored image URL (Next.js dev proxy adds X-User-Id server-side). */
export function assetRestoredProxyUrl(assetId: string): string {
  return `/api/asset/${assetId}/restored`;
}
