"use client";

import { assetDisplayImageUrl } from "@/src/lib/api/asset-display-image";
import type { AssetDto } from "@/src/lib/api/types";

type AlbumAssetThumbnailProps = {
  asset: AssetDto;
  alt: string;
};

export function AlbumAssetThumbnail({ asset, alt }: AlbumAssetThumbnailProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetDisplayImageUrl(asset)}
      alt={alt}
      className="h-full w-full object-cover"
      onError={(e) => {
        if (process.env.NODE_ENV !== "development") return;
        const img = e.currentTarget;
        console.error(
          "[RemasterGuru] Thumbnail failed to load",
          { assetId: asset.id, src: img.src },
        );
      }}
    />
  );
}
