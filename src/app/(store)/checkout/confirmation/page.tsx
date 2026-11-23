import type { Metadata } from "next";
import { Suspense } from "react";
import ConfirmationView from "@/components/store/ConfirmationView";

export const metadata: Metadata = { title: "Order confirmed" };

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="px-6 py-20 text-sm">Loading the order…</div>}>
      <ConfirmationView />
    </Suspense>
  );
}
