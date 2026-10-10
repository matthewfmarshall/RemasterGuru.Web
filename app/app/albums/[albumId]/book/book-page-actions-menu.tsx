"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/ui";
import type { AssetDto } from "@/src/lib/api";
import {
  type RemasterPreset,
  useAssetRemasterJob,
} from "@/src/lib/api/use-asset-remaster-job";
import { AlbumAssetDelete } from "../../album-asset-delete";

type BookPageActionsMenuProps = {
  albumId: string;
  asset: AssetDto;
  pageIndex: number;
  disabled?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAcceptForPrint: () => void;
  onDeleted: () => void;
  onRemasterSucceeded: () => void;
};

const REMASTER_ITEMS: { preset: RemasterPreset; label: string }[] = [
  { preset: "conservative", label: "Conservative touch-up" },
  { preset: "damage", label: "Repair damage" },
  { preset: "fade", label: "Fix fade" },
];

const MENU_ITEM_CLASS =
  "block w-full px-3 py-2 text-left text-zinc-900 hover:bg-zinc-50 disabled:text-zinc-400 disabled:opacity-50";

export function BookPageActionsMenu({
  albumId,
  asset,
  pageIndex,
  disabled,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onAcceptForPrint,
  onDeleted,
  onRemasterSucceeded,
}: BookPageActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { busy: remasterBusy, error: remasterError, startRemaster } =
    useAssetRemasterJob({
      assetId: asset.id,
      onSucceeded: onRemasterSucceeded,
    });

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const menuDisabled = disabled || remasterBusy;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="secondary"
        className="px-2 py-1 text-xs"
        disabled={menuDisabled}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Page ${pageIndex + 1} actions`}
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 min-w-[12rem] rounded-lg border border-zinc-200 bg-white py-1 text-sm text-zinc-900 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            disabled={!canMoveUp || menuDisabled}
            onClick={() => {
              setOpen(false);
              onMoveUp();
            }}
          >
            Move up
          </button>
          <button
            type="button"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            disabled={!canMoveDown || menuDisabled}
            onClick={() => {
              setOpen(false);
              onMoveDown();
            }}
          >
            Move down
          </button>
          <button
            type="button"
            role="menuitem"
            className={MENU_ITEM_CLASS}
            disabled={menuDisabled || asset.acceptedForPrint}
            onClick={() => {
              setOpen(false);
              onAcceptForPrint();
            }}
          >
            Mark page ready for print
          </button>
          <div className="my-1 border-t border-zinc-100" />
          <p className="px-3 py-1 text-xs font-medium text-zinc-500">Remaster</p>
          {REMASTER_ITEMS.map((item) => (
            <button
              key={item.preset}
              type="button"
              role="menuitem"
              className={MENU_ITEM_CLASS}
              disabled={menuDisabled}
              onClick={() => {
                setOpen(false);
                void startRemaster(item.preset);
              }}
            >
              {item.label}
            </button>
          ))}
          <div className="my-1 border-t border-zinc-100" />
          <AlbumAssetDelete
            albumId={albumId}
            assetId={asset.id}
            label="Remove from book"
            className="block w-full rounded-none px-3 py-2 text-left text-sm font-normal hover:bg-zinc-50"
            onDeleted={() => {
              setOpen(false);
              onDeleted();
            }}
          />
        </div>
      ) : null}
      {remasterBusy ? (
        <p className="mt-1 text-xs text-zinc-500">Remastering…</p>
      ) : null}
      {remasterError ? (
        <p className="mt-1 text-xs text-red-700">{remasterError}</p>
      ) : null}
    </div>
  );
}
