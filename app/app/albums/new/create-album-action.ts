"use server";

import { createServerAppApiClient } from "@/src/lib/api/server-client";
import { catchNetworkFailure } from "@/src/lib/api/catch-network";
import { readApiProblemMessage } from "@/src/lib/api/problem-detail";
import type { AlbumDto } from "@/src/lib/api/types";

const DEFAULT_TEMPLATE = "hardcover-24";

export type CreateAlbumResult =
  | { ok: true; albumId: string }
  | { ok: false; error: string };

export async function createAlbumAction(input: {
  title: string;
  templateId?: string;
}): Promise<CreateAlbumResult> {
  const trimmed = input.title.trim();
  if (!trimmed) {
    return { ok: false, error: "Title is required." };
  }

  const templateId = (input.templateId?.trim() || DEFAULT_TEMPLATE).trim();

  const network = await catchNetworkFailure(async () => {
    const client = await createServerAppApiClient();
    return client.POST("/api/v1/albums", {
      body: { title: trimmed, templateId },
    });
  });

  if (!network.ok) {
    return { ok: false, error: network.message };
  }

  const { data, error: apiError, response } = network.result;
  const ok =
    response.ok || response.status === 201 || response.status === 200;

  if (apiError || !ok) {
    const message = apiError
      ? "API unavailable. Is RemasterGuru.Api running?"
      : await readApiProblemMessage(
          response,
          `Could not create album (HTTP ${response.status}).`,
        );
    return { ok: false, error: message };
  }

  let album = data as unknown as AlbumDto | undefined;
  if (!album?.id) {
    try {
      album = (await response.clone().json()) as AlbumDto;
    } catch {
      /* fall through */
    }
  }

  const id = album?.id;
  if (!id) {
    return { ok: false, error: "Album was created but no id was returned." };
  }

  return { ok: true, albumId: id };
}
