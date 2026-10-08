import { BeforeAfterCompare } from "@/src/components/marketing/before-after-compare";
import {
  COUPLE_PARK_ORIGINAL_ALT,
  COUPLE_PARK_ORIGINAL_SRC,
  COUPLE_PARK_RESTORATION_SLIDERS,
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
      <p className="mt-4 text-center text-sm text-stone-600">
        Drag each slider — same original scan, two outcomes
      </p>
      <ul
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6"
        aria-label="Compare light touch-up and full remaster from one original scan"
      >
        {COUPLE_PARK_RESTORATION_SLIDERS.map((slider) => (
          <li key={slider.id} className="flex flex-col">
            <BeforeAfterCompare
              className="w-full"
              trackClassName="max-w-none shadow-md"
              showDragHint={false}
              beforeSrc={COUPLE_PARK_ORIGINAL_SRC}
              afterSrc={slider.afterSrc}
              beforeAlt={COUPLE_PARK_ORIGINAL_ALT}
              afterAlt={slider.afterAlt}
            />
            <p className="mt-3 text-center text-sm font-semibold text-stone-900">
              {slider.label}
            </p>
            <p className="mt-1 text-center text-xs leading-relaxed text-stone-600">
              {slider.description}
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
