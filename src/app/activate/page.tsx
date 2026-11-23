import type { Metadata } from "next";
import ActivateView from "@/components/agent/ActivateView";

export const metadata: Metadata = { title: "Activate account" };

export default function ActivatePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6]">
      <ActivateView />
    </main>
  );
}
