"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button } from "@/src/components/ui";
import { ConfirmDialog } from "@/src/components/ui/confirm-dialog";
import { createDevApiClient } from "@/src/lib/api";
import { readApiProblemMessage } from "@/src/lib/api/problem-detail";

type AlbumDeleteButtonProps = {
  albumId: string;
  albumTitle: string;
  /** After delete from detail page, navigate to albums list. */
  redirectToList?: boolean;
  /** Called after successful delete when staying on the list page. */
  onDeleted?: () => void;
  className?: string;
  variant?: "secondary" | "ghost" | "danger";
  label?: string;
};

export function AlbumDeleteButton({
  albumId,
  albumTitle,
  redirectToList = false,
  onDeleted,
  className = "",
  variant = "danger",
  label = "Delete album",
}: AlbumDeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    setBusy(true);
    setError(null);
    const client = createDevApiClient();
    const result = await client.DELETE("/api/v1/albums/{albumId}", {
      params: { path: { albumId } },
    });
    setBusy(false);
    if (result.error || !result.response.ok) {
      const message = await readApiProblemMessage(
        result.response,
        "Could not delete album.",
      );
      setError(message);
      return;
    }
    setOpen(false);
    onDeleted?.();
    if (redirectToList) {
      router.push("/app/albums");
      router.refresh();
      return;
    }
    router.refresh();
  }

  return (
    <>
      {error ? (
        <div className="mb-2">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete album?"
        description={
          <>
            This permanently removes <strong>{albumTitle}</strong> from your
            account. Photos and book layout for this album will no longer be
            available.
          </>
        }
        confirmLabel="Delete album"
        destructive
        busy={busy}
        onCancel={() => setOpen(false)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
}
