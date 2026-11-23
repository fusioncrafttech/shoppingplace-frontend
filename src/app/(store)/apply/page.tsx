import type { Metadata } from "next";
import ApplyView from "@/components/store/ApplyView";

export const metadata: Metadata = { title: "Apply as Agent" };

export default function ApplyPage() {
  return <ApplyView />;
}
