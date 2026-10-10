# Hugging Face Space (Docker) — Remaster Guru staging

Single container: **ASP.NET Core API** (internal port **5055**, SQLite + local blobs under `/data`) and **Next.js** on public port **7860** (HF default).

## Prerequisites

- Both repos checked out as siblings (e.g. `~/Development/RemasterGuru.Api` and `~/Development/RemasterGuru.Web`)
- Auth0 tenant configured for localhost **and** your Space URL — see `RemasterGuru.Api/docs/auth0-setup.md`
- Hugging Face account; CLI optional (`pip install huggingface_hub` → `huggingface-cli`)

## Local Docker smoke test

Build from the parent directory that contains **both** `RemasterGuru.Api` and `RemasterGuru.Web`.

`~/Development/remasterguru.env` can supply values if every key matches what the container expects. The file may include `DOMAIN=`; the entrypoint copies that to `AUTH0_DOMAIN` when `AUTH0_DOMAIN` is unset. Use the **Space runtime URL** for base URLs locally (`http://localhost:7860`), not the Hub page URL (`https://huggingface.co/spaces/...`).

**Never** paste truncated placeholders (e.g. `https://…/` or `...`) into env files — Auth0 and Next.js need full hostnames and URLs.

```bash
cd ~/Development
docker build -f RemasterGuru.Web/deploy/huggingface/Dockerfile -t remasterguru-hf .
docker run --rm -p 7860:7860 --env-file remasterguru.env \
  -e AUTH0_BASE_URL=http://localhost:7860 \
  -e APP_BASE_URL=http://localhost:7860 \
  -e App__WebBaseUrl=http://localhost:7860 \
  -e API_INTERNAL_URL=http://127.0.0.1:5055 \
  remasterguru-hf
```

`remasterguru.env` → container mapping (names only):

| `remasterguru.env` key | Container / app |
|------------------------|-----------------|
| `AUTH0_SECRET` | Next.js session |
| `AUTH0_DOMAIN` or `DOMAIN` | Auth0 tenant hostname (no `https://`) |
| `AUTH0_CLIENT_ID` | Web app client |
| `AUTH0_CLIENT_SECRET` | Web app client |
| `AUTH0_AUDIENCE` | API identifier |
| `AUTH0_BASE_URL` / `APP_BASE_URL` | Public app origin (override for local Docker as above) |
| `Auth0__Domain` | API JWT validation |
| `Auth0__Audience` | API JWT validation |
| `App__WebBaseUrl` | API CORS / links |
| `Cors__AllowHuggingFaceSpaceHosts` | `true` for HF |
| `API_INTERNAL_URL` | BFF → API (`http://127.0.0.1:5055` in container) |

On startup, `entrypoint.sh` logs whether required Auth0 variables are set (values are not printed). Open `http://localhost:7860` and `/auth/login`. Do not commit secrets.

## Create the Space

1. [huggingface.co/new-space](https://huggingface.co/new-space) — **Docker** SDK, e.g. `Beek44/remasterguru-staging`.
2. **Recommended (HF Hub build, no sibling Api repo):** copy `Dockerfile.space` → Space repo root as `Dockerfile`, and `SPACE_README.md` → `README.md`. The image clones both GitHub repos during `docker build`; `entrypoint.sh` comes from the Web clone inside the image.
3. **Local sibling build:** use `Dockerfile` in this folder with context `~/Development` (both repos checked out).

   ```bash
   huggingface-cli login   # HF_TOKEN via Hub UI or env — never commit
   git clone https://huggingface.co/spaces/Beek44/remasterguru-staging
   cd remasterguru-staging
   cp ~/Development/RemasterGuru.Web/deploy/huggingface/Dockerfile.space ./Dockerfile
   cp ~/Development/RemasterGuru.Web/deploy/huggingface/SPACE_README.md ./README.md
   git add Dockerfile README.md && git commit -m "HF staging Docker build" && git push
   ```

See Project Context checklist `hf-staging-checklist.md` for Auth0 URLs, secrets table, and smoke tests.

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
