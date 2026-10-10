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

## Notes

- Remaster **worker** is not started in this image; album UI, auth, and checkout still run.
- Enable **persistent storage** for `/data` when the Space tier allows it.
- Production target is **Azure**; HF is interim staging.
