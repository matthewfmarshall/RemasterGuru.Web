import Link from "next/link";
import { BeforeAfterCompare } from "@/src/components/marketing/before-after-compare";
import { MarketingFaq } from "@/src/components/marketing/marketing-faq";
import { MarketingHeader } from "@/src/components/marketing/marketing-header";
import { getAvailableGalleryProofs } from "@/src/lib/marketing/available-proof-examples";
import {
  FEATURED_PROOF,
  HERO_PROOF,
} from "@/src/lib/marketing/proof-examples";
import {
  BOOK_PAGE_COUNT,
  formatMarketingPrice,
  MARKETING_PRODUCTS,
} from "@/src/lib/marketing/pricing";

const steps = [
  {
    title: "Upload",
    body:
      "Add photos from your phone, scanner, or computer. We keep the original file.",
  },
  {
    title: "Restore or remaster (optional)",
    body:
      "Repair tears, fading, and cracks — or uplift older low-res scans for sharper prints. Skip either step and use your files as-is; crop and brighten in the browser anytime.",
  },
  {
    title: "Caption & layout",
    body:
      "Add names, dates, and stories. Pick a simple album template that fits your family.",
  },
  {
    title: "Print & ship",
    body:
      "Approve a proof, checkout, and we print and mail your hardcover book.",
  },
];

const contrast = [
  {
    title: "Restore-only apps",
    lines: [
      "You get a fixed file, then you are on your own.",
      "No book, no captions, no print path.",
      "Export and re-upload somewhere else.",
    ],
  },
  {
    title: "Photo book sites",
    lines: [
      "Beautiful layouts, weak on old damage.",
      "Auto-brighten is not tear repair.",
      "You figure out DPI and softness yourself.",
    ],
  },
  {
    title: "Remaster Guru",
    lines: [
      "Repair damage and remaster older scans for print.",
      "Captions and print in one flow.",
      "Print-ready checks before you pay.",
    ],
    highlight: true,
  },
];

