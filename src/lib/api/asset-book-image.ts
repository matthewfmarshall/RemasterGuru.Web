import type { AssetDto } from "./types";
import { assetDisplayImageUrl } from "./asset-display-image";

/** Book page thumbnails use the same display preference as the album grid. */
export function assetBookImageUrl(asset: AssetDto): string {
  return assetDisplayImageUrl(asset);
}
