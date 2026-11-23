"use client";

import Link from "next/link";
import { managedProducts, payouts, recoveries } from "@/data/records";
import { formatDate, inr } from "@/lib/format";

const agent = "Atelier North";

export default function AgentHome() {
  const lines = payouts.filter((line) => line.agent === agent);
  const products = managedProducts.filter((item) => item.agent === agent);
  const gross = lines.filter((line) => line.status !== "Void").reduce((total, line) => total + line.base, 0);
  const commission = lines.filter((line) => line.status !== "Void").reduce((total, line) => total + line.commission, 0);
  const due = lines
    .filter((line) => line.status === "On hold" || line.status === "Blocked" || line.status === "Eligible")
    .reduce((total, line) => total + line.net, 0);
  const paid = lines.filter((line) => line.status === "Settled").reduce((total, line) => total + line.net, 0);
  const recovery = recoveries.filter((item) => item.agent === agent && item.status === "Open").reduce((total, item) => total + item.amount, 0);
  const eligible = lines.filter((line) => line.status === "Eligible");
  const earliestHold = lines
    .filter((line) => line.status === "On hold")
    .map((line) => line.holdUntil)
    .sort()[0];
  const counts = {
    pending: products.filter((item) => item.status === "Pending approval").length,
    live: products.filter((item) => item.status === "Live").length,
    rejected: products.filter((item) => item.status === "Rejected").length,
    revision: products.filter((item) => item.status === "Revision pending").length,
  };

  return (
    <div>
      <h1 className="font-display text-4xl">Overview</h1>
      <p className="mt-2 text-sm text-[#58655d]">Figures are for Atelier North only. The rate on these orders is the one copied at payment.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Gross sales", inr(gross)],
          ["Commission deducted", inr(commission)],
          ["Net still due", inr(due)],
          ["Paid out", inr(paid)],
          ["Open recovery", inr(recovery)],
        ].map(([label, value]) => (
          <article key={label} className="border border-[#e4e2d9] bg-white p-4">
            <p className="text-[11px] font-semibold tracking-wide text-[#6d7a72]">{label}</p>
            <p className="mt-2 font-display text-3xl">{value}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#40564e]">
        {eligible.length === 0
          ? earliestHold
            ? `Nothing is eligible yet. The earliest line can be paid on ${formatDate(earliestHold)}.`
            : "No payout lines yet."
          : `${eligible.length} line is eligible for payout.`}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["Pending approval", counts.pending],
          ["Live", counts.live],
          ["Rejected", counts.rejected],
          ["Revision pending", counts.revision],
        ].map(([label, value]) => (
          <Link key={label} href="/agent/products" className="border border-[#e4e2d9] bg-[#fbfaf6] p-4 hover:border-[#173c37]">
            <p className="text-xs text-[#6d7a72]">{label}</p>
            <p className="mt-2 font-display text-3xl">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
