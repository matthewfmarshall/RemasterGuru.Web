const DISMISS_KEY = "rg-pwa-install-dismissed";
const VISITED_APP_KEY = "rg-pwa-visited-app";
const ALBUM_SAVED_KEY = "rg-pwa-album-saved";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function isInstallPromptDismissed(): boolean {
  if (!canUseStorage()) return true;
  return window.localStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissInstallPrompt(): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(DISMISS_KEY, "1");
}

export function markAppVisited(): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(VISITED_APP_KEY, "1");
}

export function hasVisitedApp(): boolean {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(VISITED_APP_KEY) === "1";
}

export function markAlbumSaved(): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ALBUM_SAVED_KEY, "1");
}

export function hasAlbumSaved(): boolean {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(ALBUM_SAVED_KEY) === "1";
}

export function shouldOfferInstall(): boolean {
  if (!canUseStorage()) return false;
  if (isInstallPromptDismissed()) return false;
  return hasVisitedApp() || hasAlbumSaved();
}
