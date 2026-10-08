export type ProofKind = "repair" | "uplift";

export type ProofExample = {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  kind: ProofKind;
  caption: string;
};

/** Hero — repair-forward vintage portrait */
export const HERO_PROOF: ProofExample = {
  id: "baby",
  beforeSrc: "/marketing/baby-before.jpg",
  afterSrc: "/marketing/baby-after.jpg",
  beforeAlt:
    "Vintage infant portrait with fading, yellowing, and soft focus from age",
  afterAlt:
    "Same portrait with fading reduced, detail sharpened, and print-ready clarity",
  kind: "repair",
  caption: "Fading and softness from decades in an album",
};

/** Primary #proof feature — uplift / remaster (light blemish cleanup) */
export const FEATURED_PROOF: ProofExample = {
  id: "wedding-reception",
  beforeSrc: "/marketing/wedding-reception-before.jpg",
  afterSrc: "/marketing/wedding-reception-after.jpg",
  beforeAlt:
    "Wedding reception scan with low resolution, muted color, and minor print blemishes",
  afterAlt:
    "Same reception photo remastered to higher resolution with revived color and light cleanup",
  kind: "uplift",
  caption:
    "Older scan remastered for print — sharper detail and truer color, with only light blemish cleanup",
};

/**
 * Compact proof gallery below the featured compare.
 * Drop matching `-before.jpg` / `-after.jpg` pairs into `public/marketing/`.
 */
export const GALLERY_PROOF_EXAMPLES: ProofExample[] = [
  {
    id: "emulsion-crack",
    beforeSrc: "/marketing/emulsion-crack-before.jpg",
    afterSrc: "/marketing/emulsion-crack-after.jpg",
    beforeAlt: "Family print with emulsion cracks and surface damage",
    afterAlt: "Same print with cracks filled and surface stabilized for print",
    kind: "repair",
    caption: "Emulsion cracks repaired for a clean print",
  },
  {
    id: "faded-color",
    beforeSrc: "/marketing/faded-color-before.jpg",
    afterSrc: "/marketing/faded-color-after.jpg",
    beforeAlt: "Color snapshot faded to a magenta cast over years",
    afterAlt: "Same snapshot with color revived and contrast restored",
    kind: "repair",
    caption: "Faded color brought back without changing the moment",
  },
  {
    id: "low-res-scan",
    beforeSrc: "/marketing/low-res-scan-before.jpg",
    afterSrc: "/marketing/low-res-scan-after.jpg",
    beforeAlt: "Small low-resolution scan of a group photo from the 1980s",
    afterAlt:
      "Same group photo remastered to higher resolution with sharper faces for print",
    kind: "uplift",
    caption: "Low-res scan uplifted for a larger spread",
  },
  {
    id: "fold-crease",
    beforeSrc: "/marketing/fold-crease-before.jpg",
    afterSrc: "/marketing/fold-crease-after.jpg",
    beforeAlt: "Folded print with a crease line through the image",
    afterAlt: "Same print with crease softened and detail recovered",
    kind: "repair",
    caption: "Fold crease softened while keeping identity intact",
  },
];
