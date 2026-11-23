"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { btnGhost, btnPrimary, inputClass } from "@/components/ui/fields";
import { agents as seedAgents, applications as seedApplications } from "@/data/records";
import { formatDateTime } from "@/lib/format";
import type { AccountStatus, AgentAccount, AgentApplication, ApplicationStatus } from "@/types/store";

export default function AgentsConsole() {
  const [applications, setApplications] = useState(seedApplications);
  const [directory, setDirectory] = useState(seedAgents);
  const [tab, setTab] = useState<"Submitted" | "Information requested" | "Directory">("Submitted");
  const [selected, setSelected] = useState(seedApplications[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const application = applications.find((item) => item.id === selected);

  function updateApplication(id: string, status: ApplicationStatus, note?: string) {
    if ((status === "Rejected" || status === "Information requested") && !note?.trim()) {
      setNotice("A reason is required to reject or request information.");
      return;
    }
    setApplications((current) =>
      current.map((item) => (item.id === id ? { ...item, status, reason: note?.trim() || item.reason } : item)),
    );
    if (status === "Accepted — pending activation") {
      const source = applications.find((item) => item.id === id);
      if (source && !directory.some((agent) => agent.email === source.email)) {
        const account: AgentAccount = {
          id: `AGT-${Math.floor(100 + Math.random() * 900)}`,
          businessName: source.businessName,
          contact: source.contact,
          mobile: source.mobile,
          email: source.email,
          city: source.city,
          state: source.state,
          status: "Pending activation",
          gstin: source.gstin,
          categories: source.categories,
          payout: { mode: "Bank", detail: "Not on file yet" },
        };
        setDirectory((current) => [account, ...current]);
      }
      setNotice("Accepted. A one-time setup link is ready to email. It expires in 72 hours. No password was sent.");
    } else {
      setNotice(status === "Rejected" ? "Rejected. The reason is stored with the application." : "Information requested. The applicant can update the same file.");
    }
    setReason("");
  }

  function setAccountStatus(id: string, status: AccountStatus) {
    setDirectory((current) => current.map((agent) => (agent.id === id ? { ...agent, status } : agent)));
    setNotice(
      status === "Suspended"
        ? "Suspended. Live products leave the website and new submissions are blocked. Open orders and earned payout lines stay."
        : "Restored to Active.",
    );
  }

  const queue = applications.filter((item) => item.status === tab);

  return (
    <div>
      <h1 className="font-display text-4xl">Agents</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#58655d]">Review the newest files first. Acceptance creates an account and a setup link. It does not open the catalog.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {(["Submitted", "Information requested", "Directory"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`min-h-9 px-3 text-xs font-semibold ${tab === item ? "bg-[#173c37] text-[#fbfaf6]" : "border border-[#d5d3c8] bg-white"}`}>
            {item}
          </button>
        ))}
      </div>
      {notice ? <p className="mt-4 border border-[#d7e4dc] bg-[#eef6f1] px-4 py-3 text-sm text-[#1d5c42]">{notice}</p> : null}

      {tab === "Directory" ? (
        <div className="mt-5 overflow-x-auto border border-[#e4e2d9] bg-white">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-[#eeeae2] text-xs uppercase tracking-wide text-[#6d7a72]">
              <tr>
                <th className="px-4 py-3 font-semibold">Business</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">Payout details</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {directory.map((agent) => (
                <tr key={agent.id} className="border-b border-[#eeeae2] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{agent.businessName}</p>
                    <p className="text-xs text-[#6d7a72]">{agent.contact} · {agent.city}</p>
                    <p className="text-xs text-[#6d7a72]">{agent.gstin ?? "No GSTIN"}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={agent.status} /></td>
                  <td className="px-4 py-3">
                    <label className="text-xs text-[#6d7a72]">
                      Override %
                      <input
                        defaultValue={agent.rateOverride ?? ""}
                        placeholder="Default"
                        onBlur={(event) => {
                          const value = event.target.value.trim();
                          setDirectory((current) =>
                            current.map((item) =>
                              item.id === agent.id ? { ...item, rateOverride: value ? Number(value) : undefined } : item,
                            ),
                          );
                        }}
                        className={`${inputClass} mt-1 w-24`}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-xs leading-5">
                    {agent.payout.mode}: {agent.payout.detail}
                    {agent.payout.ifsc ? <span className="block">{agent.payout.bankName} · {agent.payout.ifsc}</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-2">
                      {agent.status === "Active" ? (
                        <button type="button" className="text-xs font-semibold text-[#a36545]" onClick={() => setAccountStatus(agent.id, "Suspended")}>Suspend</button>
                      ) : null}
                      {agent.status === "Suspended" ? (
                        <button type="button" className="text-xs font-semibold text-[#1d5c42]" onClick={() => setAccountStatus(agent.id, "Active")}>Restore</button>
                      ) : null}
                      {agent.status === "Pending activation" ? (
                        <button type="button" className="text-xs font-semibold text-[#234866]" onClick={() => setNotice(`Setup link resent to ${agent.email}. It expires in 72 hours.`)}>Resend setup link</button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="border border-[#e4e2d9] bg-white">
            {queue.length === 0 ? <p className="p-4 text-sm text-[#58655d]">Nothing in this queue.</p> : null}
            {queue.map((item) => (
              <button key={item.id} type="button" onClick={() => { setSelected(item.id); setNotice(""); }} className={`block w-full border-b border-[#eeeae2] px-4 py-3 text-left ${selected === item.id ? "bg-[#f3f1e9]" : ""}`}>
                <span className="block text-sm font-semibold">{item.businessName}</span>
                <span className="mt-1 block text-xs text-[#6d7a72]">{item.id} · {formatDateTime(item.submittedAt)}</span>
              </button>
            ))}
          </div>
          {application && application.status === tab ? <ApplicationDetail item={application} reason={reason} setReason={setReason} onDecide={updateApplication} /> : <p className="text-sm text-[#58655d]">Select an application.</p>}
        </div>
      )}
    </div>
  );
}

function ApplicationDetail({
  item,
  reason,
  setReason,
  onDecide,
}: {
  item: AgentApplication;
  reason: string;
  setReason: (value: string) => void;
  onDecide: (id: string, status: ApplicationStatus, note?: string) => void;
}) {
  return (
    <article className="border border-[#e4e2d9] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl">{item.businessName}</h2>
        <StatusBadge status={item.status} />
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="text-xs text-[#6d7a72]">Reference</dt><dd>{item.id}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">Submitted</dt><dd>{formatDateTime(item.submittedAt)}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">Contact</dt><dd>{item.contact}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">Mobile</dt><dd>{item.mobile}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">Email</dt><dd>{item.email}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">Place</dt><dd>{item.city}, {item.state}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">GSTIN</dt><dd>{item.gstin ?? "Not provided"}</dd></div>
        <div><dt className="text-xs text-[#6d7a72]">Categories</dt><dd>{item.categories.join(", ")}</dd></div>
      </dl>
      <p className="mt-4 text-sm leading-6">{item.description}</p>
      {item.reason ? <p className="mt-4 bg-[#f8efd8] px-3 py-2 text-sm">Earlier note: {item.reason}</p> : null}
      <label className="mt-4 block text-xs font-semibold">
        Reason
        <textarea value={reason} onChange={(event) => setReason(event.target.value)} className={`${inputClass} mt-1.5 min-h-24 py-2`} placeholder="Required to reject or request information" />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} onClick={() => onDecide(item.id, "Accepted — pending activation")}>Accept</button>
        <button type="button" className={btnGhost} onClick={() => onDecide(item.id, "Information requested", reason)}>Request information</button>
        <button type="button" className={btnGhost} onClick={() => onDecide(item.id, "Rejected", reason)}>Reject</button>
      </div>
    </article>
  );
}
