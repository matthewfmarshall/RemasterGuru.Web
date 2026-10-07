import type { AssetDto } from "./types";
import { assetRestoredProxyUrl } from "./asset-restored";
import { assetThumbnailProxyUrl } from "./asset-thumbnail";

/** Prefer active restored version for book preview; otherwise original thumbnail. */
export function assetBookImageUrl(asset: AssetDto): string {
  const active = asset.activeVersionId
    ? asset.versions.find((v) => v.id === asset.activeVersionId)
    : undefined;
  if (active?.kind === "restored") {
    return assetRestoredProxyUrl(asset.id);
  }
  const hasRestored = asset.versions.some((v) => v.kind === "restored");
  if (hasRestored && !asset.activeVersionId) {
    return assetRestoredProxyUrl(asset.id);
  }
  return assetThumbnailProxyUrl(asset.id);
}
