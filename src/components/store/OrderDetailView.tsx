"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { customerProfile, orders } from "@/data/records";
import { formatDate, formatDateTime, inr } from "@/lib/format";

export default function OrderDetailView({ id }: { id: string }) {
  const { orders: placed } = useCart();
  const fresh = placed.find((order) => order.id === id);
  const saved = orders.find((order) => order.id === id && order.customer.email === customerProfile.email);

  if (!fresh && !saved) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Order not found" text="That purchase is not on this account." action={{ href: "/account", label: "Back to account" }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <Link href="/account" className="text-sm font-medium text-[#a36545]">← Account</Link>
      <h1 className="mt-4 font-display text-5xl">{id}</h1>
      {fresh ? (
        <div className="mt-6 grid gap-4">
          <p className="text-sm text-[#58655d]">Placed {formatDateTime(fresh.placedAt)} · Paid {inr(fresh.total)}</p>
          <p className="text-sm">Deliver to {fresh.address}</p>
          {fresh.groups.map((group) => (
            <section key={group.seller} className="border border-[#e4e2d9] p-4">
              <div className="flex items-center justify-between"><h2 className="font-medium">{group.seller}</h2><StatusBadge status={group.status} /></div>
              <ul className="mt-3 text-sm">
                {group.lines.map((line) => (
                  <li key={line.name}>{line.name} × {line.qty}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[#6d7a72]">Tracking will show here after this seller adds a courier and a tracking number.</p>
            </section>
          ))}
        </div>
      ) : null}
      {saved ? (
        <div className="mt-6 grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={saved.status} />
            <p className="text-sm text-[#58655d]">{formatDateTime(saved.placedAt)} · {inr(saved.total)}</p>
          </div>
          {saved.children.map((child) => (
            <section key={child.id} className="border border-[#e4e2d9] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-medium">{child.seller}</h2>
                <StatusBadge status={child.status} />
              </div>
              <ul className="mt-3 text-sm leading-6">
                {child.lines.map((line) => (
                  <li key={line.name}>{line.name} × {line.qty}</li>
                ))}
              </ul>
              {child.tracking ? (
                <p className="mt-3 text-sm">
                  {child.courier} · {child.tracking}
                  {child.dispatchDate ? ` · dispatched ${formatDate(child.dispatchDate)}` : ""}
                </p>
              ) : (
                <p className="mt-3 text-sm text-[#58655d]">Not shipped yet.</p>
              )}
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
