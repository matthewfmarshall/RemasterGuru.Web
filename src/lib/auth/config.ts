function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

/** Doc placeholders and copy-paste ellipses must not reach Auth0 URL builders. */
const AUTH0_DOMAIN_PLACEHOLDER = /(\.\.\.|…|your[-_]?tenant|example\.com|<[^>]+>)/i;

function stripUrlScheme(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Auth0 tenant hostname only (no scheme, no trailing slash). */
export function normalizeAuth0Domain(raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }

  const domain = stripUrlScheme(raw.trim());
  if (!domain || AUTH0_DOMAIN_PLACEHOLDER.test(domain)) {
    return undefined;
  }

  try {
    const url = new URL(`https://${domain}`);
    if (!url.hostname || url.hostname !== domain.split("/")[0]) {
      return undefined;
    }
    return url.hostname;
  } catch {
    return undefined;
  }
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
  const fromDomain = normalizeAuth0Domain(readEnv("AUTH0_DOMAIN") ?? readEnv("DOMAIN"));
  if (fromDomain) {
    return fromDomain;
  }

  const issuer = readEnv("AUTH0_ISSUER_BASE_URL");
  if (issuer) {
    return normalizeAuth0Domain(issuer);
  }

  return undefined;
}

export function getAppBaseUrl(): string {
  const raw =
    readEnv("AUTH0_BASE_URL")
    ?? readEnv("APP_BASE_URL")
    ?? "http://localhost:3000";

  const base = raw.replace(/\/$/, "");
  if (AUTH0_DOMAIN_PLACEHOLDER.test(base) || !isValidHttpsUrl(base)) {
    return "http://localhost:3000";
  }

  return base;
}
