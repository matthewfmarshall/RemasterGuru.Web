import Image from "next/image";
import {
  COUPLE_PARK_RESTORATION_LEVELS,
  RESTORATION_LEVELS_HEADING,
  RESTORATION_LEVELS_INTRO,
} from "@/src/lib/marketing/restoration-levels-example";

export function RestorationLevelsSection() {
  return (
    <div className="mt-14 border-t border-stone-200 pt-14">
      <h3 className="text-center font-serif text-xl font-semibold text-stone-900 sm:text-2xl">
        {RESTORATION_LEVELS_HEADING}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-stone-600">
        {RESTORATION_LEVELS_INTRO}
      </p>
      <ul
        className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
        aria-label="One original scan with light touch-up and full remaster outcomes"
      >
        {COUPLE_PARK_RESTORATION_LEVELS.map((panel) => (
          <li key={panel.id} className="flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-md">
              <Image
                src={panel.src}
                alt={panel.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-stone-900">
              {panel.label}
            </p>
            <p className="mt-1 text-center text-xs leading-relaxed text-stone-600">
              {panel.description}
            </p>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-6 max-w-xl text-center text-xs text-stone-500">
        Light touch-up maps to conservative repair in the app; full remaster
        uses the damage / uplift preset. You review and choose before anything
        goes in your book.
      </p>
    </div>
  );
}
