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

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page shows API health.

### Album app (dev)

| Route | Purpose |
|-------|---------|
| `/app/albums` | List albums |
| `/app/albums/new` | Create album |
| `/app/albums/[albumId]` | Album detail and assets |

The `/app` layout shows navigation and live credits balance (`GET /api/v1/credits/balance`). All API calls send `X-User-Id` via `createDevApiClient()`.

For a typed client demo, open [http://localhost:3000/dev/api-check](http://localhost:3000/dev/api-check).

## Build

```bash
npm run build
```
