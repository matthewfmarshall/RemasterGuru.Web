# Hugging Face Space (Docker) — Remaster Guru staging

Single container: **ASP.NET Core API** (internal port **5055**, SQLite + local blobs under `/data`) and **Next.js** on public port **7860** (HF default).

## Prerequisites

- Both repos checked out as siblings (e.g. `~/Development/RemasterGuru.Api` and `~/Development/RemasterGuru.Web`)
- Auth0 tenant configured for localhost **and** your Space URL — see `RemasterGuru.Api/docs/auth0-setup.md`
- Hugging Face account; CLI optional (`pip install huggingface_hub` → `huggingface-cli`)

## Local Docker smoke test

```bash
cd ~/Development
docker build -f RemasterGuru.Web/deploy/huggingface/Dockerfile -t remasterguru-hf .
docker run --rm -p 7860:7860 \
  -e AUTH0_SECRET=... \
  -e AUTH0_DOMAIN=... \
  -e AUTH0_CLIENT_ID=... \
  -e AUTH0_CLIENT_SECRET=... \
  -e AUTH0_AUDIENCE=... \
  -e AUTH0_BASE_URL=http://localhost:7860 \
  -e App__WebBaseUrl=http://localhost:7860 \
  -e Auth0__Domain=... \
  -e Auth0__Audience=... \
  -e Cors__AllowHuggingFaceSpaceHosts=true \
  remasterguru-hf
```

Open `http://localhost:7860`. Do not commit secrets; use env vars or HF Space **Settings → Secrets**.

## Create the Space

1. [huggingface.co/new-space](https://huggingface.co/new-space) — **Docker** SDK, name e.g. `remasterguru-staging`.
2. Clone the Space repo and copy this `Dockerfile` + `entrypoint.sh`, **or** push from `RemasterGuru.Web` with `README.md` at repo root pointing here.

   ```bash
   huggingface-cli login   # uses HF_TOKEN — configure via Hub UI or env, never commit
   huggingface-cli repo create remasterguru-staging --type space --space_sdk docker
   ```

3. Because the image builds **both** Api and Web, either:
   - Use a **private build** from your machine and push to the Space registry, or
   - Add `RemasterGuru.Api` into the Space repo (subtree/submodule) and adjust `COPY` paths in the Dockerfile, or
   - Build from CI with both repos in the build context (recommended).

## Space secrets (names only)

Configure in the Hub UI (or `huggingface-cli` secret helpers). Values come from Auth0 and your deployment.

| Secret | Purpose |
|--------|---------|
| `AUTH0_SECRET` | Next.js session encryption |
| `AUTH0_DOMAIN` | Auth0 tenant hostname |
| `AUTH0_CLIENT_ID` | Web application |
| `AUTH0_CLIENT_SECRET` | Web application |
| `AUTH0_AUDIENCE` | API identifier |
| `AUTH0_BASE_URL` | `https://<your-space>.hf.space` |
| `API_INTERNAL_URL` | `http://127.0.0.1:5055` (in-container API) |
| `Auth0__Domain` | Same tenant (API process) |
| `Auth0__Audience` | API identifier |
| `App__WebBaseUrl` | Space public URL |
| `Cors__AllowHuggingFaceSpaceHosts` | `true` |

Optional: `ConnectionStrings__Default` (default SQLite at `/data/remasterguru.db`), `Storage__BlobRoot` (`/data/blobs`).

## Notes

- **Worker** (remaster jobs) is not started in this v1 image; album/upload/checkout UI still runs.
- Persist `/data` with a Space **persistent storage** volume when available.
- Production target remains **Azure** VM; HF is interim staging.
