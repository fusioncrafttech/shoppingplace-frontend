"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { inputClass } from "@/components/ui/fields";
import { customerAddresses, customerProfile, orders } from "@/data/records";
import { formatDateTime, inr } from "@/lib/format";
import type { Address } from "@/types/store";

export default function AccountView() {
  const { orders: placed } = useCart();
  const [profile, setProfile] = useState(customerProfile);
  const [saved, setSaved] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(customerAddresses);
  const history = orders.filter((order) => order.customer.email === customerProfile.email && order.captureState === "Captured");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <h1 className="font-display text-5xl">Your account</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl">Profile</h2>
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
          >
            <label className="text-xs font-semibold">Name<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">Email<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">Mobile<input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
            <button type="submit" className="mt-1 min-h-11 bg-[#173c37] px-5 text-sm font-semibold text-[#fbfaf6]">Save profile</button>
            {saved ? <p className="text-sm text-[#1d5c42]">Profile saved on this page.</p> : null}
          </form>
        </section>
        <section>
          <h2 className="font-display text-3xl">Addresses</h2>
          <div className="mt-4 grid gap-3">
            {addresses.map((address) => (
              <article key={address.id} className="border border-[#e4e2d9] p-4">
                <p className="text-sm font-semibold">{address.label}</p>
                <p className="mt-1 text-sm leading-6">{address.lines}</p>
                <p className="mt-1 text-xs text-[#6d7a72]">{address.phone}</p>
                <button type="button" className="mt-2 text-xs font-semibold text-[#a36545]" onClick={() => setAddresses((current) => current.filter((item) => item.id !== address.id))}>
                  Remove
                </button>
              </article>
            ))}
            {addresses.length === 0 ? <p className="text-sm text-[#58655d]">No saved addresses yet.</p> : null}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl">Orders</h2>
        {placed.length === 0 && history.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No orders yet" text="When a payment is captured, the purchase will show here with tracking for each seller." action={{ href: "/catalog", label: "Start shopping" }} />
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {placed.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="block border border-[#e4e2d9] p-4 hover:border-[#173c37]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{order.id}</p>
                  <StatusBadge status="Paid" />
                </div>
                <p className="mt-2 text-sm text-[#58655d]">{formatDateTime(order.placedAt)} · {inr(order.total)}</p>
                <p className="mt-1 text-sm">{order.groups.map((group) => group.seller).join(" · ")}</p>
              </Link>
            ))}
            {history.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="block border border-[#e4e2d9] p-4 hover:border-[#173c37]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{order.id}</p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm text-[#58655d]">{formatDateTime(order.placedAt)} · {inr(order.total)}</p>
                <p className="mt-2 text-sm text-[#40564e]">
                  {order.children.map((child) => `${child.seller}: ${child.status}`).join(" · ")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
