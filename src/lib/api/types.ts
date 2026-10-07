/** Mirrors API JSON from ContractMaps.ToAlbumDto (OpenAPI omits response schemas). */
export type AlbumDto = {
  id: string;
  title: string;
  templateId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type AlbumDetailResponse = {
  album: AlbumDto;
  pageSummary: { assetCount: number };
};

export type AssetVersionDto = {
  id: string;
  kind: string;
  storageKey: string;
  createdAt: string;
};

export type UploadSessionResponse = {
  sessionId: string;
  uploadUrl: string;
  assetId: string;
  expiresAt: string;
};

export type AssetDto = {
  id: string;
  albumId: string;
  caption: string | null;
  thumbnailUrl?: string | null;
  original: {
    storageKey: string;
    width: number | null;
    height: number | null;
    contentType: string | null;
  } | null;
  activeVersionId: string | null;
  versions: AssetVersionDto[];
};

export type CreditsBalanceDto = {
  balance: number;
  freeTasteUsed: boolean;
};