export default function MarketingHome() {
  const galleryProofs = getAvailableGalleryProofs();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <MarketingHeader />

      <main>
        <section className="border-b border-stone-200/80 bg-gradient-to-b from-amber-50/40 to-stone-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div>
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
                Repair, remaster, and print the photos that matter.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-stone-700">
                Upload old prints and scans. Fix tears, fading, and cracks — or
                uplift low-res files for sharper spreads — then caption your
                story. We print and ship.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/app/albums"
                  className="inline-flex rounded-lg bg-amber-800 px-5 py-3 text-sm font-semibold text-amber-50 shadow-sm transition hover:bg-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  Start your book
                </Link>
                <a
                  href="#proof"
                  className="text-sm font-semibold text-amber-900 underline decoration-amber-700/40 underline-offset-4 hover:decoration-amber-700"
                >
                  See before &amp; after
                </a>
              </div>
              <p className="mt-6 text-sm text-stone-600">
                Originals always kept · You approve every restore · Printed in the
                USA · US shipping only for now
              </p>
            </div>
            <BeforeAfterCompare
              className="mx-auto w-full max-w-md lg:max-w-none"
              beforeSrc={HERO_PROOF.beforeSrc}
              afterSrc={HERO_PROOF.afterSrc}
              beforeAlt={HERO_PROOF.beforeAlt}
              afterAlt={HERO_PROOF.afterAlt}
            />
          </div>
        </section>

        <section
          id="proof"
          className="scroll-mt-20 border-b border-stone-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold text-stone-900">
              Repair damage. Remaster older scans.
            </h2>
            <p className="mt-3 max-w-2xl text-stone-700">
              Heirloom prints with tears and fading — and everyday scans that
              never had enough resolution for a big spread. Professional repair
              technology handles both; you choose what goes in your book.
            </p>
            <div className="mt-10 flex justify-center">
              <BeforeAfterCompare
                beforeSrc={FEATURED_PROOF.beforeSrc}
                afterSrc={FEATURED_PROOF.afterSrc}
                beforeAlt={FEATURED_PROOF.beforeAlt}
                afterAlt={FEATURED_PROOF.afterAlt}
              />
            </div>
            <p className="mt-6 text-center text-sm text-stone-600">
              {FEATURED_PROOF.caption}
            </p>
            {galleryProofs.length > 0 && (
              <div className="mt-14">
                <h3 className="text-center font-serif text-xl font-semibold text-stone-900 sm:text-2xl">
                  More family examples
                </h3>
                <p className="mt-2 text-center text-sm text-stone-600">
                  Drag each slider — repair and uplift examples from real
                  workflows
                </p>
                <ul
                  className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                  aria-label="Additional before and after examples"
                >
                  {galleryProofs.map((example) => (
                    <li key={example.id} className="flex flex-col">
                      <BeforeAfterCompare
                        className="w-full"
                        trackClassName="max-w-none shadow-md"
                        showDragHint={false}
                        beforeSrc={example.beforeSrc}
                        afterSrc={example.afterSrc}
                        beforeAlt={example.beforeAlt}
                        afterAlt={example.afterAlt}
                      />
                      <p className="mt-2 text-center text-xs text-stone-600">
                        <span
                          className={`mr-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            example.kind === "repair"
                              ? "bg-stone-200 text-stone-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {example.kind === "repair" ? "Repair" : "Remaster"}
                        </span>
                        {example.caption}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-amber-200/80 bg-amber-50/60 px-5 py-4 text-sm text-stone-800">
              <strong className="font-semibold text-stone-900">
                We repair and remaster — we do not replace your memories.
              </strong>{" "}
              Restoration fills in missing print damage using what is still
              visible; uplifts sharpen detail while keeping the same people and
              moment. You review every result before it goes in your book.
            </div>
          </div>
        </section>

        <section
          id="how"
          className="scroll-mt-20 border-b border-stone-200 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold text-stone-900">
              One place: repair, remaster, caption, print
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-900">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold text-stone-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-700">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-10 text-center">
              <Link
                href="/app/albums"
                className="inline-flex rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-50"
              >
                Start your book
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center font-serif text-3xl font-semibold text-stone-900">
              Stop juggling apps
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {contrast.map((col) => (
                <div
                  key={col.title}
                  className={`rounded-2xl border p-6 ${
                    col.highlight
                      ? "border-amber-300 bg-amber-50/50 shadow-md"
                      : "border-stone-200 bg-stone-50"
                  }`}
                >
                  <h3 className="font-semibold text-stone-900">{col.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-stone-700">
                    {col.lines.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-amber-700" aria-hidden="true">
                          ·
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="print"
          className="scroll-mt-20 border-b border-stone-200 py-16 sm:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-stone-900">
                Made to sit on a coffee table
              </h2>
              <ul className="mt-6 space-y-3 text-stone-700">
                <li>
                  {BOOK_PAGE_COUNT}-page US hardcover, built for the coffee table
                </li>
                <li>Archival-minded paper (final spec from our print sample)</li>
                <li>Every spread previewed before checkout</li>
                <li>
                  Print-safe hints when a photo may look soft at the size you
                  chose
                </li>
              </ul>
              <p className="mt-6 text-sm text-stone-600">
                Books fulfilled by professional print partners (including RPI for
                v1). Packaging may show partner branding.
              </p>
            </div>
            <div
              className="relative mx-auto aspect-[4/3] w-full max-w-md"
              aria-hidden="true"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-stone-300 to-stone-400 shadow-2xl" />
              <div
                className="absolute left-[8%] top-[12%] h-[76%] w-[84%] rounded-sm bg-stone-100 shadow-inner"
                style={{
                  transform: "perspective(800px) rotateY(-8deg)",
                }}
              >
                <div className="grid h-full grid-cols-2 gap-1 p-3">
                  <div className="rounded bg-gradient-to-br from-amber-100 to-stone-200" />
                  <div className="rounded bg-gradient-to-br from-stone-200 to-amber-50 p-2">
                    <div className="h-2/3 rounded bg-stone-300/80" />
                    <div className="mt-2 h-2 w-3/4 rounded bg-stone-400/60" />
                    <div className="mt-1 h-2 w-1/2 rounded bg-stone-400/40" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-stone-800 px-4 py-1 text-xs font-medium text-stone-100 shadow">
                Your captions · Your photos
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="scroll-mt-20 border-b border-stone-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center font-serif text-3xl font-semibold text-stone-900">
              Simple bundles
            </h2>
            <p className="mt-2 text-center text-sm text-stone-600">
              {BOOK_PAGE_COUNT}-page hardcover · US addresses only at checkout
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-900">
                  {MARKETING_PRODUCTS.restoreBundle.displayName}
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold text-stone-900">
                  {formatMarketingPrice(MARKETING_PRODUCTS.restoreBundle.priceUsd)}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  <li>
                    {BOOK_PAGE_COUNT}-page hardcover, shipped within the US
                  </li>
                  <li>
                    Up to{" "}
                    {MARKETING_PRODUCTS.restoreBundle.includedPhotoRestorations}{" "}
                    photo restorations included
                  </li>
                  <li>Same album and caption tools</li>
                </ul>
                <Link
                  href="/app/albums"
                  className="mt-6 inline-flex w-full justify-center rounded-lg bg-amber-800 px-4 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-900"
                >
                  Start your book
                </Link>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-stone-600">
                  {MARKETING_PRODUCTS.albumOnly.displayName}
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold text-stone-900">
                  {formatMarketingPrice(MARKETING_PRODUCTS.albumOnly.priceUsd)}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  <li>Same {BOOK_PAGE_COUNT}-page hardcover specs</li>
                  <li>No photo restorations included</li>
                  <li>Your photos, your captions</li>
                </ul>
                <Link
                  href="/app/albums"
                  className="mt-6 inline-flex w-full justify-center rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-100"
                >
                  Start your book
                </Link>
              </div>
            </div>
            <p className="mt-8 text-center text-xs text-stone-600">
              Photo repair and remaster use professional restoration technology;
              results vary by source file. Restoration is optional — album-only
              orders skip it; the Restore bundle includes restoration credits
              for damage repair and scan uplifts. You choose each version before
              printing. US shipping only for now; tax and shipping calculated at
              checkout.
            </p>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-20 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-center font-serif text-3xl font-semibold text-stone-900">
              Questions families ask
            </h2>
            <div className="mt-10">
              <MarketingFaq />
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-gradient-to-b from-amber-50/50 to-stone-100 py-16">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <h2 className="font-serif text-2xl font-semibold text-stone-900 sm:text-3xl">
              Ready to rescue the album?
            </h2>
            <p className="mt-3 text-stone-700">
              Upload in minutes. Pay only when you print — or when you buy a
              restore bundle.
            </p>
            <Link
              href="/app/albums"
              className="mt-8 inline-flex rounded-lg bg-amber-800 px-6 py-3 text-sm font-semibold text-amber-50 shadow-sm hover:bg-amber-900"
            >
              Start your book
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-100 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-stone-600 sm:flex-row">
            <p>© 2026 Remaster Guru</p>
            <div className="flex gap-6">
              <span className="text-stone-500">Privacy (coming soon)</span>
              <span className="text-stone-500">Terms (coming soon)</span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-stone-500 sm:text-left">
            Repair processing uses industry-leading image technology. Books print
            through professional partners.
          </p>
        </div>
      </footer>
    </div>
  );
}
