---
title: Remaster Guru Staging
emoji: 📷
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Remaster Guru — Hugging Face staging

Single Docker Space: **Next.js** on port **7860** (public) and **ASP.NET Core API** on **5055** (in-container). SQLite and uploads live under `/data`.

This repository is **deploy-only** (not the application source). The `Dockerfile` clones [RemasterGuru.Api](https://github.com/matthewfmarshall/RemasterGuru.Api) and [RemasterGuru.Web](https://github.com/matthewfmarshall/RemasterGuru.Web) at build time.

## Repo layout

| File | Source |
|------|--------|
| `Dockerfile` | Copy from `RemasterGuru.Web` → `deploy/huggingface/Dockerfile.space` |
| `README.md` | This file (HF requires README at repo root for Docker SDK metadata) |

`entrypoint.sh` is copied from the Web clone inside the image — you do **not** need to commit it in the Space repo.

## Pin versions (optional)

Set Space **Variables** (build-time) or edit `ARG` defaults in `Dockerfile`:

- `API_REF` — branch, tag, or commit on `RemasterGuru.Api` (default `main`)
- `WEB_REF` — branch, tag, or commit on `RemasterGuru.Web` (default `main`)

Example pins at deploy time: `API_REF=6284424`, `WEB_REF=<web-commit-after-dockerfile-push>`.

## Secrets

Configure in **Settings → Repository secrets** before the first build. Names only — see Project checklist `hf-staging-checklist.md` or `RemasterGuru.Api/docs/auth0-setup.md` Part H.

Auth0 **Allowed Callback / Logout / Web Origins** must include this Space origin, e.g. `https://beek44-remasterguru-staging.hf.space`.

## Hugging Face Space settings (Docker SDK)

In the Hub UI (**Space → Settings**):

1. **Space SDK** must be **Docker** (not Gradio/Static). If the Space was created with another SDK, change it here or recreate the Space as Docker.
2. Repository root must contain **`Dockerfile`** (from `Dockerfile.space`) and **`README.md`** with YAML front matter below (`sdk: docker`, `app_port: 7860`).
3. **App port** `7860` must match `EXPOSE` in the Dockerfile and this README.

## Notes

- Remaster **worker** is not started in this image; album UI, auth, and checkout still run.
- Enable **persistent storage** for `/data` when the Space tier allows it.
- Production target is **Azure**; HF is interim staging.
