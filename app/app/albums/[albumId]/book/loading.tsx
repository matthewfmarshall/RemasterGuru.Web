export default function AlbumBookLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
          <div className="h-28 animate-pulse rounded-xl bg-zinc-200" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}
