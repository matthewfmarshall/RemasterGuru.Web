import { Suspense } from "react";
import { AlbumBook } from "./album-book";
import AlbumBookLoading from "./loading";

export default async function AlbumBookPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  return (
    <Suspense fallback={<AlbumBookLoading />}>
      <AlbumBook albumId={albumId} />
    </Suspense>
  );
}
