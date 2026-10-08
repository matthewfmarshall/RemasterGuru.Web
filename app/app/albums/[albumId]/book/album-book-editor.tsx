"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Alert, Button, Card, Input } from "@/src/components/ui";
import {
  createDevApiClient,
  type AssetDto,
  type PrintReadinessResponse,
} from "@/src/lib/api";
import { assetBookImageUrl } from "@/src/lib/api/asset-book-image";
import type { AlbumBookInitialData } from "./page";
import { AlbumCheckoutCta } from "@/src/components/checkout/album-checkout-cta";

type AlbumBookEditorProps = {
  albumId: string;
  initial: AlbumBookInitialData;
};

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) {
    return items;
  }
  const next = [...items];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

function warningsForAsset(
  readiness: PrintReadinessResponse,
  assetId: string,
): PrintReadinessResponse["warnings"] {
  return readiness.warnings.filter((w) => w.assetId === assetId);
}

export function AlbumBookEditor({ albumId, initial }: AlbumBookEditorProps) {
  const router = useRouter();
  const [album, setAlbum] = useState(initial.album);
  const [layout, setLayout] = useState(initial.layout);
  const [printReadiness, setPrintReadiness] = useState(initial.printReadiness);
  const [assets, setAssets] = useState<AssetDto[]>(initial.layout.assets);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const pageCount = layout.pageCount;
  const previewSlots = useMemo(() => {
    const slots: Array<AssetDto | null> = [];
    for (let i = 0; i < pageCount; i++) {
      slots.push(assets[i] ?? null);
    }
    return slots;
  }, [assets, pageCount]);

  const persistLayout = useCallback(
    async (ordered: AssetDto[]) => {
      setBusy(true);
      setError(null);
      const client = createDevApiClient();
      const result = await client.PATCH("/api/v1/albums/{albumId}/layout", {
        params: { path: { albumId } },
        body: { orderedAssetIds: ordered.map((a) => a.id) },
      });
      setBusy(false);
      if (result.error || !result.response.ok) {
        setError("Could not save page order.");
        return false;
      }
      const payload = result.data as unknown as typeof layout;
      setLayout(payload);
      setAssets(payload.assets);
      router.refresh();
      return true;
    },
    [albumId, layout, router],
  );

  const refreshPrintReadiness = useCallback(async () => {
    const client = createDevApiClient();
    const result = await client.GET("/api/v1/albums/{albumId}/print-readiness", {
      params: { path: { albumId } },
    });
    if (!result.error && result.response.ok) {
      setPrintReadiness(result.data as unknown as PrintReadinessResponse);
    }
  }, [albumId]);

  const moveAsset = async (index: number, direction: -1 | 1) => {
    const next = moveItem(assets, index, index + direction);
    setAssets(next);
    const ok = await persistLayout(next);
    if (!ok) {
      setAssets(assets);
    } else {
      await refreshPrintReadiness();
    }
  };

  const saveCaption = async (assetId: string, caption: string) => {
    setError(null);
    const client = createDevApiClient();
    const result = await client.PATCH("/api/v1/assets/{assetId}", {
      params: { path: { assetId } },
      body: { caption },
    });
    if (result.error || !result.response.ok) {
      setError("Could not save caption.");
      return;
    }
    const updated = result.data as unknown as AssetDto;
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, caption: updated.caption } : a)),
    );
  };

  const markReadyForPrint = async () => {
    setBusy(true);
    setError(null);
    setStatusMessage(null);
    const client = createDevApiClient();
    const result = await client.PATCH("/api/v1/albums/{albumId}", {
      params: { path: { albumId } },
      body: { status: "ready_for_print" },
    });
    setBusy(false);
    if (result.error || !result.response.ok) {
      setError("Could not update album status.");
      return;
    }
    const updated = result.data as unknown as typeof album;
    setAlbum(updated);
    setStatusMessage("Album marked ready for print.");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/app/albums/${albumId}`}
          className="text-sm text-zinc-600 underline underline-offset-4"
        >
          ← Back to album
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          Album book
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          {album.title} · {layout.templateId} · {layout.slotsFilled} of{" "}
          {layout.pageCount} pages filled
        </p>
        <p className="mt-1 text-sm capitalize text-zinc-500">
          Status: {album.status.replace(/_/g, " ")}
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
      {statusMessage ? (
        <Alert variant="info">{statusMessage}</Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Page order</h2>
            {assets.length === 0 ? (
              <Card>
                <p className="text-sm text-zinc-600">
                  Upload photos on the album page, then return here to arrange
                  your book.
                </p>
              </Card>
            ) : (
              <ul className="space-y-3">
                {assets.map((asset, index) => {
                  const assetWarnings = warningsForAsset(printReadiness, asset.id);
                  return (
                    <li key={asset.id}>
                      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={assetBookImageUrl(asset)}
                            alt={asset.caption ?? `Page ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-zinc-900">
                              Page {index + 1}
                            </p>
                            <div className="flex gap-1">
                              <Button
                                variant="secondary"
                                className="px-2 py-1 text-xs"
                                disabled={busy || index === 0}
                                onClick={() => void moveAsset(index, -1)}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="secondary"
                                className="px-2 py-1 text-xs"
                                disabled={busy || index === assets.length - 1}
                                onClick={() => void moveAsset(index, 1)}
                              >
                                ↓
                              </Button>
                            </div>
                          </div>
                          <label className="block text-xs text-zinc-500">
                            Caption
                            <Input
                              className="mt-1"
                              value={asset.caption ?? ""}
                              placeholder="Add a caption for this page"
                              onChange={(e) => {
                                const value = e.target.value;
                                setAssets((prev) =>
                                  prev.map((a) =>
                                    a.id === asset.id
                                      ? { ...a, caption: value }
                                      : a,
                                  ),
                                );
                              }}
                              onBlur={(e) =>
                                void saveCaption(asset.id, e.target.value)
                              }
                            />
                          </label>
                          {assetWarnings.length > 0 ? (
                            <ul className="space-y-1 text-xs text-amber-800">
                              {assetWarnings.map((w) => (
                                <li key={`${w.code}-${w.message}`}>{w.message}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Preview</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {previewSlots.map((asset, index) => (
                <div
                  key={`page-${index}`}
                  className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[3/4] bg-zinc-100">
                    {asset ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={assetBookImageUrl(asset)}
                        alt={asset.caption ?? `Page ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                        Empty
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 p-2">
                    <p className="text-xs font-medium text-zinc-700">
                      Page {index + 1}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {asset?.caption?.trim() ? asset.caption : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <Card className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900">
              Print readiness
            </h2>
            {printReadiness.softPhotoCount > 0 ? (
              <p className="text-sm text-amber-800">
                {printReadiness.softPhotoCount} photo
                {printReadiness.softPhotoCount === 1 ? "" : "s"} may look soft
                at full page.
              </p>
            ) : (
              <p className="text-sm text-zinc-600">
                No resolution warnings for your current photos.
              </p>
            )}
            <p className="text-xs text-zinc-500">
              Full-page prints look best at{" "}
              {printReadiness.minLongEdgePx}px or more on the long edge.
            </p>
            {printReadiness.warnings.length > 0 ? (
              <ul className="max-h-64 space-y-2 overflow-y-auto text-xs">
                {printReadiness.warnings.map((w) => (
                  <li
                    key={`${w.assetId}-${w.code}`}
                    className={
                      w.severity === "error"
                        ? "text-red-700"
                        : "text-amber-800"
                    }
                  >
                    {w.message}
                  </li>
                ))}
              </ul>
            ) : null}
            <Button
              className="w-full"
              disabled={busy || album.status === "ready_for_print"}
              onClick={() => void markReadyForPrint()}
            >
              {album.status === "ready_for_print"
                ? "Ready for print"
                : "Mark ready for print"}
            </Button>
          </Card>
          <AlbumCheckoutCta albumId={albumId} albumStatus={album.status} />
        </aside>
      </div>
    </div>
  );
}
