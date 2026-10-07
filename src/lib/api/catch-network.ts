/**
 * openapi-fetch rethrows when `fetch` fails (e.g. ECONNREFUSED). Use in server
 * components so a stopped API during `next dev` does not spam uncaught errors.
 */
export async function catchNetworkFailure<T>(
  run: () => Promise<T>,
): Promise<{ ok: true; result: T } | { ok: false; message: string }> {
  try {
    return { ok: true, result: await run() };
  } catch (err) {
    const message =
      err instanceof TypeError
        ? "API unavailable. Is RemasterGuru.Api running?"
        : err instanceof Error
          ? err.message
          : "API request failed";
    return { ok: false, message };
  }
}
