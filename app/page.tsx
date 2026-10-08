import Link from "next/link";
import { BeforeAfterCompare } from "@/src/components/marketing/before-after-compare";
import { MarketingFaq } from "@/src/components/marketing/marketing-faq";
import { MarketingHeader } from "@/src/components/marketing/marketing-header";

const steps = [
  {
    title: "Upload",
    body:
      "Add photos from your phone, scanner, or computer. We keep the original file.",
  },
  {
    title: "Restore (optional)",
    body:
      "Fix tears, fading, and softness — or skip and use your files as-is. Crop and brighten in the browser anytime.",
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
      "Repair built for heirloom prints.",
      "Captions and print in one flow.",
      "Print-ready checks before you pay.",
    ],
    highlight: true,
  },
];

export default function MarketingHome() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <MarketingHeader />

      <main>
        <section className="border-b border-stone-200/80 bg-gradient-to-b from-amber-50/40 to-stone-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div>
              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
                Restore the photos that matter. Print the story.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-stone-700">
                From shoebox to hardcover: upload old prints and scans, repair
                damage when you need it, caption the people you love, and order a
                book you will actually hand to your kids.
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
                Originals always kept · You approve every restore · Free to upload
                and layout
              </p>
            </div>
            <BeforeAfterCompare className="mx-auto w-full max-w-md lg:max-w-none" />
          </div>
        </section>

        <section
          id="proof"
          className="scroll-mt-20 border-b border-stone-200 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold text-stone-900">
              Real damage. Real family photos.
            </h2>
            <p className="mt-3 max-w-2xl text-stone-700">
              Faded color, scratches, cracks through a face — the prints people
              bury in albums. Remaster Guru repairs for print, then places them
              in your book.
            </p>
            <div className="mt-10 flex justify-center">
              <BeforeAfterCompare />
            </div>
            <p className="mt-6 text-center text-sm text-stone-600">
              Tears &amp; cracks · Detail recovered for print
            </p>
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-amber-200/80 bg-amber-50/60 px-5 py-4 text-sm text-stone-800">
              <strong className="font-semibold text-stone-900">
                We repair — we do not replace your memories.
              </strong>{" "}
              Restoration fills in missing print damage using what is still
              visible. You review every result before it goes in your book.
            </div>
          </div>
        </section>

        <section
          id="how"
          className="scroll-mt-20 border-b border-stone-200 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-serif text-3xl font-semibold text-stone-900">
              One place: restore, caption, print
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
                <li>Hardcover lay-flat option when your lab supports it</li>
                <li>Paper chosen for family albums that last</li>
                <li>Every spread previewed before checkout</li>
                <li>
                  Print-safe hints when a photo may look soft at the size you
                  chose
                </li>
              </ul>
              <p className="mt-6 text-sm text-stone-600">
                Books fulfilled by professional print partners.
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
              Placeholder pricing — final numbers TBD at launch.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-900">
                  Restore bundle
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold text-stone-900">
                  ~$89
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  <li>24-page hardcover, shipped</li>
                  <li>Photo restorations included in bundle</li>
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
                  Album only
                </p>
                <p className="mt-2 font-serif text-4xl font-semibold text-stone-900">
                  ~$59
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  <li>Same hardcover book specs</li>
                  <li>No restoration included</li>
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
              Restoration uses professional repair technology; results vary by
              damage. You choose the version you want before printing. Shipping
              calculated at checkout.
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
              Ready to turn the shoebox into a book?
            </h2>
            <p className="mt-3 text-stone-700">
              Upload free, restore when you need it, and print when it feels
              right.
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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-stone-600 sm:flex-row sm:px-6">
          <p>© 2026 Remaster Guru</p>
          <div className="flex gap-6">
            <span className="text-stone-500">Privacy (coming soon)</span>
            <span className="text-stone-500">Terms (coming soon)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
