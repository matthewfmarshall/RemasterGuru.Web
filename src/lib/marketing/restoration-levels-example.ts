export type RestorationLevelPanel = {
  id: "original" | "touchup" | "remaster";
  src: string;
  alt: string;
  label: string;
  description: string;
  /** Maps to in-app preset messaging */
  appPresetHint: "conservative" | "full remaster";
};

export const RESTORATION_LEVELS_HEADING = "Same photo, two ways";

export const RESTORATION_LEVELS_INTRO =
  "Not every scan needs a crisp 2K uplift. From one damaged original you can choose a light touch-up that keeps grain and vintage character, or a full remaster with uplift and blemish removal — you pick the look in the app.";

export const COUPLE_PARK_RESTORATION_LEVELS: RestorationLevelPanel[] = [
  {
    id: "original",
    src: "/marketing/couple-park-original.jpg",
    alt:
      "Damaged scan of a couple in a park with spots, scratches, and faded vintage character",
    label: "Original scan",
    description: "Spots, scratches, and age on the paper",
    appPresetHint: "conservative",
  },
  {
    id: "touchup",
    src: "/marketing/couple-park-touchup.jpg",
    alt:
      "Same park photo with blemishes and spots removed while keeping film grain and vintage tone",
    label: "Light touch-up",
    description: "Blemishes removed; grain and character kept",
    appPresetHint: "conservative",
  },
  {
    id: "remaster",
    src: "/marketing/couple-park-remaster.jpg",
    alt:
      "Same park photo fully remastered with higher resolution and blemish cleanup",
    label: "Full remaster",
    description: "2K uplift plus blemish removal",
    appPresetHint: "full remaster",
  },
];

export const COUPLE_PARK_RESTORATION_LEVELS_SRCS = COUPLE_PARK_RESTORATION_LEVELS.map(
  (panel) => panel.src,
);
