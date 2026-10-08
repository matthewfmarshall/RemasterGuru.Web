"use client";

import { useCallback, useEffect, useState } from "react";
import {
  dismissInstallPrompt,
  markAppVisited,
  shouldOfferInstall,
} from "@/src/lib/pwa/storage";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
}

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneDisplay()) return;

    markAppVisited();
    if (!shouldOfferInstall()) return;

    setIos(isIos());
    setVisible(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const onDismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
  }, []);

  const onInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      dismissInstallPrompt();
      setVisible(false);
    }
  }, [deferredPrompt]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-200/80 bg-amber-50/95 px-4 py-3 shadow-lg backdrop-blur-sm sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm sm:rounded-xl sm:border"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-stone-900">
            Add to Home Screen
          </p>
          {ios ? (
            <p className="mt-1 text-xs leading-relaxed text-stone-700">
              Tap Share, then &ldquo;Add to Home Screen&rdquo; for quick access
              to your albums.
            </p>
          ) : deferredPrompt ? (
            <p className="mt-1 text-xs leading-relaxed text-stone-700">
              Install Remaster Guru for faster access while you work on your
              book.
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-stone-700">
              Use your browser menu to install this app for quicker access.
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          {!ios && deferredPrompt ? (
            <button
              type="button"
              onClick={onInstall}
              className="rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-semibold text-amber-50 hover:bg-amber-900"
            >
              Install
            </button>
          ) : null}
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200/60"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
