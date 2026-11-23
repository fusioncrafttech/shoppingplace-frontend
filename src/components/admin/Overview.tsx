"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { inputClass } from "@/components/ui/fields";
import { agents, orders, payouts, recoveries } from "@/data/records";
import { computeAnalytics } from "@/lib/analytics";
import { formatDateTime, inr } from "@/lib/format";

const cards = [
  { key: "gmv", label: "GMV", money: true, hint: "Commission bases on paid lines, before refunds. Shipping is excluded." },
  { key: "netGmv", label: "Net GMV", money: true, hint: "GMV after refunded commission bases are removed." },
  { key: "directRevenue", label: "Direct revenue", money: true, hint: "Platform bases still retained, plus the platform shipping share." },
  { key: "commissionEarned", label: "Commission earned", money: true, hint: "Commission on agent lines that have not been voided." },
  { key: "payoutLiability", label: "Payout liability", money: true, hint: "Agent nets on hold, blocked, or eligible, minus open recoveries." },
  { key: "paidOut", label: "Paid out", money: true, hint: "Settled payout amounts logged with a reference." },
  { key: "orders", label: "Orders", money: false, hint: "Parent orders that are paid, partially refunded, or refunded." },
  { key: "activeAgents", label: "Active agents", money: false, hint: "Accounts in Active status." },
] as const;

export default function Overview() {
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-10-15");
  const [focus, setFocus] = useState<(typeof cards)[number]["key"]>("gmv");
  const figures = useMemo(
    () => computeAnalytics(orders, payouts, recoveries, agents, from, to),
    [from, to],
  );
  const ranged = orders.filter((order) => order.placedAt.slice(0, 10) >= from && order.placedAt.slice(0, 10) <= to);
  const card = cards.find((item) => item.key === focus) ?? cards[0];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Overview</h1>
          <p className="mt-2 text-sm text-[#58655d]">Figures use the definitions on the operating record. Pick a measure to see the rows behind it.</p>
        </div>
        <div className="flex gap-3">
          <label className="text-xs font-semibold">From<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
          <label className="text-xs font-semibold">To<input type="date" value={to} onChange={(event) => setTo(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <button key={item.key} type="button" onClick={() => setFocus(item.key)} className={`border p-4 text-left ${focus === item.key ? "border-[#173c37] bg-white" : "border-[#e4e2d9] bg-[#fbfaf6]"}`}>
            <span className="text-[11px] font-semibold tracking-wide text-[#6d7a72]">{item.label}</span>
            <span className="mt-2 block font-display text-3xl">{item.money ? inr(figures[item.key]) : figures[item.key]}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#40564e]">{card.hint}</p>
      <div className="mt-4 overflow-x-auto border border-[#e4e2d9] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-[#e4e2d9] text-xs uppercase tracking-wide text-[#6d7a72]">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">When</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {ranged.map((order) => (
              <tr key={order.id} className="border-b border-[#eeeae2]">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{formatDateTime(order.placedAt)}</td>
                <td className="px-4 py-3">{order.customer.name}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3">{inr(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
