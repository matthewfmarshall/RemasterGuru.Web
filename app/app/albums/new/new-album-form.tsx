"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Input } from "@/src/components/ui";
import {
  createDevApiClient,
  getApiBaseUrl,
  type AlbumDto,
} from "@/src/lib/api";
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
      const client = createDevApiClient();
      const { data, error: apiError, response } = await client.POST(
        "/api/v1/albums",
        {
          body: {
            title: trimmed,
            templateId: templateId.trim() || DEFAULT_TEMPLATE,
          },
        },
      );

      const ok =
        response.ok || response.status === 201 || response.status === 200;
      if (apiError || !ok) {
        const apiBase = getApiBaseUrl();
        setError(
          apiError
            ? `Could not reach the API at ${apiBase}. Start RemasterGuru.Api (dotnet run) and confirm NEXT_PUBLIC_API_URL matches launchSettings (default ${apiBase}).`
            : `Could not create album (HTTP ${response.status})`,
        );
        return;
      }

      let album = data as unknown as AlbumDto | undefined;
      if (!album?.id) {
        try {
          album = (await response.clone().json()) as AlbumDto;
        } catch {
          /* fall through */
        }
      }

      const id = album?.id;
      if (!id) {
        setError("Album was created but no id was returned.");
        return;
      }

      markAlbumSaved();
      router.replace(`/app/albums/${id}`);
    } catch {
      const apiBase = getApiBaseUrl();
      setError(
        `Could not reach the API at ${apiBase}. Start RemasterGuru.Api (dotnet run) and use http://localhost:3000 (not 127.0.0.1) if the dev UI does not respond.`,
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
