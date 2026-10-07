import Link from "next/link";
import { NewAlbumForm } from "./new-album-form";

export default function NewAlbumPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          href="/app/albums"
          className="text-sm text-zinc-600 underline underline-offset-4"
        >
          ← Albums
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          New album
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Give your book a title. You can add photos on the next screen.
        </p>
      </div>
      <NewAlbumForm />
    </div>
  );
}
