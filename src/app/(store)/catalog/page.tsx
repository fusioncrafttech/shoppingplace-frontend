import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogView from "@/components/store/CatalogView";

export const metadata: Metadata = { title: "Catalog" };

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="px-6 py-20 text-sm">Loading the catalog…</div>}>
      <CatalogView />
    </Suspense>
  );
}
