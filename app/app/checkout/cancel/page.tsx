import { Suspense } from "react";
import { CheckoutCancelContent } from "./checkout-cancel-content";

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-sm text-zinc-600">Loading…</p>
      }
    >
      <CheckoutCancelContent />
    </Suspense>
  );
}
