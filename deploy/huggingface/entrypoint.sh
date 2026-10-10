#!/usr/bin/env bash
set -euo pipefail

export ASPNETCORE_URLS="${ASPNETCORE_URLS:-http://0.0.0.0:5055}"
export ASPNETCORE_ENVIRONMENT="${ASPNETCORE_ENVIRONMENT:-Production}"
export PORT="${PORT:-7860}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

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
