"use client";

import { assetThumbnailProxyUrl } from "@/src/lib/api/asset-thumbnail";

type AlbumAssetThumbnailProps = {
  assetId: string;
  alt: string;
};

export function AlbumAssetThumbnail({ assetId, alt }: AlbumAssetThumbnailProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetThumbnailProxyUrl(assetId)}
      alt={alt}
      className="h-full w-full object-cover"
      onError={(e) => {
        if (process.env.NODE_ENV !== "development") return;
        const img = e.currentTarget;
        console.error(
          "[RemasterGuru] Thumbnail failed to load",
          { assetId, src: img.src },
        );
      }}
    />
  );
}
