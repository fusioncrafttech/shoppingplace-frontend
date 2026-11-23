import type { Metadata } from "next";
import OrderDetailView from "@/components/store/OrderDetailView";

export const metadata: Metadata = { title: "Order" };

export default async function AccountOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailView id={id} />;
}
