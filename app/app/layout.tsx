import { Suspense } from "react";
import { AppAuthGate } from "./app-auth-gate";
import { AppHeader } from "@/src/components/app-header";
import { InstallPrompt } from "@/src/components/pwa/install-prompt";
import AppSectionLoading from "./loading";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Suspense fallback={<AppSectionLoading />}>
          <AppAuthGate>{children}</AppAuthGate>
        </Suspense>
      </div>
      <InstallPrompt />
    </div>
  );
}
