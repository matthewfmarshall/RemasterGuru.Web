"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Input } from "@/src/components/ui";
import { createAlbumAction } from "./create-album-action";
import { markAlbumSaved } from "@/src/lib/pwa/storage";

const DEFAULT_TEMPLATE = "hardcover-24";

export function NewAlbumForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createAlbumAction({
        title: trimmed,
        templateId: templateId.trim() || DEFAULT_TEMPLATE,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      markAlbumSaved();
      router.replace(`/app/albums/${result.albumId}`);
    } catch {
      setError(
        "Could not create album. Refresh and try again, or confirm RemasterGuru.Api is running.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <Alert variant="error">{error}</Alert> : null}
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium text-zinc-800">
            Title
          </label>
          <Input
            id="title"
            placeholder="Summer 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="templateId"
            className="text-sm font-medium text-zinc-800"
          >
            Template
          </label>
          <Input
            id="templateId"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            disabled={submitting}
          />
          <p className="text-xs text-zinc-500">
            Default hardcover 24-page layout ({DEFAULT_TEMPLATE}).
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create album"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
