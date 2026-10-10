import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AppHeader } from "@/src/components/app-header";
import { InstallPrompt } from "@/src/components/pwa/install-prompt";
import { isAuth0Configured } from "@/src/lib/auth/config";
import { auth0 } from "@/src/lib/auth0";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAuth0Configured()) {
    const session = await auth0.getSession();
    if (!session) {
      redirect("/auth/login?returnTo=/app/albums");
    }
  }
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
      <InstallPrompt />
    </div>
  );
}
