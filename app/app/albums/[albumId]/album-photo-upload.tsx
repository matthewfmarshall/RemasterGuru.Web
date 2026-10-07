"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
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

const MAX_FILES_PER_BATCH = 50;

type FileQueueStatus = "pending" | "uploading" | "done" | "failed";

type QueuedFile = {
  id: string;
  file: File;
  status: FileQueueStatus;
  error?: string;
};

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

function queueItemId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

type UploadOneResult =
  | { ok: true; asset: AssetDto }
  | { ok: false; error: string };

async function uploadOneFile(
  albumId: string,
  file: File,
  caption: string,
): Promise<UploadOneResult> {
  if (isHeic(file)) {
    return {
      ok: false,
      error:
        "HEIC/HEIF is not supported in the browser uploader yet. Export as JPEG or PNG and try again.",
    };
  }

  if (!isAcceptedImage(file)) {
    return { ok: false, error: "Choose a JPEG, PNG, or WebP image." };
  }

  const contentType = normalizeContentType(file);
  const client = createDevApiClient();

  const sessionResult = await client.POST("/api/v1/assets/upload-sessions", {
    body: {
      albumId,
      fileName: file.name,
      contentType,
      byteSize: file.size,
    },
  });

  if (sessionResult.error || !sessionResult.response.ok) {
    return {
      ok: false,
      error: sessionResult.error
        ? `Could not reach the API at ${getApiBaseUrl()}.`
        : `Upload session failed (HTTP ${sessionResult.response.status}).`,
    };
  }

  const session = sessionResult.data as unknown as UploadSessionResponse;
  if (!session?.sessionId || !session.uploadUrl) {
    return { ok: false, error: "Upload session response was incomplete." };
  }

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
    return { ok: false, error: "Network error while uploading bytes to the API." };
  }

  if (!putResponse.ok) {
    return { ok: false, error: `Upload failed (HTTP ${putResponse.status}).` };
  }

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
    return {
      ok: false,
      error: registerResult.error
        ? "Could not register the uploaded photo."
        : `Register failed (HTTP ${registerResult.response.status}).`,
    };
  }

  const asset = registerResult.data as unknown as AssetDto | undefined;
  if (!asset?.id) {
    return { ok: false, error: "Photo registered but no asset id was returned." };
  }

  return { ok: true, asset };
}

function statusLabel(status: FileQueueStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "uploading":
      return "Uploading…";
    case "done":
      return "Done";
    case "failed":
      return "Failed";
  }
}

