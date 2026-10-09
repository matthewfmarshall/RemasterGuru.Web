# Remaster Guru Web

Next.js front end for Remaster Guru.

## Prerequisites

- Node.js 20+
- [RemasterGuru.Api](~/Development/RemasterGuru.Api) running locally (SQL Server via Docker)

## Two-repo workflow

The Web app consumes a committed OpenAPI document from the Api repo:

| Step | Repository | Command |
|------|------------|---------|
| Export contract | `RemasterGuru.Api` | `./scripts/export-openapi.sh` (or curl `/swagger/v1/swagger.json`) |
| Regenerate types | `RemasterGuru.Web` (this repo) | `npm run generate:api` |

`generate:api` reads `../RemasterGuru.Api/openapi/v1.json` and writes `src/lib/api/schema.d.ts`. The API layer is `src/lib/api/`:

- `createApiClient(baseUrl, headers?)` — low-level openapi-fetch wrapper
- `createDevApiClient()` — same client with `X-User-Id` from `NEXT_PUBLIC_DEV_USER_ID` (use this in app code)

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run generate:api   # after Api openapi changes
```

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the API (no trailing slash). Default `http://localhost:5055` — matches `RemasterGuru.Api` `launchSettings.json`. On macOS, avoid `5000` (often AirPlay). |
| `NEXT_PUBLIC_DEV_USER_ID` | GUID sent as `X-User-Id` for local API calls |

Defaults in `.env.local.example`.

## Run

Start **RemasterGuru.Api** first (see that repo’s README), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is the public marketing site (no API required).

### Marketing pricing

Landing prices and checkout product SKUs live in `src/lib/marketing/pricing.ts`. When you change book bundle prices or included restoration counts on **RemasterGuru.Api** (`Checkout/CheckoutProductCatalog.cs`), update that file too so the home page and checkout fallbacks stay aligned with `GET /api/v1/checkout/products`.

### Marketing images

Optional before/after samples for the landing slider live in `public/marketing/` (`before.jpg`, `after.jpg`). See `public/marketing/README.md`. Until you add them, the slider uses demo placeholders.

If the API is not running, the app still loads: home health shows **unreachable**, and the `/app` header shows **Credits: —** until the API is up. `NEXT_PUBLIC_API_URL` must match the API base URL (default `http://localhost:5055`).

### Album app (dev)

| Route | Purpose |
|-------|---------|
| `/app/albums` | List albums |
| `/app/albums/new` | Create album |
| `/app/albums/[albumId]` | Album detail and assets |
| `/app/albums/[albumId]/book` | Book editor and checkout (when ready for print) |
| `/app/checkout/success` | Stripe success return (`albumId` query) |
| `/app/checkout/cancel` | Stripe cancel return (`albumId` query) |

The `/app` layout shows navigation and live credits balance (`GET /api/v1/credits/balance`). All API calls send `X-User-Id` via `createDevApiClient()`.

**Album management:** On album detail you can edit the title, delete the album, remove all photos (keeps the album), or remove individual photos. Per-album “don’t ask again” for photo delete is stored in `localStorage` under `remaster-guru:skip-asset-delete-confirm:{albumId}`.

For a typed client demo, open [http://localhost:3000/dev/api-check](http://localhost:3000/dev/api-check).

### Stripe checkout (test)

1. Configure Stripe test keys on **RemasterGuru.Api** (see that repo’s README). The Web app does not store Stripe secrets.
2. Mark an album **ready for print** on the book page, then use **Checkout** (Restore bundle or Album-only).
3. Optional: run `stripe listen --forward-to http://localhost:5055/api/v1/webhooks/stripe` so paid orders grant credits and set album status to ordered.

### Troubleshooting

- **“Failed to fetch” / sliders or forms dead:** Confirm `NEXT_PUBLIC_API_URL=http://localhost:5055` (not port 5000) and the Api is running (`GET /health` → 200).
- **New album reloads with `?title=` in the URL:** You are on a non-hydrated dev page—use [http://localhost:3000](http://localhost:3000) instead of `127.0.0.1`, or restart `npm run dev` after pulling (we allow `127.0.0.1` via `allowedDevOrigins` in `next.config.ts`).
- **Create album spins forever:** Usually CORS or a stopped API; check the browser console and Api CORS for your dev origin (`localhost:3000`).

## Build

```bash
npm run build
```

## PWA (lite)

The app ships a web manifest and home-screen install hints on `/app` routes (no service worker yet — API calls stay uncached).

| Asset | Purpose |
|-------|---------|
| `public/manifest.webmanifest` | App name, `theme_color` (`#92400e` amber-800), `background_color` (`#fafaf9` stone-50), start URL `/app/albums` |
| `public/icons/icon-192.png`, `icon-512.png` | Manifest and Apple touch icons (simple stone/amber placeholder art) |
| `public/icons/icon.svg` | Source artwork if you regenerate PNGs |

Root `app/layout.tsx` links the manifest and sets `apple-mobile-web-app-capable` via Next metadata. The install banner on `/app` can be dismissed (stored in `localStorage`); it appears after the first visit to `/app` or after creating an album. On iOS, use **Share → Add to Home Screen**.
