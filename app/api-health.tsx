"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/src/lib/api";

const apiUrl = getApiBaseUrl();

export function ApiHealth() {
  const healthUrl = `${apiUrl}/health`;
  const [healthLabel, setHealthLabel] = useState("loading…");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(healthUrl);
        if (cancelled) return;
        if (response.ok) {
          const body = (await response.json()) as { status?: string };
          setHealthLabel(body.status ?? JSON.stringify(body));
        } else {
          setHealthLabel(`HTTP ${response.status}`);
        }
      } catch {
        if (!cancelled) setHealthLabel("unreachable");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [healthUrl]);

  return (
    <p className="text-zinc-600">
      <a
        href={healthUrl}
        className="font-medium text-zinc-900 underline underline-offset-4"
      >
        API health
      </a>
      : {healthLabel}
    </p>
  );
}
