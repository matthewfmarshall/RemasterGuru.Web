"use client";

import { useEffect, useRef, useState } from "react";
import { assetDisplayImageUrl } from "@/src/lib/api/asset-display-image";
import type { AssetDto } from "@/src/lib/api/types";

type AlbumAssetThumbnailProps = {
  asset: AssetDto;
  alt: string;
};

export function AlbumAssetThumbnail({ asset, alt }: AlbumAssetThumbnailProps) {
  const activeRef = useRef(true);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, [asset.id]);

  if (broken) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-zinc-200 text-xs text-zinc-500"
        aria-hidden
      >
        Preview unavailable
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetDisplayImageUrl(asset)}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => {
        if (!activeRef.current) {
          return;
        }
        setBroken(true);
      }}
    />
  );
}
