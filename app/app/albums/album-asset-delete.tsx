"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/components/ui";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import {
  setSkipAssetDeleteConfirm,
  shouldSkipAssetDeleteConfirm,
} from "@/src/lib/album-asset-delete-confirm";
import { createDevApiClient } from "@/src/lib/api";
import { readApiProblemMessage } from "@/src/lib/api/problem-detail";

type AlbumAssetDeleteProps = {
  albumId: string;
  assetId: string;
  label?: string;
  className?: string;
  onDeleted?: () => void;
};

export function AlbumAssetDelete({
  albumId,
  assetId,
  label = "Remove photo",
  className = "",
  onDeleted,
}: AlbumAssetDeleteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAsset() {
    setBusy(true);
    setError(null);
    const client = createDevApiClient();
    const result = await client.DELETE("/api/v1/assets/{assetId}", {
      params: { path: { assetId } },
    });
    setBusy(false);
    if (result.error || !result.response.ok) {
      const message = await readApiProblemMessage(
        result.response,
        "Could not remove photo.",
      );
      setError(message);
      return;
    }
    if (skipConfirm) {
      setSkipAssetDeleteConfirm(albumId, true);
    }
    setOpen(false);
    onDeleted?.();
    router.refresh();
  }

  function handleClick() {
    if (shouldSkipAssetDeleteConfirm(albumId)) {
      void deleteAsset();
      return;
    }
    setSkipConfirm(false);
    setOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className={`text-red-700 hover:bg-red-50 ${className}`}
        disabled={busy}
        onClick={handleClick}
      >
        {busy ? "Removing…" : label}
      </Button>
      {error ? (
        <p className="mt-1 text-xs text-red-700" role="alert">{error}</p>
      ) : null}
      <ConfirmDialog
        open={open}
        title="Remove this photo?"
        description={
          <>
            <p>This photo will be removed from the album and book layout.</p>
            <label className="mt-3 flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                className="rounded border-zinc-300"
                checked={skipConfirm}
                onChange={(e) => setSkipConfirm(e.target.checked)}
              />
              Don&apos;t ask again for this album
            </label>
          </>
        }
        confirmLabel="Remove photo"
        destructive
        busy={busy}
        onCancel={() => setOpen(false)}
        onConfirm={() => void deleteAsset()}
      />
    </>
  );
}
