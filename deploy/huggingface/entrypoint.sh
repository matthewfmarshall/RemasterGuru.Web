#!/usr/bin/env bash
set -euo pipefail

strip_scheme() {
  local v="${1:-}"
  v="${v#https://}"
  v="${v#http://}"
  v="${v%/}"
  printf '%s' "$v"
}

# remasterguru.env uses DOMAIN; Docker/HF expect AUTH0_DOMAIN (hostname only).
if [[ -z "${AUTH0_DOMAIN:-}" && -n "${DOMAIN:-}" ]]; then
  export AUTH0_DOMAIN="${DOMAIN}"
fi
if [[ -n "${AUTH0_DOMAIN:-}" ]]; then
  export AUTH0_DOMAIN="$(strip_scheme "$AUTH0_DOMAIN")"
fi

log_auth0_startup() {
  local domain_status="missing"
  if [[ -n "${AUTH0_DOMAIN:-}" ]]; then
    if [[ "${AUTH0_DOMAIN}" == *"…"* || "${AUTH0_DOMAIN}" == *"..."* ]]; then
      domain_status="INVALID (placeholder/ellipsis — use tenant host, e.g. dev-xxxx.us.auth0.com, no https://)"
    else
      domain_status="ok (hostname, no scheme)"
    fi
  fi
  echo "[entrypoint] Auth0 env: AUTH0_DOMAIN=${domain_status}; AUTH0_SECRET=${AUTH0_SECRET:+set}; AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID:+set}; AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET:+set}; AUTH0_BASE_URL=${AUTH0_BASE_URL:-${APP_BASE_URL:-unset}}"
  if [[ "${domain_status}" == missing* || "${domain_status}" == INVALID* ]]; then
    echo "[entrypoint] WARNING: /auth/login will fail until AUTH0_DOMAIN is a real tenant hostname (pass via --env-file or HF secrets; no truncated values)."
  fi
}
log_auth0_startup

export ASPNETCORE_URLS="${ASPNETCORE_URLS:-http://0.0.0.0:5055}"
export ASPNETCORE_ENVIRONMENT="${ASPNETCORE_ENVIRONMENT:-Production}"
export PORT="${PORT:-7860}"
# K8s/HF set HOSTNAME to the pod id; Next binds to that unless we override.
export HOSTNAME=0.0.0.0

mkdir -p /data/blobs
export ConnectionStrings__Default="${ConnectionStrings__Default:-Data Source=/data/remasterguru.db}"
export Database__Provider="${Database__Provider:-Sqlite}"
export Storage__BlobRoot="${Storage__BlobRoot:-/data/blobs}"
export API_INTERNAL_URL="${API_INTERNAL_URL:-http://127.0.0.1:5055}"

echo "Starting RemasterGuru.Api on ${ASPNETCORE_URLS} (SQLite: ${ConnectionStrings__Default})"
dotnet /app/api/RemasterGuru.Api.dll &
api_pid=$!

cleanup() {
  kill "$api_pid" 2>/dev/null || true
}
trap cleanup EXIT

echo "Starting Next.js on ${HOSTNAME}:${PORT}"
cd /app/web
exec node server.js
