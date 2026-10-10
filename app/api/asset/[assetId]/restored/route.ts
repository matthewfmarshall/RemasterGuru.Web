import { getUpstreamApiBaseUrl, getUpstreamApiHeaders } from "@/src/lib/api/upstream";

/**
 * Dev proxy: forwards active restored asset bytes with server-side X-User-Id.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await context.params;
  const upstream = await fetch(
    `${getUpstreamApiBaseUrl()}/api/v1/assets/${assetId}/restored`,
    {
      headers: await getUpstreamApiHeaders(),
      cache: "no-store",
    },
  );

  if (!upstream.ok) {
    if (process.env.NODE_ENV === "development") {
      const detail = await upstream.text().catch(() => "");
      console.error(
        "[RemasterGuru] Restored asset proxy upstream error",
        { assetId, status: upstream.status, detail: detail.slice(0, 500) },
      );
    }
    return new Response(upstream.statusText || "Upstream error", {
      status: upstream.status,
    });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/octet-stream";

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=120",
    },
  });
}
