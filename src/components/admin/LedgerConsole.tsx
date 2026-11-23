"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { btnPrimary, inputClass } from "@/components/ui/fields";
import { agents, orders as seedOrders, payouts as seedPayouts, recoveries as seedRecoveries } from "@/data/records";
import { formatDate, inr } from "@/lib/format";
import type { ParentOrder, PayoutLine, PayoutStatus, Recovery } from "@/types/store";

const statuses: Array<PayoutStatus | "All"> = ["All", "On hold", "Blocked", "Eligible", "Settled", "Void"];

export default function LedgerConsole() {
  const [lines, setLines] = useState<PayoutLine[]>(seedPayouts);
  const [recoveries, setRecoveries] = useState<Recovery[]>(seedRecoveries);
  const [parents, setParents] = useState<ParentOrder[]>(seedOrders);
  const [status, setStatus] = useState<PayoutStatus | "All">("Eligible");
  const [selected, setSelected] = useState<string[]>(["PAY-19802"]);
  const [form, setForm] = useState({ date: "2026-10-15", amount: "2540", mode: "NEFT", utr: "", note: "" });
  const [settlement, setSettlement] = useState({ orderId: "SP-20418", date: "", reference: "" });
  const [notice, setNotice] = useState("");

  const filtered = lines.filter((line) => status === "All" || line.status === status);
  const eligible = lines.filter((line) => line.status === "Eligible");
  const byAgent = new Map<string, PayoutLine[]>();
  eligible.forEach((line) => byAgent.set(line.agent, [...(byAgent.get(line.agent) ?? []), line]));

  const agentName = eligible.find((line) => selected.includes(line.id))?.agent;
  const agent = agents.find((item) => item.businessName === agentName);
  const selectedLines = eligible.filter((line) => selected.includes(line.id) && line.agent === agentName);
  const selectedNet = selectedLines.reduce((total, line) => total + line.net, 0);
  const openRecovery = recoveries.filter((item) => item.agent === agentName && item.status === "Open");
  const recoverySum = openRecovery.reduce((total, item) => total + item.amount, 0);
  const due = Math.max(0, Math.round((selectedNet - recoverySum) * 100) / 100);

  const grouped = [...byAgent.entries()];

  function toggle(id: string) {
    const line = eligible.find((item) => item.id === id);
    if (!line) return;
    setSelected((current) => {
      const others = current.filter((item) => eligible.find((entry) => entry.id === item)?.agent === line.agent);
      return others.includes(id) ? others.filter((item) => item !== id) : [...others, id];
    });
    const nextSelected = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected.filter((item) => eligible.find((entry) => entry.id === item)?.agent === line.agent), id];
    const nextLines = eligible.filter((item) => nextSelected.includes(item.id));
    const nextRecovery = recoveries.filter((item) => item.agent === line.agent && item.status === "Open").reduce((total, item) => total + item.amount, 0);
    const nextDue = Math.max(0, nextLines.reduce((total, item) => total + item.net, 0) - nextRecovery);
    setForm((current) => ({ ...current, amount: String(nextDue) }));
  }

  function settle() {
    if (!agent) {
      setNotice("Select eligible lines for one agent.");
      return;
    }
    if (!agent.gstin) {
      setNotice("A GSTIN is required on the agent profile before a payout can be marked settled.");
      return;
    }
    const amount = Number(form.amount);
    if (!form.date || !form.mode || !form.utr.trim()) {
      setNotice("Payout date, amount, mode, and a UTR or UPI reference are required.");
      return;
    }
    if (!amount || amount <= 0 || amount - due > 0.001) {
      setNotice("Amount has to be greater than zero and no more than the amount due.");
      return;
    }
    if (Math.abs(amount - due) > 0.05) {
      setNotice("Enter the full amount due, or leave a line unchecked so the rest stays Eligible.");
      return;
    }
    setLines((current) =>
      current.map((line) =>
        selectedLines.some((item) => item.id === line.id)
          ? { ...line, status: "Settled", payoutDate: form.date, mode: form.mode as PayoutLine["mode"], utr: form.utr.trim(), note: form.note || `Transfer ${inr(amount)} after recovery of ${inr(recoverySum)}.` }
          : line,
      ),
    );
    setRecoveries((current) => current.map((item) => (item.agent === agent.businessName && item.status === "Open" ? { ...item, status: "Cleared" } : item)));
    setSelected([]);
    setNotice(`Settled ${inr(amount)} to ${agent.businessName}. Reference ${form.utr.trim()}.`);
    setForm({ ...form, utr: "", note: "" });
  }

  function noteSettlement() {
    if (!settlement.date || !settlement.reference.trim()) {
      setNotice("A Razorpay settlement note needs a date and a reference. It does not settle an agent.");
      return;
    }
    setParents((current) =>
      current.map((order) =>
        order.id === settlement.orderId ? { ...order, razorpaySettlement: { date: settlement.date, reference: settlement.reference.trim() } } : order,
      ),
    );
    setNotice("Razorpay settlement noted against the parent payment. Agent lines are unchanged.");
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Ledger</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#58655d]">Eligible lines are grouped by agent. A line cannot be settled before its hold date, or without a bank or UPI reference.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {statuses.map((item) => (
          <button key={item} type="button" onClick={() => setStatus(item)} className={`min-h-9 px-3 text-xs font-semibold ${status === item ? "bg-[#173c37] text-[#fbfaf6]" : "border border-[#d5d3c8] bg-white"}`}>{item}</button>
        ))}
      </div>
      {notice ? <p className="mt-4 border border-[#d7e4dc] bg-[#eef6f1] px-4 py-3 text-sm">{notice}</p> : null}

      {status === "Eligible" ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {grouped.length === 0 ? <p className="text-sm">No eligible lines. The earliest hold date is still in the future, or the line is blocked.</p> : null}
            {grouped.map(([name, agentLines]) => {
              const recovery = recoveries.filter((item) => item.agent === name && item.status === "Open");
              return (
                <section key={name} className="border border-[#e4e2d9] bg-white p-4">
                  <h2 className="font-semibold">{name}</h2>
                  <p className="mt-1 text-xs text-[#6d7a72]">{agents.find((item) => item.businessName === name)?.payout.detail}</p>
                  {recovery.map((item) => (
                    <p key={item.id} className="mt-3 bg-[#f8ece6] px-3 py-2 text-sm text-[#8a3d24]">Open recovery {inr(item.amount)} · {item.reason}</p>
                  ))}
                  <div className="mt-3 grid gap-2">
                    {agentLines.map((line) => (
                      <label key={line.id} className="flex items-start gap-3 border border-[#eeeae2] p-3 text-sm">
                        <input type="checkbox" checked={selected.includes(line.id)} onChange={() => toggle(line.id)} className="mt-1" />
                        <span>
                          <span className="font-medium">{line.childId}</span>
                          <span className="mt-1 block text-xs text-[#6d7a72]">Hold until {formatDate(line.holdUntil)} · net {inr(line.net)} · commission {inr(line.commission)}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
          <form className="h-fit border border-[#e4e2d9] bg-white p-4" onSubmit={(event) => { event.preventDefault(); settle(); }}>
            <h2 className="font-display text-2xl">Record payout</h2>
            <p className="mt-2 text-xs leading-5 text-[#6d7a72]">Amount due after open recovery: {inr(due)}. Pay outside the platform, then log the transfer.</p>
            <div className="mt-3 grid gap-3">
              <label className="text-xs font-semibold">Date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
              <label className="text-xs font-semibold">Amount<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
              <label className="text-xs font-semibold">Mode
                <select value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value })} className={`${inputClass} mt-1.5`}>
                  {["NEFT", "IMPS", "RTGS", "UPI"].map((mode) => <option key={mode}>{mode}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold">UTR or UPI reference<input value={form.utr} onChange={(event) => setForm({ ...form, utr: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
              <label className="text-xs font-semibold">Note<input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
            </div>
            <button type="submit" className={`${btnPrimary} mt-4 w-full`}>Mark settled</button>
          </form>
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto border border-[#e4e2d9] bg-white">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-[#eeeae2] text-xs uppercase tracking-wide text-[#6d7a72]">
              <tr>
                <th className="px-3 py-3 font-semibold">Line</th>
                <th className="px-3 py-3 font-semibold">Agent</th>
                <th className="px-3 py-3 font-semibold">Hold until</th>
                <th className="px-3 py-3 font-semibold">Net</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((line) => (
                <tr key={line.id} className="border-b border-[#eeeae2]">
                  <td className="px-3 py-3">{line.childId}</td>
                  <td className="px-3 py-3">{line.agent}</td>
                  <td className="px-3 py-3">{formatDate(line.holdUntil)}</td>
                  <td className="px-3 py-3">{inr(line.net)}</td>
                  <td className="px-3 py-3"><StatusBadge status={line.status} /></td>
                  <td className="px-3 py-3">{line.utr ?? line.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-8 border border-[#e4e2d9] bg-white p-4">
        <h2 className="font-display text-2xl">Razorpay settlement note</h2>
        <p className="mt-2 text-sm text-[#58655d]">Record when Razorpay credited the owner’s bank. This does not settle an agent.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <select value={settlement.orderId} onChange={(event) => setSettlement({ ...settlement, orderId: event.target.value })} className={inputClass}>
            {parents.map((order) => <option key={order.id}>{order.id}</option>)}
          </select>
          <input type="date" value={settlement.date} onChange={(event) => setSettlement({ ...settlement, date: event.target.value })} className={inputClass} />
          <input placeholder="Reference" value={settlement.reference} onChange={(event) => setSettlement({ ...settlement, reference: event.target.value })} className={inputClass} />
          <button type="button" className={btnPrimary} onClick={noteSettlement}>Save note</button>
        </div>
        <ul className="mt-3 text-xs text-[#6d7a72]">
          {parents.filter((order) => order.razorpaySettlement).map((order) => (
            <li key={order.id}>{order.id}: {order.razorpaySettlement?.date} · {order.razorpaySettlement?.reference}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
