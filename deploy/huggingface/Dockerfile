# Build from the parent directory that contains BOTH repos:
#   cd ~/Development
#   docker build -f RemasterGuru.Web/deploy/huggingface/Dockerfile -t remasterguru-hf .
#
# Hugging Face Spaces: set Space SDK to Docker and point at this Dockerfile
# (repo root = RemasterGuru.Web; adjust COPY paths or use a monorepo checkout).

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /src
COPY RemasterGuru.Api/ ./RemasterGuru.Api/
RUN dotnet publish ./RemasterGuru.Api/src/RemasterGuru.Api/RemasterGuru.Api.csproj \
    -c Release \
    -o /app/api \
    --no-self-contained

FROM node:20-bookworm AS web-build
WORKDIR /src
COPY RemasterGuru.Web/ ./RemasterGuru.Web/
WORKDIR /src/RemasterGuru.Web
ENV NEXT_STANDALONE_OUTPUT=1
RUN npm ci && npm run build

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble AS final
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=api-build /app/api ./api
COPY --from=web-build /src/RemasterGuru.Web/.next/standalone ./web
COPY --from=web-build /src/RemasterGuru.Web/.next/static ./web/.next/static
COPY --from=web-build /src/RemasterGuru.Web/public ./web/public
COPY RemasterGuru.Web/deploy/huggingface/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PORT=7860
EXPOSE 7860

VOLUME ["/data"]

ENTRYPOINT ["/entrypoint.sh"]
