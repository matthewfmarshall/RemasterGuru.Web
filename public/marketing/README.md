# Marketing before/after images

Name pairs as `{subject}-before.jpg` and `{subject}-after.jpg`. The landing page wires each pair explicitly in `app/page.tsx`.

| Files | Landing section |
| --- | --- |
| `baby-before.jpg`, `baby-after.jpg` | Hero compare slider (top of page) |
| `wedding-reception-before.jpg`, `wedding-reception-after.jpg` | **#proof** — “Real damage. Real family photos.” compare slider |

`before.jpg` / `after.jpg` are not used. If image paths fail to load, the compare component shows labeled gradient placeholders until valid files are in place.
