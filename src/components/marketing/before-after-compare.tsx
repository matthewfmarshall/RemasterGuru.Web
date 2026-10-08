"use client";

import Image from "next/image";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

type BeforeAfterCompareProps = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  /** Overrides default max width on the compare track (e.g. `max-w-none` in a grid). */
  trackClassName?: string;
  showDragHint?: boolean;
  beforeLabel?: string;
  afterLabel?: string;
};

const LABEL_HIDE_THRESHOLD = 2;

function PlaceholderPanel({
  variant,
  label,
  showLabel = true,
}: {
  variant: "before" | "after";
  label: string;
  showLabel?: boolean;
}) {
  const isBefore = variant === "before";
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center ${
        isBefore
          ? "bg-gradient-to-br from-stone-300 via-stone-200 to-amber-100"
          : "bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200"
      }`}
      aria-hidden={!showLabel}
    >
      {showLabel && (
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${
            isBefore ? "text-stone-600" : "text-amber-800/80"
          }`}
        >
          {label}
        </span>
      )}
      <span className="mt-2 max-w-[12rem] text-center text-sm text-stone-600/90">
        {isBefore
          ? "Demo — swap in your family scan"
          : "Demo — restored for print"}
      </span>
      {isBefore && (
        <div
          className="pointer-events-none absolute inset-8 rounded-sm border border-stone-400/40 bg-stone-400/10"
          style={{
            backgroundImage:
              "linear-gradient(105deg, transparent 48%, rgba(120,53,15,0.35) 49%, rgba(120,53,15,0.35) 51%, transparent 52%)",
          }}
        />
      )}
    </div>
  );
}

export function BeforeAfterCompare({
  beforeSrc = "/marketing/baby-before.jpg",
  afterSrc = "/marketing/baby-after.jpg",
  beforeAlt = "Vintage infant portrait with fading, yellowing, and soft focus from age",
  afterAlt = "Same portrait with fading reduced and detail sharpened for print",
  className = "",
  trackClassName = "",
  showDragHint = true,
  beforeLabel = "Original",
  afterLabel = "Restored",
}: BeforeAfterCompareProps) {
  const [position, setPosition] = useState(50);
  const [usePlaceholders, setUsePlaceholders] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const dragging = useRef(false);

  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clamp(pct));
  }, []);

  const onPointerDown = (e: PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => clamp(p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => clamp(p + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  const showImages = !usePlaceholders;
  const hideOriginalLabel = position <= LABEL_HIDE_THRESHOLD;
  const hideAfterLabel = position >= 100 - LABEL_HIDE_THRESHOLD;

  return (
    <div className={className}>
      <div
        ref={trackRef}
        className={`relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-lg shadow-stone-900/10 sm:aspect-[3/4] ${trackClassName}`}
        role="group"
        aria-labelledby={labelId}
      >
        <p id={labelId} className="sr-only">
          Before and after photo comparison. Use arrow keys or drag the handle
          to reveal more of the original or restored image.
        </p>

        <div className="absolute inset-0">
          {showImages ? (
            <Image
              src={afterSrc}
              alt={afterAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 28rem"
              onError={() => setUsePlaceholders(true)}
              priority
            />
          ) : (
            <PlaceholderPanel
              variant="after"
              label={afterLabel}
              showLabel={!hideAfterLabel}
            />
          )}
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {showImages ? (
            <Image
              src={beforeSrc}
              alt={beforeAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 28rem"
              onError={() => setUsePlaceholders(true)}
              priority
            />
          ) : (
            <PlaceholderPanel
              variant="before"
              label={beforeLabel}
              showLabel={!hideOriginalLabel}
            />
          )}
        </div>

        <div
          className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize bg-white/90 shadow-md"
          style={{ left: `${position}%` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <button
            type="button"
            className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-amber-700/30 bg-white text-stone-700 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            aria-label="Drag to compare before and after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            role="slider"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <span className="text-xs font-bold" aria-hidden="true">
              ↔
            </span>
          </button>
        </div>

        {!hideOriginalLabel && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-stone-900/70 px-2 py-1 text-xs font-medium text-white">
            {beforeLabel}
          </div>
        )}
        {!hideAfterLabel && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-amber-800/80 px-2 py-1 text-xs font-medium text-white">
            {afterLabel}
          </div>
        )}
      </div>
      {showDragHint && (
        <p className="mt-3 text-center text-sm text-stone-600">
          Drag to compare · Arrow keys move the handle
        </p>
      )}
    </div>
  );
}
