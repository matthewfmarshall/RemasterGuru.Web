import Link from "next/link";
import { ApiHealth } from "./api-health";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Remaster Guru</h1>
      <ApiHealth />
      <Link
        href="/dev/api-check"
        className="text-sm font-medium text-zinc-900 underline underline-offset-4"
      >
        Typed API check (credits balance)
      </Link>
    </main>
  );
}
