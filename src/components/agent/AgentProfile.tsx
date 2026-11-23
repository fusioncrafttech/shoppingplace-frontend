"use client";

import { useState } from "react";
import { btnPrimary, inputClass } from "@/components/ui/fields";
import { agents } from "@/data/records";

const seed = agents.find((agent) => agent.businessName === "Atelier North");

export default function AgentProfile() {
  const [contact, setContact] = useState(seed?.contact ?? "");
  const [mobile, setMobile] = useState(seed?.mobile ?? "");
  const [email, setEmail] = useState(seed?.email ?? "");
  const [gstin, setGstin] = useState(seed?.gstin ?? "");
  const [mode, setMode] = useState<"Bank" | "UPI">(seed?.payout.mode ?? "Bank");
  const [accountName, setAccountName] = useState("Atelier North");
  const [accountNumber, setAccountNumber] = useState("501002344412");
  const [ifsc, setIfsc] = useState(seed?.payout.ifsc ?? "");
  const [bankName, setBankName] = useState(seed?.payout.bankName ?? "");
  const [upi, setUpi] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <h1 className="font-display text-4xl">Profile</h1>
      <p className="mt-2 text-sm leading-6 text-[#58655d]">
        Update the contacts and the bank or UPI details used for the next payout. Settled payouts keep the details that were on file at the time.
      </p>
      <p className="mt-3 text-sm">Your commission rate is 12%. An override, if the owner sets one, replaces it on future orders only.</p>
      <div className="mt-6 grid gap-3">
        <label className="text-xs font-semibold">Contact person<input value={contact} onChange={(event) => setContact(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Mobile<input value={mobile} onChange={(event) => setMobile(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">GSTIN<input value={gstin} onChange={(event) => setGstin(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Payout method
          <select value={mode} onChange={(event) => setMode(event.target.value as "Bank" | "UPI")} className={`${inputClass} mt-1.5`}>
            <option value="Bank">Bank account</option>
            <option value="UPI">UPI</option>
          </select>
        </label>
        {mode === "Bank" ? (
          <>
            <label className="text-xs font-semibold">Account name<input value={accountName} onChange={(event) => setAccountName(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">Account number<input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">IFSC<input value={ifsc} onChange={(event) => setIfsc(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">Bank name<input value={bankName} onChange={(event) => setBankName(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
          </>
        ) : (
          <label className="text-xs font-semibold">UPI ID<input value={upi} onChange={(event) => setUpi(event.target.value)} className={`${inputClass} mt-1.5`} /></label>
        )}
      </div>
      <button type="submit" className={`${btnPrimary} mt-5`}>Save profile</button>
      {saved ? <p className="mt-3 text-sm text-[#1d5c42]">Saved for the next payout. Earlier settled lines are unchanged.</p> : null}
    </form>
  );
}
