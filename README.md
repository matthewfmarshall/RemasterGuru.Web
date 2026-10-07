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

`generate:api` reads `../RemasterGuru.Api/openapi/v1.json` and writes `src/lib/api/schema.d.ts`. The thin client is `src/lib/api/client.ts` (`createApiClient`).

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run generate:api   # after Api openapi changes
```

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the API (no trailing slash) |
| `NEXT_PUBLIC_DEV_USER_ID` | GUID sent as `X-User-Id` for local API calls |

Defaults in `.env.local.example`.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page shows API health. For a typed client demo, open [http://localhost:3000/dev/api-check](http://localhost:3000/dev/api-check) (`GET /api/v1/credits/balance`).

## Build

```bash
npm run build
```
