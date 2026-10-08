export type RestorationLevelSlider = {
  id: "touchup" | "remaster";
  afterSrc: string;
  afterAlt: string;
  label: string;
  description: string;
  /** Maps to in-app preset messaging */
  appPresetHint: "conservative" | "full remaster";
};

export const RESTORATION_LEVELS_HEADING = "Same photo, two ways";

export const RESTORATION_LEVELS_INTRO =
  "Not every scan needs a crisp 2K uplift. From one damaged original you can choose a light touch-up that keeps grain and vintage character, or a full remaster with uplift and blemish removal — you pick the look in the app.";

export const COUPLE_PARK_ORIGINAL_SRC = "/marketing/couple-park-original.jpg";

export const COUPLE_PARK_ORIGINAL_ALT =
  "Damaged scan of a couple in a park with spots, scratches, and faded vintage character";

export const COUPLE_PARK_RESTORATION_SLIDERS: RestorationLevelSlider[] = [
  {
    id: "touchup",
    afterSrc: "/marketing/couple-park-touchup.jpg",
    afterAlt:
      "Same park photo with blemishes and spots removed while keeping film grain and vintage tone",
    label: "Light touch-up",
    description: "Blemishes removed; keeps vintage character",
    appPresetHint: "conservative",
  },
  {
    id: "remaster",
    afterSrc: "/marketing/couple-park-remaster.jpg",
    afterAlt:
      "Same park photo fully remastered with higher resolution and blemish cleanup",
    label: "Full remaster",
    description: "2K uplift + cleanup",
    appPresetHint: "full remaster",
  },
];

/** All marketing files required to show the restoration-levels sliders */
export const COUPLE_PARK_RESTORATION_LEVELS_SRCS = [
  COUPLE_PARK_ORIGINAL_SRC,
  ...COUPLE_PARK_RESTORATION_SLIDERS.map((slider) => slider.afterSrc),
];
