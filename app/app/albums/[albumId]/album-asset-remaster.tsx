"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button } from "@/src/components/ui";
import {
  assetRestoredProxyUrl,
  assetThumbnailProxyUrl,
  createDevApiClient,
  type AssetDto,
  type CreditsBalanceDto,
} from "@/src/lib/api";

type RemasterPreset = "damage" | "fade" | "conservative";
type TargetResolution = "1k" | "2k";

type RemasterJobDto = {
  id: string;
  assetId: string;
  status: string;
  preset: string;
  creditCharged: boolean;
  resultVersionId: string | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
};

function hasRestoredVersion(asset: AssetDto): boolean {
  return asset.versions.some((v) => v.kind === "restored");
}

function statusLabel(status: string): string {
  switch (status) {
    case "queued":
      return "Queued…";
    case "running":
      return "Remastering…";
    case "succeeded":
      return "Done";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function AlbumAssetRemaster({ asset }: { asset: AssetDto }) {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(false);
  const [preset, setPreset] = useState<RemasterPreset>("damage");
  const [targetResolution, setTargetResolution] =
    useState<TargetResolution>("1k");
  const [credits, setCredits] = useState<CreditsBalanceDto | null>(null);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [job, setJob] = useState<RemasterJobDto | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [compareMode, setCompareMode] = useState<"split" | "original" | "restored">(
    "split",
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restoredAvailable = useMemo(() => hasRestoredVersion(asset), [asset]);

  const loadCredits = useCallback(async () => {
    setCreditsError(null);
    const client = createDevApiClient();
    const result = await client.GET("/api/v1/credits/balance");
    if (result.error || !result.response.ok) {
      setCreditsError("Could not load credit balance.");
      return;
    }
    setCredits(result.data as unknown as CreditsBalanceDto);
  }, []);

  useEffect(() => {
    if (panelOpen) {
      void loadCredits();
    }
  }, [panelOpen, loadCredits]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const pollJob = useCallback(
    (jobId: string) => {
      stopPolling();
      const client = createDevApiClient();

      pollRef.current = setInterval(async () => {
        const result = await client.GET("/api/v1/remaster-jobs/{jobId}", {
          params: { path: { jobId } },
        });
        if (result.error || !result.response.ok) {
          setSubmitError("Lost connection while checking remaster status.");
          stopPolling();
          setBusy(false);
          return;
        }

        const dto = result.data as unknown as RemasterJobDto;
        setJob(dto);

        if (dto.status === "succeeded" || dto.status === "failed") {
          stopPolling();
          setBusy(false);
          if (dto.status === "succeeded") {
            router.refresh();
          }
        }
      }, 1500);
    },
    [router],
  );

  async function grantDevCredits() {
    setCreditsError(null);
    const client = createDevApiClient();
    const result = await client.POST("/api/v1/credits/grants", {
      body: { amount: 5, reason: "grant" },
    });
    if (result.error || !result.response.ok) {
      setCreditsError(
        result.response.status === 403
          ? "Dev credit grants are only available when the API runs in Development."
          : `Could not grant credits (HTTP ${result.response.status}).`,
      );
      return;
    }
    await loadCredits();
  }

  async function startRemaster() {
    setSubmitError(null);
    setBusy(true);
    setJob(null);

    const client = createDevApiClient();
    const result = await client.POST("/api/v1/assets/{assetId}/remaster-jobs", {
      params: { path: { assetId: asset.id } },
      body: {
        preset,
        targetResolution,
      },
    });

    if (result.response.status === 402) {
      setSubmitError("Insufficient credits for this remaster.");
      setBusy(false);
      return;
    }

    if (result.error || !result.response.ok) {
      setSubmitError(
        result.error
          ? "Could not start remaster."
          : `Remaster failed (HTTP ${result.response.status}).`,
      );
      setBusy(false);
      return;
    }

    const dto = result.data as unknown as RemasterJobDto;
    setJob(dto);
    void loadCredits();
    pollJob(dto.id);
  }

  const creditHint = credits
    ? credits.freeTasteUsed
      ? `${credits.balance} credit${credits.balance === 1 ? "" : "s"} available`
      : "First 1K remaster is free"
    : null;

  return (
    <div className="space-y-3 p-4 pt-0">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          className="text-xs"
          onClick={() => setPanelOpen((v) => !v)}
          disabled={busy}
        >
          {panelOpen ? "Close" : "Remaster"}
        </Button>
        {restoredAvailable ? (
          <span className="text-xs font-medium text-green-700">Restored</span>
        ) : null}
      </div>

      {panelOpen ? (
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          {submitError ? <Alert variant="error">{submitError}</Alert> : null}
          {creditsError ? <Alert variant="error">{creditsError}</Alert> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-zinc-800">Preset</span>
              <select
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                value={preset}
                onChange={(e) => setPreset(e.target.value as RemasterPreset)}
                disabled={busy}
              >
                <option value="damage">Damage repair</option>
                <option value="fade">Fade recovery</option>
                <option value="conservative">Conservative</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-zinc-800">Resolution</span>
              <select
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
                value={targetResolution}
                onChange={(e) =>
                  setTargetResolution(e.target.value as TargetResolution)
                }
                disabled={busy}
              >
                <option value="1k">1K (free taste eligible)</option>
                <option value="2k">2K (uses credits)</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
            {creditHint ? <span>{creditHint}</span> : <span />}
            <button
              type="button"
              className="underline underline-offset-2 hover:text-zinc-900"
              onClick={() => void grantDevCredits()}
              disabled={busy}
            >
              Need credits?
            </button>
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={() => void startRemaster()}
            disabled={busy}
          >
            {busy ? "Working…" : "Start remaster"}
          </Button>

          {job ? (
            <p className="text-sm text-zinc-700">
              Job {statusLabel(job.status)}
              {job.error ? (
                <span className="mt-1 block text-red-700">{job.error}</span>
              ) : null}
            </p>
          ) : null}
        </div>
      ) : null}

      {restoredAvailable || job?.status === "succeeded" ? (
        <div className="space-y-2">
          <div className="flex gap-1 text-xs">
            {(["split", "original", "restored"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`rounded px-2 py-1 capitalize ${
                  compareMode === mode
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-200 text-zinc-800"
                }`}
                onClick={() => setCompareMode(mode)}
              >
                {mode === "split" ? "Side by side" : mode}
              </button>
            ))}
          </div>
          {compareMode === "split" ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500">Original</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-zinc-100">
                  <Image
                    src={assetThumbnailProxyUrl(asset.id)}
                    alt="Original"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500">Restored</p>
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-zinc-100">
                  <Image
                    src={assetRestoredProxyUrl(asset.id)}
                    alt="Restored"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[4/3] overflow-hidden rounded bg-zinc-100">
              <Image
                src={
                  compareMode === "original"
                    ? assetThumbnailProxyUrl(asset.id)
                    : assetRestoredProxyUrl(asset.id)
                }
                alt={compareMode === "original" ? "Original" : "Restored"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
