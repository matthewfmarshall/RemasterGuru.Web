"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackToAlbumsLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export function BackToAlbumsLink({
  className = "text-sm text-zinc-600 underline underline-offset-4",
  children = "← Albums",
}: BackToAlbumsLinkProps) {
  const router = useRouter();

  return (
    <Link
      href="/app/albums"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        router.push("/app/albums");
        router.refresh();
      }}
    >
      {children}
    </Link>
  );
}
