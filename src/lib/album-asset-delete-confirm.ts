const STORAGE_PREFIX = "remaster-guru:skip-asset-delete-confirm:";

export function skipAssetDeleteConfirmKey(albumId: string): string {
  return `${STORAGE_PREFIX}${albumId}`;
}

export function shouldSkipAssetDeleteConfirm(albumId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(skipAssetDeleteConfirmKey(albumId)) === "1";
  } catch {
    return false;
  }
}

export function setSkipAssetDeleteConfirm(albumId: string, skip: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const key = skipAssetDeleteConfirmKey(albumId);
    if (skip) {
      window.localStorage.setItem(key, "1");
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore quota / private mode
  }
}
