import { Alert, ButtonLink, Card } from "@/src/components/ui";
import { AlbumsListClient } from "./albums-list-client";
import {
  catchNetworkFailure,
  createDevApiClient,
  type AlbumDto,
} from "@/src/lib/api";

async function loadAlbums(): Promise<
  { ok: true; albums: AlbumDto[] } | { ok: false; message: string }
> {
  const client = createDevApiClient();
  const network = await catchNetworkFailure(() => client.GET("/api/v1/albums"));
  if (!network.ok) {
    return { ok: false, message: network.message };
  }
  const { data, error, response } = network.result;
  if (error || !response.ok) {
    return {
      ok: false,
      message: error
        ? "Failed to load albums. Is the API running?"
        : `Failed to load albums (HTTP ${response.status})`,
    };
  }
  const albums = (data ?? []) as unknown as AlbumDto[];
  return { ok: true, albums };
}

export async function AlbumsList() {
  const result = await loadAlbums();

  if (!result.ok) {
    return <Alert variant="error">{result.message}</Alert>;
  }

  if (result.albums.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-zinc-700">You do not have any albums yet.</p>
        <p className="mt-2 text-sm text-zinc-500">
          Create one to start adding photos and ordering a printed book.
        </p>
        <div className="mt-4">
          <ButtonLink href="/app/albums/new">Create your first album</ButtonLink>
        </div>
      </Card>
    );
  }

  return <AlbumsListClient initialAlbums={result.albums} />;
}
