import { Suspense } from "react";
import { AppHeader } from "@/src/components/app-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Suspense
        fallback={
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-3 text-sm text-zinc-500 sm:px-6">
              Loading…
            </div>
          </header>
        }
      >
        <AppHeader />
      </Suspense>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
