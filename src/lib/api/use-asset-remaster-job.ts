"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDevApiClient,
  type RemasterJobDto,
} from "@/src/lib/api";
import { readApiProblemMessage } from "@/src/lib/api/problem-detail";

export type RemasterPreset = "damage" | "fade" | "conservative";

function isInFlight(status: string): boolean {
  return status === "queued" || status === "running";
}

type UseAssetRemasterJobOptions = {
  assetId: string;
  onSucceeded?: () => void;
};

export function useAssetRemasterJob({
  assetId,
  onSucceeded,
}: UseAssetRemasterJobOptions) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<RemasterJobDto | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const pollJob = useCallback(
    (jobId: string) => {
      stopPolling();
      const client = createDevApiClient();

      pollRef.current = setInterval(async () => {
        const result = await client.GET("/api/v1/remaster-jobs/{jobId}", {
          params: { path: { jobId } },
        });
        if (result.error || !result.response.ok) {
          setError(
            await readApiProblemMessage(
              result.response,
              "Lost connection while checking remaster status.",
            ),
          );
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
            onSucceeded?.();
          }
          if (dto.status === "failed") {
            setError(dto.error ?? "Remaster failed.");
          }
        }
      }, 1500);
    },
    [onSucceeded, stopPolling],
  );

  const startRemaster = useCallback(
    async (preset: RemasterPreset) => {
      setError(null);
      setBusy(true);
      setJob(null);

      const client = createDevApiClient();
      const result = await client.POST("/api/v1/assets/{assetId}/remaster-jobs", {
        params: { path: { assetId } },
        body: {
          preset,
          targetResolution: "1k",
        },
      });

      if (result.response.status === 402) {
        setError(
          await readApiProblemMessage(
            result.response,
            "Insufficient credits for this remaster.",
          ),
        );
        setBusy(false);
        return;
      }

      if (result.error || !result.response.ok) {
        setError(
          await readApiProblemMessage(
            result.response,
            "Could not start remaster.",
          ),
        );
        setBusy(false);
        return;
      }

      const dto = result.data as unknown as RemasterJobDto;
      setJob(dto);
      if (isInFlight(dto.status)) {
        pollJob(dto.id);
      } else {
        setBusy(false);
        if (dto.status === "succeeded") {
          onSucceeded?.();
        }
      }
    },
    [assetId, onSucceeded, pollJob],
  );

  return { busy, error, job, startRemaster };
}
