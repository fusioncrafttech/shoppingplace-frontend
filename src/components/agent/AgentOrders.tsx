"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { btnGhost, btnPrimary, inputClass } from "@/components/ui/fields";
import { orders } from "@/data/records";
import { formatDate } from "@/lib/format";
import type { ChildOrder, ChildStatus } from "@/types/store";

type Row = ChildOrder & { parentId: string };

const seed: Row[] = orders.flatMap((order) =>
  order.children
    .filter((child) => child.seller === "Atelier North")
    .map((child) => ({ ...child, parentId: order.id })),
);

export default function AgentOrders() {
  const [rows, setRows] = useState<Row[]>(seed);
  const [slip, setSlip] = useState<Row | null>(null);
  const [forms, setForms] = useState<Record<string, { courier: string; tracking: string; dispatchDate: string }>>({});
  const [notice, setNotice] = useState("");

  function patch(id: string, status: ChildStatus, extra?: Partial<ChildOrder>, message?: string) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status, ...extra } : row)));
    if (message) setNotice(message);
  }

  function printSlip() {
    const node = document.getElementById("packing-slip");
    if (!node) return;
    const win = window.open("", "slip", "width=720,height=900");
    if (!win) return;
    win.document.write(`<html><head><title>Packing slip</title><style>body{font-family:Georgia,serif;color:#173c37;padding:32px}h1{font-weight:500}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:8px 0;border-bottom:1px solid #ddd}</style></head><body>${node.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-[#58655d]">Only child orders for Atelier North. The packing slip omits payment and commission.</p>
      {notice ? <p className="mt-4 border border-[#d7e4dc] bg-[#eef6f1] px-4 py-3 text-sm">{notice}</p> : null}
      <div className="mt-5 grid gap-4">
        {rows.map((row) => {
          const form = forms[row.id] ?? { courier: row.courier ?? "", tracking: row.tracking ?? "", dispatchDate: row.dispatchDate ?? "" };
          return (
            <article key={row.id} className="border border-[#e4e2d9] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{row.id}</h2>
                <StatusBadge status={row.status} />
              </div>
              <p className="mt-1 text-xs text-[#6d7a72]">Parent {row.parentId}</p>
              <ul className="mt-3 text-sm">
                {row.lines.map((line) => (
                  <li key={line.name}>{line.name} × {line.qty}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm">{row.shipTo.name} · {row.shipTo.phone}<br />{row.shipTo.address}</p>
              {row.tracking ? <p className="mt-2 text-sm">{row.courier} · {row.tracking}{row.dispatchDate ? ` · ${formatDate(row.dispatchDate)}` : ""}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={btnGhost} onClick={() => setSlip(row)}>Packing slip</button>
                {row.status === "Confirmed" ? <button type="button" className={btnPrimary} onClick={() => patch(row.id, "Packed", undefined, "Marked packed.")}>Mark packed</button> : null}
                {row.status === "Confirmed" || row.status === "Packed" ? (
                  <button type="button" className={btnGhost} onClick={() => patch(row.id, "Cancelled", undefined, "Cancelled before shipment. The customer is refunded and the payout line is voided.")}>Cancel</button>
                ) : null}
              </div>
              {row.status === "Packed" || row.status === "Shipped" || row.status === "Delivered" ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <input placeholder="Courier" value={form.courier} onChange={(event) => setForms({ ...forms, [row.id]: { ...form, courier: event.target.value } })} className={inputClass} />
                  <input placeholder="Tracking number" value={form.tracking} onChange={(event) => setForms({ ...forms, [row.id]: { ...form, tracking: event.target.value } })} className={inputClass} />
                  <input type="date" value={form.dispatchDate} onChange={(event) => setForms({ ...forms, [row.id]: { ...form, dispatchDate: event.target.value } })} className={inputClass} />
                  <button
                    type="button"
                    className={btnPrimary}
                    onClick={() => {
                      if (!form.courier || !form.tracking || !form.dispatchDate) {
                        setNotice("Courier, tracking number, and dispatch date are required.");
                        return;
                      }
                      patch(row.id, "Shipped", form, "Shipment recorded.");
                    }}
                  >
                    Save shipment
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      {slip ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173c37]/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6">
            <div id="packing-slip">
              <p className="text-xs tracking-[0.16em] text-[#a36545]">PACKING SLIP</p>
              <h2 className="mt-2 font-display text-3xl">{slip.id}</h2>
              <p className="mt-4 text-sm leading-6">
                {slip.shipTo.name}<br />
                {slip.shipTo.phone}<br />
                {slip.shipTo.address}
              </p>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {slip.lines.map((line) => (
                    <tr key={line.name}>
                      <td className="py-2">{line.name}</td>
                      <td className="py-2 text-right">{line.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-[#6d7a72]">Quantities only. Payment, commission, and payout details are not on this slip.</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" className={btnPrimary} onClick={printSlip}>Print</button>
              <button type="button" className={btnGhost} onClick={() => setSlip(null)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
