# Marketing before/after images

Name pairs as `{subject}-before.jpg` and `{subject}-after.jpg`. Pairs are declared in `src/lib/marketing/proof-examples.ts`; the landing page only renders a pair when **both** files exist under this folder.

## On the landing page today

| Files | Section | Kind (messaging) |
| --- | --- | --- |
| `baby-before.jpg`, `baby-after.jpg` | Hero compare slider (top of page) | Repair — fading and softness |
| `wedding-reception-before.jpg`, `wedding-reception-after.jpg` | **#proof** — featured compare (full width, centered) | Remaster / uplift — low-res scan with light blemish cleanup |

## Compact gallery (below wedding caption)

Rendered in a responsive grid (1 → 2 → 4 columns) when both files for an entry are present. Defined in `GALLERY_PROOF_EXAMPLES` in `proof-examples.ts`:

| Files | Kind | Caption (on page) |
| --- | --- | --- |
| `emulsion-crack-before.jpg`, `emulsion-crack-after.jpg` | repair | Emulsion cracks repaired for a clean print |
| `faded-color-before.jpg`, `faded-color-after.jpg` | repair | Faded color brought back without changing the moment |
| `low-res-scan-before.jpg`, `low-res-scan-after.jpg` | uplift | Low-res scan uplifted for a larger spread |
| `fold-crease-before.jpg`, `fold-crease-after.jpg` | repair | Fold crease softened while keeping identity intact |

**Status:** As of the last marketing update, only the hero and wedding-reception pairs are on disk. Add any gallery row above; missing pairs are skipped automatically (no broken images).

`before.jpg` / `after.jpg` are not used. If image paths fail to load in the browser, the compare component shows labeled gradient placeholders until valid files are in place.

## Restoration levels triptych (#proof)

Shown below the wedding featured compare when **all three** files exist. Copy lives in `src/lib/marketing/restoration-levels-example.ts`; UI in `restoration-levels-section.tsx`.

| File | On-page label | In-app mapping |
| --- | --- | --- |
| `couple-park-original.jpg` | Original scan | — (damaged upload) |
| `couple-park-touchup.jpg` | Light touch-up | Conservative / light repair |
| `couple-park-remaster.jpg` | Full remaster | Damage or full remaster preset (2K uplift + blemish removal) |

Same scene in all three — one scan, two outcomes you can choose in the app.
