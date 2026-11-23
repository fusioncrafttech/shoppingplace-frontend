"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { btnGhost, btnPrimary, inputClass } from "@/components/ui/fields";
import { orders as seedOrders, payouts } from "@/data/records";
import { formatDateTime, inr } from "@/lib/format";
import type { ChildOrder, ChildStatus, ParentOrder } from "@/types/store";

const fulfillment: ChildStatus[] = ["Confirmed", "Packed", "Shipped", "Delivered"];

export default function OrdersConsole() {
  const [rows, setRows] = useState<ParentOrder[]>(seedOrders);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(seedOrders[0]?.id ?? "");
  const [notice, setNotice] = useState("");
  const [ship, setShip] = useState({ courier: "", tracking: "", dispatchDate: "" });

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((order) =>
      [order.id, order.customer.name, order.paymentId ?? "", ...order.children.map((child) => child.seller)]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query, rows]);
  const order = rows.find((item) => item.id === selected);

  function updateChild(childId: string, patch: Partial<ChildOrder>, message: string) {
    setRows((current) =>
      current.map((item) => ({
        ...item,
        children: item.children.map((child) => (child.id === childId ? { ...child, ...patch } : child)),
      })),
    );
    setNotice(message);
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-[#58655d]">One parent purchase, one child order per seller. Search by order, customer, seller, or Razorpay id.</p>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" className={`${inputClass} mt-4 max-w-md`} />
      {notice ? <p className="mt-4 border border-[#d7e4dc] bg-[#eef6f1] px-4 py-3 text-sm">{notice}</p> : null}
      <div className="mt-5 grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="border border-[#e4e2d9] bg-white">
          {visible.length === 0 ? <p className="p-4 text-sm">No orders match.</p> : null}
          {visible.map((item) => (
            <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`block w-full border-b border-[#eeeae2] px-4 py-3 text-left ${selected === item.id ? "bg-[#f3f1e9]" : ""}`}>
              <span className="flex items-center justify-between gap-2"><span className="font-semibold">{item.id}</span><StatusBadge status={item.status} /></span>
              <span className="mt-1 block text-xs text-[#6d7a72]">{item.customer.name} · {inr(item.total)}</span>
            </button>
          ))}
        </div>
        {order ? (
          <article className="border border-[#e4e2d9] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl">{order.id}</h2>
              <StatusBadge status={order.status} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-[#6d7a72]">Customer</dt><dd>{order.customer.name} · {order.customer.phone}</dd></div>
              <div><dt className="text-xs text-[#6d7a72]">Placed</dt><dd>{formatDateTime(order.placedAt)}</dd></div>
              <div><dt className="text-xs text-[#6d7a72]">Razorpay</dt><dd>{order.paymentId ?? "No payment id"} · {order.captureState}</dd></div>
              <div><dt className="text-xs text-[#6d7a72]">Amount</dt><dd>{inr(order.total)}{order.refunded ? ` · refunded ${inr(order.refunded)}` : ""}</dd></div>
              <div><dt className="text-xs text-[#6d7a72]">Promo</dt><dd>{order.promo ?? "None"} · discount {inr(order.discount)} · shipping {inr(order.shipping)}</dd></div>
              <div><dt className="text-xs text-[#6d7a72]">Gateway fee</dt><dd>{order.razorpayFee ? `${inr(order.razorpayFee)} borne by the platform` : "—"}</dd></div>
            </dl>
            <div className="mt-6 grid gap-4">
              {order.children.length === 0 ? <p className="text-sm text-[#58655d]">No fulfillment order. Payment was not captured, so stock was not reduced.</p> : null}
              {order.children.map((child) => {
                const payout = payouts.find((line) => line.id === child.payoutId);
                return (
                  <section key={child.id} className="border border-[#e4e2d9] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{child.id} · {child.seller}</h3>
                      <StatusBadge status={child.status} />
                    </div>
                    <ul className="mt-3 text-sm leading-6">
                      {child.lines.map((line) => (
                        <li key={line.name}>{line.name} × {line.qty} · base {inr(line.base)}{line.commission !== undefined ? ` · commission ${inr(line.commission)}` : ""}</li>
                      ))}
                    </ul>
                    {payout ? (
                      <p className="mt-3 bg-[#f3f1e9] p-3 text-sm leading-6">
                        Snapshot: rate {payout.rate}% · base {inr(payout.base)} · commission {inr(payout.commission)} · shipping share {inr(payout.shippingShare)} · agent net {inr(payout.net)} · {payout.status} until {payout.holdUntil}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-[#58655d]">Platform line. Direct revenue, no agent payout. Shipping share {inr(child.shippingShare)}.</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-end gap-2">
                      <label className="text-xs font-semibold">
                        {child.sellerType === "platform" ? "Fulfillment" : "Override fulfillment"}
                        <select
                          value={fulfillment.includes(child.status) ? child.status : "Confirmed"}
                          onChange={(event) => updateChild(child.id, { status: event.target.value as ChildStatus }, "Fulfillment updated.")}
                          className={`${inputClass} mt-1.5`}
                        >
                          {fulfillment.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </label>
                      <input placeholder="Courier" value={ship.courier} onChange={(event) => setShip({ ...ship, courier: event.target.value })} className={`${inputClass} max-w-36`} />
                      <input placeholder="Tracking" value={ship.tracking} onChange={(event) => setShip({ ...ship, tracking: event.target.value })} className={`${inputClass} max-w-40`} />
                      <button type="button" className={btnGhost} onClick={() => updateChild(child.id, { status: "Shipped", courier: ship.courier, tracking: ship.tracking, dispatchDate: new Date().toISOString().slice(0, 10) }, "Marked shipped with the tracking entered.")}>Mark shipped</button>
                      <button
                        type="button"
                        className={btnPrimary}
                        onClick={() => {
                          const afterShip = ["Shipped", "Delivered", "Return in progress", "Returned"].includes(child.status);
                          updateChild(
                            child.id,
                            { status: afterShip ? "Return in progress" : "Cancelled" },
                            afterShip
                              ? "Return opened. The payout line is blocked and cannot be settled while this is open."
                              : "Cancelled before shipment. The customer is refunded through Razorpay and the payout line is voided.",
                          );
                        }}
                      >
                        Refund
                      </button>
                    </div>
                  </section>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
}
