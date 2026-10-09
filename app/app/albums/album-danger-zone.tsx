"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card } from "@/src/components/ui";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { AlbumDeleteButton } from "./album-delete-button";
import { createDevApiClient } from "@/src/lib/api";
import { readApiProblemMessage } from "@/src/lib/api/problem-detail";

type AlbumDangerZoneProps = {
  albumId: string;
  albumTitle: string;
  photoCount: number;
  onPhotosPurged?: () => void;
  onAlbumDeleted?: () => void;
};

export function AlbumDangerZone({
  albumId,
  albumTitle,
  photoCount,
  onPhotosPurged,
  onAlbumDeleted,
}: AlbumDangerZoneProps) {
  const router = useRouter();
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [purgeBusy, setPurgeBusy] = useState(false);
  const [purgeError, setPurgeError] = useState<string | null>(null);

  async function confirmPurge() {
    setPurgeBusy(true);
    setPurgeError(null);
    const client = createDevApiClient();
    const result = await client.DELETE("/api/v1/albums/{albumId}/assets", {
      params: { path: { albumId } },
    });
    setPurgeBusy(false);
    if (result.error || !result.response.ok) {
      const message = await readApiProblemMessage(
        result.response,
        "Could not remove photos.",
      );
      setPurgeError(message);
      return;
    }
    setPurgeOpen(false);
    onPhotosPurged?.();
    router.refresh();
  }

  return (
    <Card className="border-red-100 bg-red-50/30">
      <h2 className="text-base font-semibold text-zinc-900">Album settings</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Destructive actions for <strong>{albumTitle}</strong>. Your album title
        and template stay unless you delete the whole album.
      </p>

      {purgeError ? (
        <div className="mt-3">
          <Alert variant="error">{purgeError}</Alert>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="secondary"
          disabled={photoCount === 0}
          onClick={() => setPurgeOpen(true)}
        >
          Remove all photos
        </Button>
        <AlbumDeleteButton
          albumId={albumId}
          albumTitle={albumTitle}
          redirectToList
          label="Delete album"
          onDeleted={onAlbumDeleted}
        />
      </div>

      <ConfirmDialog
        open={purgeOpen}
        title="Remove all photos?"
        description={
          <>
            This deletes every photo in <strong>{albumTitle}</strong> and resets
            your book layout. The album itself stays so you can upload again from
            scratch.
          </>
        }
        confirmLabel="Remove all photos"
        destructive
        busy={purgeBusy}
        onCancel={() => setPurgeOpen(false)}
        onConfirm={() => void confirmPurge()}
      />
    </Card>
  );
}