export function AlbumPhotoUpload({ albumId }: { albumId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const updateQueueItem = useCallback(
    (id: string, patch: Partial<Pick<QueuedFile, "status" | "error">>) => {
      setQueue((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const processQueue = useCallback(
    async (initialQueue: QueuedFile[]) => {
      if (processingRef.current) return;
      processingRef.current = true;
      setIsProcessing(true);
      setError(null);

      const trimmedCaption = caption;

      for (let i = 0; i < initialQueue.length; i++) {
        const item = initialQueue[i];
        if (item.status !== "pending") continue;

        setActiveIndex(i + 1);
        updateQueueItem(item.id, { status: "uploading", error: undefined });

        const result = await uploadOneFile(albumId, item.file, trimmedCaption);

        if (result.ok) {
          updateQueueItem(item.id, { status: "done" });
          router.refresh();
        } else {
          updateQueueItem(item.id, {
            status: "failed",
            error: result.error,
          });
        }
      }

      processingRef.current = false;
      setIsProcessing(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      window.setTimeout(() => {
        setQueue((prev) => {
          const remaining = prev.filter((q) => q.status === "pending");
          if (remaining.length === 0 && prev.every((q) => q.status !== "uploading")) {
            return [];
          }
          return prev;
        });
        setActiveIndex(0);
      }, 2500);
    },
    [albumId, caption, router, updateQueueItem],
  );

  function validateAndEnqueue(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    if (files.length > MAX_FILES_PER_BATCH) {
      setError(
        `You can upload at most ${MAX_FILES_PER_BATCH} photos at once. Select fewer files and try again.`,
      );
      return;
    }

    const heicNames: string[] = [];
    const invalidNames: string[] = [];
    const accepted: File[] = [];

    for (const file of files) {
      if (isHeic(file)) {
        heicNames.push(file.name);
        continue;
      }
      if (!isAcceptedImage(file)) {
        invalidNames.push(file.name);
        continue;
      }
      accepted.push(file);
    }

    const messages: string[] = [];
    if (heicNames.length > 0) {
      messages.push(
        heicNames.length === 1
          ? `${heicNames[0]} is HEIC/HEIF and was not queued. Export as JPEG or PNG and try again.`
          : `${heicNames.length} HEIC/HEIF file(s) were not queued. Export as JPEG or PNG and try again.`,
      );
    }
    if (invalidNames.length > 0) {
      messages.push(
        invalidNames.length === 1
          ? `${invalidNames[0]} is not a supported image type.`
          : `${invalidNames.length} file(s) are not JPEG, PNG, or WebP and were not queued.`,
      );
    }

    if (accepted.length === 0) {
      setError(messages.join(" "));
      return;
    }

    setError(messages.length > 0 ? messages.join(" ") : null);

    const newItems: QueuedFile[] = accepted.map((file) => ({
      id: queueItemId(file),
      file,
      status: "pending",
    }));

    setQueue(newItems);
    setActiveIndex(0);
    void processQueue(newItems);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list?.length) return;
    validateAndEnqueue(list);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setDragActive(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isProcessing) return;
    if (e.dataTransfer.files?.length) {
      validateAndEnqueue(e.dataTransfer.files);
    }
  }

  const total = queue.length;
  const showProgress = isProcessing && total > 0;
  const currentName =
    showProgress && activeIndex > 0
      ? queue[activeIndex - 1]?.file.name
      : null;
  const busy = isProcessing;

  return (
    <Card className="border-dashed bg-zinc-50/80">
      <div className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}
        {showProgress ? (
          <Alert variant="info">
            <p className="font-medium">
              Uploading {activeIndex} of {total}
            </p>
            {currentName ? (
              <p className="mt-1 text-sm opacity-90">{currentName}</p>
            ) : null}
          </Alert>
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
          <p className="text-xs text-zinc-500">
            Applied to every photo in this batch.
          </p>
        </div>
        <div
          className={`space-y-2 rounded-lg border-2 border-dashed p-4 transition-colors ${
            dragActive
              ? "border-zinc-900 bg-zinc-100/80"
              : "border-transparent"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            id="photo-file"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-800"
            onChange={onFileChange}
            disabled={busy}
          />
          <p className="text-xs text-zinc-500">
            JPEG, PNG, or WebP — select multiple or drag files here. HEIC from
            iPhone must be converted first. Up to {MAX_FILES_PER_BATCH} per
            batch.
          </p>
        </div>
        {queue.length > 0 ? (
          <ul
            className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 text-sm"
            aria-label="Upload queue"
          >
            {queue.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 rounded px-2 py-1.5 odd:bg-zinc-50"
              >
                <span
                  className="min-w-0 truncate text-zinc-800"
                  title={item.file.name}
                >
                  {item.file.name}
                </span>
                <span className="shrink-0 text-right">
                  <span
                    className={
                      item.status === "done"
                        ? "text-green-700"
                        : item.status === "failed"
                          ? "text-red-700"
                          : item.status === "uploading"
                            ? "text-zinc-900 font-medium"
                            : "text-zinc-500"
                    }
                  >
                    {statusLabel(item.status)}
                  </span>
                  {item.error ? (
                    <span className="mt-0.5 block max-w-[14rem] text-xs text-red-600">
                      {item.error}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Card>
  );
}
