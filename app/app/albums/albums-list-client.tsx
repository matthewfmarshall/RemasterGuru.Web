"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AlbumDto } from "@/src/lib/api";
import { AlbumDeleteButton } from "./album-delete-button";

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

type AlbumsListClientProps = {
  initialAlbums: AlbumDto[];
};

export function AlbumsListClient({ initialAlbums }: AlbumsListClientProps) {
  const router = useRouter();
  const [albums, setAlbums] = useState(initialAlbums);

  return (
    <ul className="space-y-3">
      {albums.map((album) => (
        <li key={album.id}>
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/app/albums/${album.id}`}
              className="min-w-0 flex-1 transition hover:opacity-90"
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
            <AlbumDeleteButton
              albumId={album.id}
              albumTitle={album.title}
              variant="secondary"
              label="Delete"
              className="shrink-0"
              onDeleted={() => {
                setAlbums((prev) => prev.filter((a) => a.id !== album.id));
                router.refresh();
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
