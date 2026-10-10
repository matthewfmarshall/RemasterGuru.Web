function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

/** True when required Auth0 env vars are set (production / staging login). */
export function isAuth0Configured(): boolean {
  return Boolean(
    readEnv("AUTH0_SECRET")
      && readEnv("AUTH0_CLIENT_ID")
      && readEnv("AUTH0_CLIENT_SECRET")
      && getAuth0Domain(),
  );
}

export function getAuth0Domain(): string | undefined {
  const domain = readEnv("AUTH0_DOMAIN");
  if (domain) {
    return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  const issuer = readEnv("AUTH0_ISSUER_BASE_URL");
  if (issuer) {
    return issuer.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  return undefined;
}

export function getAppBaseUrl(): string {
  return (
    readEnv("AUTH0_BASE_URL")
    ?? readEnv("APP_BASE_URL")
    ?? "http://localhost:3000"
  ).replace(/\/$/, "");
}
