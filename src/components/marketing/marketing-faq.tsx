"use client";

import { useState } from "react";

const items = [
  {
    id: "faithful",
    question: "How faithful is the restore?",
    answer:
      "We aim to keep the same people, poses, and moment — not invent a new person. When part of a face is torn or faded, repair fills in what was on the paper using what is still visible. You always see before-and-after and choose what goes in your book.",
  },
  {
    id: "faces",
    question: "Are you changing faces or making people look “AI perfect”?",
    answer:
      "Repair is tuned to preserve identity, clothing, and framing. Very damaged faces may still show small differences. Pick the result that looks right to your family — we do not print without your approval.",
  },
  {
    id: "originals",
    question: "What happens to my originals?",
    answer:
      "We keep your uploads so you can finish your book. You can download originals and restored copies. Retention and deletion are described in our Privacy Policy (coming soon).",
  },
  {
    id: "repair-vs-uplift",
    question: "What is the difference between repair and remaster?",
    answer:
      "Repair targets physical print damage — tears, cracks, heavy fading, creases. Remaster (uplift) is for scans that are intact but small or soft: we sharpen detail and prepare a higher-resolution file for larger spreads. Both use the same review step; you pick what looks right before it goes in your book.",
  },
  {
    id: "optional",
    question: "Do I have to pay for restoration?",
    answer:
      "No. Build and order an album with your own files only. Repair and remaster are optional and count toward restoration credits in the Restore bundle when you want them.",
  },
  {
    id: "privacy",
    question: "Who sees my photos?",
    answer:
      "Your photos are processed to provide the service, including secure repair with technology partners. We do not sell your images. Full details will be in our Privacy Policy.",
  },
  {
    id: "print",
    question: "Will it look good printed?",
    answer:
      "We preview every spread before checkout and warn you if a photo may look soft at the size you chose. Restored files are prepared with print in mind; final color depends on paper and ink.",
  },
  {
    id: "shipping",
    question: "How long does shipping take?",
    answer:
      "We ship to US addresses only for now. Production and delivery times depend on your book and are shown at checkout. Print partner production timelines are being confirmed after our sample order.",
  },
];

export function MarketingFaq() {
  const [openId, setOpenId] = useState<string | null>("faithful");

  return (
    <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`faq-${item.id}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-stone-900 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-amber-700"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                {item.question}
                <span className="text-stone-500" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-${item.id}`}
              hidden={!isOpen}
              className="px-5 pb-4 text-sm leading-relaxed text-stone-700"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
