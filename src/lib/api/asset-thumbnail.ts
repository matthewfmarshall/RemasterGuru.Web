/** Browser-safe thumbnail URL (Next.js dev proxy adds X-User-Id server-side). */
export function assetThumbnailProxyUrl(assetId: string): string {
  return `/api/asset/${assetId}`;
}
