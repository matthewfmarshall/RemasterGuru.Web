import { getApiBaseUrl, getDevUserId } from "@/src/lib/api/config";

/**
 * Dev proxy: forwards asset original bytes with server-side X-User-Id (img tags cannot send headers).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await context.params;
  const upstream = await fetch(
    `${getApiBaseUrl()}/api/v1/assets/${assetId}/original`,
    {
      headers: {
        "X-User-Id": getDevUserId(),
      },
      cache: "no-store",
    },
  );

  if (!upstream.ok) {
    if (process.env.NODE_ENV === "development") {
      const detail = await upstream.text().catch(() => "");
      console.error(
        "[RemasterGuru] Asset proxy upstream error",
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
