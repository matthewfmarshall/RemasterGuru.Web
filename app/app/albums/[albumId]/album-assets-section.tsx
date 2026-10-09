"use client";

import { useEffect, useState } from "react";
import { Alert, Card } from "@/src/components/ui";
import type { AssetDto } from "@/src/lib/api";
import { AlbumDangerZone } from "../album-danger-zone";
import { AlbumAssetCard } from "./album-asset-card";

type AlbumAssetsSectionProps = {
  albumId: string;
  albumTitle: string;
  initialAssets: AssetDto[];
  assetsLoadError?: string | null;
  fallbackPhotoCount?: number;
};

export function AlbumAssetsSection({
  albumId,
  albumTitle,
  initialAssets,
  assetsLoadError = null,
  fallbackPhotoCount = 0,
}: AlbumAssetsSectionProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [albumDeleted, setAlbumDeleted] = useState(false);

  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  if (albumDeleted) {
    return null;
  }

  const photoCount =
    assetsLoadError ? fallbackPhotoCount : assets.length;

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Photos</h2>
        {assetsLoadError ? (
          <Alert variant="error">{assetsLoadError}</Alert>
        ) : assets.length === 0 ? (
          <Card>
            <p className="text-sm text-zinc-600">
              No photos in this album yet. Use the uploader below to add your
              first image.
            </p>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <li key={asset.id}>
                <AlbumAssetCard
                  albumId={albumId}
                  asset={asset}
                  onDeleted={() => {
                    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <AlbumDangerZone
        albumId={albumId}
        albumTitle={albumTitle}
        photoCount={photoCount}
        onPhotosPurged={() => setAssets([])}
        onAlbumDeleted={() => setAlbumDeleted(true)}
      />
    </>
  );
}
