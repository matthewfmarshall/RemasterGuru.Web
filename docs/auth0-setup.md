# Auth0 setup (Web)

Remaster Guru uses Auth0 for sign-in on `/app/*`. The **full step-by-step Dashboard guide** (new free tenant, API, Regular Web app, localhost + Hugging Face URLs) is maintained in the **RemasterGuru.Api** repo:

- **Path (local):** `~/Development/RemasterGuru.Api/docs/auth0-setup.md`
- **GitHub:** `docs/auth0-setup.md` on the `RemasterGuru.Api` repository

Read **Part B** (Auth0 **APIs** resource) then **Part F** for Web env vars, or the whole doc the first time you configure Auth0.

**Login fails with `Service not found` / generic authorization error?** Complete **Part B** in the Api guide: create the API whose **Identifier** matches `AUTH0_AUDIENCE` (default `https://api.remasterguru.com`). Skipping Part B does not affect `X-User-Id` dev mode (omit Auth0 env vars).

**Login fails with `not authorized to access resource server`?** The API exists but the Web app is not allowed to request tokens for it. In Auth0 Dashboard: **Applications → APIs → Remaster Guru API** (identifier `https://api.remasterguru.com`) → **Application Access** → enable **Remaster Guru Web** (Regular Web Application). Save, then retry `/auth/login`. The callback page now shows Auth0’s `error_description` when this step is missing.

| Check | Where in Dashboard |
|-------|-------------------|
| API identifier | **APIs** → your API → **Identifier** = `AUTH0_AUDIENCE` exactly |
| Web app authorized for API | **APIs** → **Remaster Guru API** → **Application Access** → **Remaster Guru Web** = On |
| Alternate UI | **Applications** → **Remaster Guru Web** → **APIs** tab → authorize **Remaster Guru API** |
