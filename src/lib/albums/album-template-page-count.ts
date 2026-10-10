/**
 * Page capacity for an album print template. Mirrors API AlbumTemplateCatalog.GetPageCount.
 * Supports ids like hardcover-12, hardcover-24, hardcover-36, hardcover-48.
 */
export function getAlbumTemplatePageCount(templateId: string): number {
  const trimmed = templateId.trim();
  const match = /^hardcover-(\d+)$/i.exec(trimmed);
  if (match) {
    const pages = Number.parseInt(match[1], 10);
    if (Number.isFinite(pages) && pages > 0) {
      return pages;
    }
  }
  return 24;
}

export function countAssetsPastBookLimit(
  assetCount: number,
  pageCount: number,
): number {
  return Math.max(0, assetCount - pageCount);
}

export function bookLimitSummaryLine(
  assetCount: number,
  pageCount: number,
): string | null {
  const over = countAssetsPastBookLimit(assetCount, pageCount);
  if (over === 0) {
    return null;
  }
  const photos =
    assetCount === 1 ? "1 photo" : `${assetCount} photos`;
  const overLabel =
    over === 1
      ? `1 over ${pageCount}-page limit`
      : `${over} over ${pageCount}-page limit`;
  return `${photos} · ${overLabel}`;
}
