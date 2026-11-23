import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutView from "@/components/store/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="px-6 py-20 text-sm">Loading checkout…</div>}>
      <CheckoutView />
    </Suspense>
  );
}
