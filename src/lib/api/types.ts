/** Mirrors API JSON from ContractMaps.ToAlbumDto (OpenAPI omits response schemas). */
export type AlbumDto = {
  id: string;
  title: string;
  templateId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  /** Present on GET /api/v1/albums list responses. */
  assetCount?: number;
  maxAssets?: number;
  printWarningCount?: number;
  printWarningSummary?: string | null;
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

export type AlbumLayoutResponse = {
  albumId: string;
  templateId: string;
  pageCount: number;
  slotsFilled: number;
  orderedAssetIds: string[];
  assets: AssetDto[];
};

export type PrintReadinessWarning = {
  assetId: string;
  severity: string;
  code: string;
  message: string;
};

export type PrintReadinessResponse = {
  templateId: string;
  pageCount: number;
  slotsFilled: number;
  minLongEdgePx: number;
  softPhotoCount: number;
  warningCount: number;
  warnings: PrintReadinessWarning[];
};

export type AssetDisplayVersion = "original" | "restored";

export type AssetDto = {
  id: string;
  albumId: string;
  orderIndex: number;
  caption: string | null;
  thumbnailUrl?: string | null;
  original: {
    storageKey: string;
    width: number | null;
    height: number | null;
    contentType: string | null;
  } | null;
  activeVersionId: string | null;
  displayVersion: AssetDisplayVersion;
  versions: AssetVersionDto[];
};

export type RemasterJobDto = {
  id: string;
  assetId: string;
  status: string;
  preset: string;
  creditCharged: boolean;
  resultVersionId: string | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
};

export type CreditsBalanceDto = {
  balance: number;
  freeTasteUsed: boolean;
};

export type CheckoutProductDto = {
  sku: string;
  name: string;
  description: string;
  amountCents: number;
  currency: string;
  includedRemasterCredits: number;
};
