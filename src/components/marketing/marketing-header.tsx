"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "#proof", label: "Examples" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur supports-[backdrop-filter]:bg-stone-50/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-stone-900"
        >
          Remaster Guru
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex"
          aria-label="Main"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/app/albums"
            className="hidden rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-amber-50 shadow-sm transition hover:bg-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 sm:inline-flex"
          >
            Start your book
          </Link>
          <button
            type="button"
            className="inline-flex rounded-lg border border-stone-300 p-2 text-stone-700 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-marketing-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-marketing-nav"
          className="border-t border-stone-200 bg-stone-50 px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2 text-sm font-medium text-stone-800">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-lg px-2 py-2 hover:bg-stone-100"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/app/albums"
                className="mt-2 block rounded-lg bg-amber-800 px-4 py-2 text-center font-semibold text-amber-50"
                onClick={() => setOpen(false)}
              >
                Start your book
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
