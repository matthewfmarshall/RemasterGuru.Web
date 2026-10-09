import { Suspense } from "react";
import { ButtonLink } from "@/src/components/ui";
import { AlbumsAccountCredits } from "./albums-account-credits";
import { AlbumsList } from "./albums-list";
import AlbumsLoading from "./loading";

export default function AlbumsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Albums
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Photo books you are building with Remaster Guru.
          </p>
          <Suspense fallback={null}>
            <AlbumsAccountCredits />
          </Suspense>
        </div>
        <ButtonLink href="/app/albums/new">New album</ButtonLink>
      </div>

      <Suspense fallback={<AlbumsLoading />}>
        <AlbumsList />
      </Suspense>
    </div>
  );
}
