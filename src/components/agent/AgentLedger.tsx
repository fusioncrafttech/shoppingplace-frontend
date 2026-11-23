"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { payouts } from "@/data/records";
import { formatDate, inr } from "@/lib/format";

export default function AgentLedger() {
  const lines = payouts.filter((line) => line.agent === "Atelier North");
  return (
    <div>
      <h1 className="font-display text-4xl">Ledger</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#58655d]">The same gross, commission, net, status, and reference the owner sees for your lines.</p>
      <div className="mt-5 overflow-x-auto border border-[#e4e2d9] bg-white">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-[#eeeae2] text-xs uppercase tracking-wide text-[#6d7a72]">
            <tr>
              {["Order", "Gross", "Discount", "Rate", "Commission", "Shipping", "Net", "Status", "Hold until", "Reference"].map((heading) => (
                <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-b border-[#eeeae2]">
                <td className="px-3 py-3">{line.childId}</td>
                <td className="px-3 py-3">{inr(line.gross)}</td>
                <td className="px-3 py-3">{inr(line.discount)}</td>
                <td className="px-3 py-3">{line.rate}%</td>
                <td className="px-3 py-3">{inr(line.commission)}</td>
                <td className="px-3 py-3">{inr(line.shippingShare)}</td>
                <td className="px-3 py-3">{inr(line.net)}</td>
                <td className="px-3 py-3"><StatusBadge status={line.status} /></td>
                <td className="px-3 py-3">{formatDate(line.holdUntil)}</td>
                <td className="px-3 py-3">{line.utr ? `${line.mode} · ${line.utr}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
