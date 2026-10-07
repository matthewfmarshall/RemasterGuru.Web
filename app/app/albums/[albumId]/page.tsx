import { Suspense } from "react";
import { AlbumDetail } from "./album-detail";
import AlbumDetailLoading from "./loading";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params;

  return (
    <Suspense fallback={<AlbumDetailLoading />}>
      <AlbumDetail albumId={albumId} />
    </Suspense>
  );
}
