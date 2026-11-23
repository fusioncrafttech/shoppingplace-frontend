import type { Metadata } from "next";
import type { ReactNode } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { applications, managedProducts } from "@/data/records";

export const metadata: Metadata = { title: "Superadmin" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const agentQueue = applications.filter(
    (item) => item.status === "Submitted" || item.status === "Information requested",
  ).length;
  const productQueue = managedProducts.filter(
    (item) => item.status === "Pending approval" || item.status === "Revision pending",
  ).length;

  return (
    <DashboardShell
      role="Superadmin"
      name="Platform owner"
      nav={[
        { href: "/admin", label: "Overview" },
        { href: "/admin/agents", label: "Agents", badge: agentQueue },
        { href: "/admin/products", label: "Products", badge: productQueue },
        { href: "/admin/orders", label: "Orders" },
        { href: "/admin/ledger", label: "Ledger" },
        { href: "/admin/settings", label: "Settings" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
