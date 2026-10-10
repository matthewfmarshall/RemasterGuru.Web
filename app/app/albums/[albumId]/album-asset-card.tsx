"use client";

import { Card } from "@/src/components/ui";
import type { AssetDto } from "@/src/lib/api";
import { AlbumAssetDelete } from "../album-asset-delete";
import { AlbumAssetRemaster } from "./album-asset-remaster";
import { AlbumAssetThumbnail } from "./album-asset-thumbnail";
import { PastBookLimitBadge } from "@/src/components/albums/past-book-limit-badge";

type AlbumAssetCardProps = {
  albumId: string;
  asset: AssetDto;
  pastBookLimit?: boolean;
  onDeleted?: () => void;
};

export function AlbumAssetCard({
  albumId,
  asset,
  pastBookLimit = false,
  onDeleted,
}: AlbumAssetCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative aspect-[4/3] bg-zinc-100">
        <AlbumAssetThumbnail
          asset={asset}
          alt={asset.caption ?? "Album photo"}
        />
        {pastBookLimit ? (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 pt-6">
            <PastBookLimitBadge className="max-w-full text-[11px] leading-snug" />
          </div>
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        {asset.caption ? (
          <p className="text-sm font-medium text-zinc-900">{asset.caption}</p>
        ) : (
          <p className="text-sm text-zinc-500">No caption</p>
        )}
        {asset.original?.contentType ? (
          <p className="text-xs text-zinc-500">
            {asset.original.contentType}
            {asset.original.width && asset.original.height
              ? ` · ${asset.original.width}×${asset.original.height}`
              : null}
          </p>
        ) : null}
        <AlbumAssetDelete
          albumId={albumId}
          assetId={asset.id}
          onDeleted={onDeleted}
        />
      </div>
      <AlbumAssetRemaster asset={asset} />
    </Card>
  );
}
