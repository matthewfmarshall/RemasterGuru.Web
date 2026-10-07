import Link from "next/link";
import { Alert, ButtonLink, Card } from "@/src/components/ui";
import { createDevApiClient, type AlbumDto } from "@/src/lib/api";

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

async function loadAlbums(): Promise<
  { ok: true; albums: AlbumDto[] } | { ok: false; message: string }
> {
  const client = createDevApiClient();
  const { data, error, response } = await client.GET("/api/v1/albums");
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

  return (
    <ul className="space-y-3">
      {result.albums.map((album) => (
        <li key={album.id}>
          <Link
            href={`/app/albums/${album.id}`}
            className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-zinc-900">{album.title}</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
                {formatStatus(album.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Template: {album.templateId}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
