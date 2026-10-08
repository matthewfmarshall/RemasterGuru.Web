import type { AssetDto } from "./types";
import { assetRestoredProxyUrl } from "./asset-restored";
import { assetThumbnailProxyUrl } from "./asset-thumbnail";

export function assetHasRestoredVersion(asset: AssetDto): boolean {
  return asset.versions.some((v) => v.kind === "restored");
}

/** Album grid and book preview: honor API displayVersion, fall back to original. */
export function assetDisplayImageUrl(asset: AssetDto): string {
  if (asset.displayVersion === "restored" && assetHasRestoredVersion(asset)) {
    return assetRestoredProxyUrl(asset.id);
  }
  return assetThumbnailProxyUrl(asset.id);
}
