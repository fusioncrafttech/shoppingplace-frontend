"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import EmptyState from "@/components/ui/EmptyState";
import { formatDateTime, inr } from "@/lib/format";

export default function ConfirmationView() {
  const params = useSearchParams();
  const { orders } = useCart();
  const order = orders.find((item) => item.id === params.get("id")) ?? orders[0];

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="No captured order" text="A payment that fails stays on checkout. There is no order page for it." action={{ href: "/checkout", label: "Return to checkout" }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 md:px-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-[#1d5c42]">PAYMENT CAPTURED</p>
      <h1 className="mt-3 font-display text-5xl">Order {order.id}</h1>
      <p className="mt-3 text-sm leading-6 text-[#40564e]">
        Placed {formatDateTime(order.placedAt)}. You have one purchase, with a shipment from each seller.
      </p>
      <p className="mt-2 text-sm">Deliver to {order.address}</p>
      <div className="mt-8 grid gap-4">
        {order.groups.map((group) => (
          <section key={group.seller} className="border border-[#e4e2d9] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium">{group.seller}</h2>
              <span className="bg-[#f8efd8] px-2 py-1 text-[11px] font-semibold text-[#6d4e1d]">{group.status}</span>
            </div>
            <ul className="mt-3 grid gap-1 text-sm text-[#40564e]">
              {group.lines.map((line) => (
                <li key={line.name} className="flex justify-between">
                  <span>{line.name} × {line.qty}</span>
                  <span>{inr(line.amount)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[#6d7a72]">Tracking appears here when this seller ships.</p>
          </section>
        ))}
      </div>
      <p className="mt-6 text-lg font-semibold">Paid {inr(order.total)}</p>
      <Link href="/account" className="mt-6 inline-flex min-h-11 items-center bg-[#173c37] px-5 text-sm font-semibold text-[#fbfaf6]">
        View in your account
      </Link>
    </div>
  );
}
