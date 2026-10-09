"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Input } from "@/src/components/ui";
import { createDevApiClient, type AlbumDto } from "@/src/lib/api";
import { readApiProblemMessage } from "@/src/lib/api/problem-detail";

type AlbumTitleEditorProps = {
  albumId: string;
  initialTitle: string;
};

export function AlbumTitleEditor({ albumId, initialTitle }: AlbumTitleEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [savedTitle, setSavedTitle] = useState(initialTitle);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function saveTitle() {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required.");
      return;
    }
    if (trimmed === savedTitle) {
      setEditing(false);
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(null);
    const client = createDevApiClient();
    const result = await client.PATCH("/api/v1/albums/{albumId}", {
      params: { path: { albumId } },
      body: { title: trimmed },
    });
    setBusy(false);
    if (result.error || !result.response.ok) {
      const message = await readApiProblemMessage(
        result.response,
        "Could not update album title.",
      );
      setError(message);
      return;
    }
    const updated = result.data as unknown as AlbumDto;
    const nextTitle = updated.title ?? trimmed;
    setSavedTitle(nextTitle);
    setTitle(nextTitle);
    setEditing(false);
    setSuccess("Album title saved.");
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {savedTitle}
          </h1>
          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1 text-sm"
            onClick={() => {
              setEditing(true);
              setSuccess(null);
              setError(null);
            }}
          >
            Edit title
          </Button>
        </div>
        {success ? <Alert variant="info">{success}</Alert> : null}
      </div>
    );
  }

  return (
    <form
      className="max-w-md space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        void saveTitle();
      }}
    >
      <label className="block text-sm font-medium text-zinc-800" htmlFor="album-title">
        Album title
      </label>
      <Input
        id="album-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={busy}
        autoFocus
      />
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => {
            setTitle(savedTitle);
            setEditing(false);
            setError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
