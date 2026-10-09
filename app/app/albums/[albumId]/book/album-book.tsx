import { notFound } from "next/navigation";
import { Alert } from "@/src/components/ui";
import {
  catchNetworkFailure,
  createDevApiClient,
  type AlbumDto,
  type AlbumLayoutResponse,
  type PrintReadinessResponse,
} from "@/src/lib/api";
import { AlbumBookEditor } from "./album-book-editor";

export type AlbumBookInitialData = {
  album: AlbumDto;
  layout: AlbumLayoutResponse;
  printReadiness: PrintReadinessResponse;
};

async function loadBookData(albumId: string) {
  const client = createDevApiClient();

  const albumNetwork = await catchNetworkFailure(() =>
    client.GET("/api/v1/albums/{albumId}", {
      params: { path: { albumId } },
    }),
  );
  if (!albumNetwork.ok) {
    return { kind: "error" as const, message: albumNetwork.message };
  }
  const albumResult = albumNetwork.result;
  if (albumResult.response.status === 404) {
    return { kind: "not_found" as const };
  }
  if (albumResult.error || !albumResult.response.ok) {
    return {
      kind: "error" as const,
      message: "Failed to load album.",
    };
  }

  const layoutNetwork = await catchNetworkFailure(() =>
    client.GET("/api/v1/albums/{albumId}/layout", {
      params: { path: { albumId } },
    }),
  );
  if (!layoutNetwork.ok) {
    return { kind: "error" as const, message: layoutNetwork.message };
  }
  const layoutResult = layoutNetwork.result;
  if (layoutResult.error || !layoutResult.response.ok) {
    return {
      kind: "error" as const,
      message: "Failed to load album layout.",
    };
  }

  const readinessNetwork = await catchNetworkFailure(() =>
    client.GET("/api/v1/albums/{albumId}/print-readiness", {
      params: { path: { albumId } },
    }),
  );
  if (!readinessNetwork.ok) {
    return { kind: "error" as const, message: readinessNetwork.message };
  }
  const readinessResult = readinessNetwork.result;
  if (readinessResult.error || !readinessResult.response.ok) {
    return {
      kind: "error" as const,
      message: "Failed to load print readiness.",
    };
  }

  const albumPayload = albumResult.data as unknown as { album: AlbumDto };
  return {
    kind: "ok" as const,
    data: {
      album: albumPayload.album,
      layout: layoutResult.data as unknown as AlbumLayoutResponse,
      printReadiness:
        readinessResult.data as unknown as PrintReadinessResponse,
    },
  };
}

export async function AlbumBook({ albumId }: { albumId: string }) {
  const result = await loadBookData(albumId);

  if (result.kind === "not_found") {
    notFound();
  }

  if (result.kind === "error") {
    return <Alert variant="error">{result.message}</Alert>;
  }

  return <AlbumBookEditor albumId={albumId} initial={result.data} />;
}
