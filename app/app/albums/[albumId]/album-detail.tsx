import Link from "next/link";
import { notFound } from "next/navigation";
import { BackToAlbumsLink } from "../back-to-albums-link";
import { Alert } from "@/src/components/ui";
import { AlbumPhotoUpload } from "./album-photo-upload";
import {
  catchNetworkFailure,
  createDevApiClient,
  type AlbumDetailResponse,
  type AssetDto,
} from "@/src/lib/api";
import { AlbumCheckoutCta } from "@/src/components/checkout/album-checkout-cta";
import { AlbumTitleEditor } from "../album-title-editor";
import { AlbumAssetsSection } from "./album-assets-section";

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

async function loadAlbum(albumId: string) {
  const client = createDevApiClient();
  const network = await catchNetworkFailure(() =>
    client.GET("/api/v1/albums/{albumId}", {
      params: { path: { albumId } },
    }),
  );
  if (!network.ok) {
    return { kind: "error" as const, message: network.message };
  }
  const { data, error, response } = network.result;
  if (response.status === 404) {
    return { kind: "not_found" as const };
  }
  if (error || !response.ok) {
    return {
      kind: "error" as const,
      message: error
        ? "Failed to load album."
        : `Failed to load album (HTTP ${response.status})`,
    };
  }
  return {
    kind: "ok" as const,
    detail: data as unknown as AlbumDetailResponse,
  };
}

async function loadAssets(albumId: string) {
  const client = createDevApiClient();
  const network = await catchNetworkFailure(() =>
    client.GET("/api/v1/albums/{albumId}/assets", {
      params: { path: { albumId } },
    }),
  );
  if (!network.ok) {
    return { ok: false as const, message: network.message };
  }
  const { data, error, response } = network.result;
  if (error || !response.ok) {
    return {
      ok: false as const,
      message: error
        ? "Failed to load photos."
        : `Failed to load photos (HTTP ${response.status})`,
    };
  }
  return {
    ok: true as const,
    assets: (data ?? []) as unknown as AssetDto[],
  };
}

export async function AlbumDetail({ albumId }: { albumId: string }) {
  const albumResult = await loadAlbum(albumId);

  if (albumResult.kind === "not_found") {
    notFound();
  }

  if (albumResult.kind === "error") {
    return <Alert variant="error">{albumResult.message}</Alert>;
  }

  const { album } = albumResult.detail;
  const assetsResult = await loadAssets(albumId);

  return (
    <div className="space-y-8">
      <div>
        <BackToAlbumsLink />
        <div className="mt-3">
          <AlbumTitleEditor albumId={albumId} initialTitle={album.title} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/app/albums/${albumId}/book`}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Edit book
          </Link>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-zinc-500">Status</dt>
            <dd className="font-medium capitalize text-zinc-900">
              {formatStatus(album.status)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Template</dt>
            <dd className="font-medium text-zinc-900">{album.templateId}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Updated</dt>
            <dd className="font-medium text-zinc-900">
              {new Date(album.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </div>

      <AlbumCheckoutCta albumId={albumId} albumStatus={album.status} />

      <AlbumAssetsSection
        albumId={albumId}
        albumTitle={album.title}
        initialAssets={assetsResult.ok ? assetsResult.assets : []}
        assetsLoadError={assetsResult.ok ? null : assetsResult.message}
        fallbackPhotoCount={albumResult.detail.pageSummary.assetCount}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Upload photos</h2>
        <AlbumPhotoUpload albumId={albumId} />
      </section>
    </div>
  );
}
