"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Alert, Card, Input } from "@/src/components/ui";
import {
  createDevApiClient,
  getApiBaseUrl,
  getDevUserId,
  type AssetDto,
  type UploadSessionResponse,
} from "@/src/lib/api";

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type UploadPhase =
  | "idle"
  | "session"
  | "uploading"
  | "registering"
  | "done";

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function normalizeContentType(file: File): string {
  if (file.type && ACCEPTED_TYPES.has(file.type)) {
    return file.type;
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return file.type || "application/octet-stream";
}

function isAcceptedImage(file: File): boolean {
  const contentType = normalizeContentType(file);
  return ACCEPTED_TYPES.has(contentType);
}

export function AlbumPhotoUpload({ albumId }: { albumId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progressLabel, setProgressLabel] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setError(null);
    setProgressLabel(null);

    if (isHeic(file)) {
      setError(
        "HEIC/HEIF is not supported in the browser uploader yet. Export as JPEG or PNG and try again.",
      );
      return;
    }

    if (!isAcceptedImage(file)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    const contentType = normalizeContentType(file);
    const client = createDevApiClient();

    setPhase("session");
    setProgressLabel("Creating upload session…");

    const sessionResult = await client.POST("/api/v1/assets/upload-sessions", {
      body: {
        albumId,
        fileName: file.name,
        contentType,
        byteSize: file.size,
      },
    });

    if (sessionResult.error || !sessionResult.response.ok) {
      setPhase("idle");
      setProgressLabel(null);
      setError(
        sessionResult.error
          ? `Could not reach the API at ${getApiBaseUrl()}.`
          : `Upload session failed (HTTP ${sessionResult.response.status}).`,
      );
      return;
    }

    const session = sessionResult.data as unknown as UploadSessionResponse;
    if (!session?.sessionId || !session.uploadUrl) {
      setPhase("idle");
      setProgressLabel(null);
      setError("Upload session response was incomplete.");
      return;
    }

    setPhase("uploading");
    setProgressLabel("Uploading file…");

    let putResponse: Response;
    try {
      putResponse = await fetch(session.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
          "X-User-Id": getDevUserId(),
        },
        body: file,
      });
    } catch {
      setPhase("idle");
      setProgressLabel(null);
      setError("Network error while uploading bytes to the API.");
      return;
    }

    if (!putResponse.ok) {
      setPhase("idle");
      setProgressLabel(null);
      setError(`Upload failed (HTTP ${putResponse.status}).`);
      return;
    }

    setPhase("registering");
    setProgressLabel("Registering photo…");

    const trimmedCaption = caption.trim();
    const registerResult = await client.POST(
      "/api/v1/albums/{albumId}/assets",
      {
        params: { path: { albumId } },
        body: {
          sessionId: session.sessionId,
          caption: trimmedCaption.length > 0 ? trimmedCaption : undefined,
        },
      },
    );

    if (registerResult.error || !registerResult.response.ok) {
      setPhase("idle");
      setProgressLabel(null);
      setError(
        registerResult.error
          ? "Could not register the uploaded photo."
          : `Register failed (HTTP ${registerResult.response.status}).`,
      );
      return;
    }

    const asset = registerResult.data as unknown as AssetDto | undefined;
    if (!asset?.id) {
      setPhase("idle");
      setProgressLabel(null);
      setError("Photo registered but no asset id was returned.");
      return;
    }

    setPhase("done");
    setProgressLabel("Upload complete.");
    setCaption("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    router.refresh();

    window.setTimeout(() => {
      setPhase("idle");
      setProgressLabel(null);
    }, 1500);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    void uploadFile(file);
  }

  const busy = phase !== "idle" && phase !== "done";

  return (
    <Card className="border-dashed bg-zinc-50/80">
      <div className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}
        {progressLabel ? (
          <Alert variant="info">{progressLabel}</Alert>
        ) : null}
        <div className="space-y-1.5">
          <label
            htmlFor="photo-caption"
            className="text-sm font-medium text-zinc-800"
          >
            Caption (optional)
          </label>
          <Input
            id="photo-caption"
            name="caption"
            placeholder="Grandma’s wedding, 1962"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            id="photo-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
            onChange={onFileChange}
            disabled={busy}
          />
          <p className="text-xs text-zinc-500">
            JPEG, PNG, or WebP. HEIC from iPhone must be converted first.
          </p>
        </div>
      </div>
    </Card>
  );
}
