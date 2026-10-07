import Link from "next/link";
import { Card } from "@/src/components/ui";

export default function AlbumNotFound() {
  return (
    <Card className="text-center">
      <h1 className="text-lg font-semibold text-zinc-900">Album not found</h1>
      <p className="mt-2 text-sm text-zinc-600">
        This album does not exist or you do not have access to it.
      </p>
      <Link
        href="/app/albums"
        className="mt-4 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4"
      >
        Back to albums
      </Link>
    </Card>
  );
}
