type ProblemJson = {
  title?: string;
  detail?: string;
  status?: number;
};

/** Read RFC 7807 problem detail from an openapi-fetch response. */
export async function readApiProblemMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.clone().json()) as ProblemJson;
    if (typeof body.detail === "string" && body.detail.trim()) {
      return body.detail.trim();
    }
    if (typeof body.title === "string" && body.title.trim()) {
      return body.title.trim();
    }
  } catch {
    // ignore non-JSON bodies
  }
  return fallback;
}
