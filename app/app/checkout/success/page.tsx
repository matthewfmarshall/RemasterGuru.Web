import { Suspense } from "react";
import { CheckoutSuccessContent } from "./checkout-success-content";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <p className="py-8 text-center text-sm text-zinc-600">Loading…</p>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
