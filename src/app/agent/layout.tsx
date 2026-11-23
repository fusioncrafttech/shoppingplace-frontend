import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { managedProducts, orders } from "@/data/records";

export const metadata: Metadata = { title: "Agent" };

export default function AgentLayout({ children }: { children: ReactNode }) {
  const productQueue = managedProducts.filter(
    (item) => item.agent === "Atelier North" && (item.status === "Pending approval" || item.status === "Revision pending"),
  ).length;
  const newOrders = orders.filter((order) =>
    order.children.some((child) => child.seller === "Atelier North" && child.status === "Confirmed"),
  ).length;

  return (
    <DashboardShell
      role="Agent"
      name="Atelier North"
      nav={[
        { href: "/agent", label: "Overview" },
        { href: "/agent/products", label: "Products", badge: productQueue },
        { href: "/agent/orders", label: "Orders", badge: newOrders },
        { href: "/agent/ledger", label: "Ledger" },
        { href: "/agent/profile", label: "Profile" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
