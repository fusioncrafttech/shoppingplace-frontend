"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { btnGold, inputClass } from "@/components/ui/fields";

export default function ActivateView() {
  const [mode, setMode] = useState<"bank" | "upi">("bank");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const terms = data.get("terms");
    if (password.length < 8 || password !== confirm) {
      setError("Use a password of at least 8 characters and repeat it.");
      return;
    }
    if (mode === "bank" && (!data.get("accountName") || !data.get("accountNumber") || !data.get("ifsc") || !data.get("bankName"))) {
      setError("Account name, number, IFSC, and bank name are required.");
      return;
    }
    if (mode === "upi" && !String(data.get("upi") ?? "").includes("@")) {
      setError("Enter a UPI ID.");
      return;
    }
    if (!terms) {
      setError("Accept the vendor terms to activate the account.");
      return;
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#1d5c42]">ACTIVE</p>
        <h1 className="mt-3 font-display text-5xl">Loom & Co can sell.</h1>
        <p className="mt-4 text-sm leading-6 text-[#40564e]">
          The account status is Active. Product submission is now available. The setup link cannot be used again.
        </p>
        <Link href="/agent" className={`${btnGold} mt-6`}>Open the agent dashboard</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link href="/" className="font-display text-2xl text-[#173c37]">ShoppingPlace.</Link>
      <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-[#a36545]">SETUP LINK · EXPIRES IN 72 HOURS</p>
      <h1 className="mt-3 font-display text-5xl">Activate Loom & Co</h1>
      <p className="mt-4 text-sm leading-7 text-[#40564e]">
        Acceptance did not open the catalog. Set a password, confirm the business contacts, add a bank account or UPI ID, and accept the vendor terms. No shared password was emailed.
      </p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        <label className="text-xs font-semibold">Password<input name="password" type="password" required className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Confirm password<input name="confirm" type="password" required className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Contact person<input name="contact" defaultValue="Rhea Mathew" required className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Mobile<input name="mobile" defaultValue="98950 66102" required className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Email<input name="email" type="email" defaultValue="rhea@loomco.example" required className={`${inputClass} mt-1.5`} /></label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode("bank")} className={`min-h-9 px-3 text-xs font-semibold ${mode === "bank" ? "bg-[#173c37] text-white" : "border border-[#d5d3c8]"}`}>Bank account</button>
          <button type="button" onClick={() => setMode("upi")} className={`min-h-9 px-3 text-xs font-semibold ${mode === "upi" ? "bg-[#173c37] text-white" : "border border-[#d5d3c8]"}`}>UPI</button>
        </div>
        {mode === "bank" ? (
          <>
            <label className="text-xs font-semibold">Account name<input name="accountName" className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">Account number<input name="accountNumber" className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">IFSC<input name="ifsc" className={`${inputClass} mt-1.5`} /></label>
            <label className="text-xs font-semibold">Bank name<input name="bankName" className={`${inputClass} mt-1.5`} /></label>
          </>
        ) : (
          <label className="text-xs font-semibold">UPI ID<input name="upi" className={`${inputClass} mt-1.5`} placeholder="name@bank" /></label>
        )}
        <div className="max-h-28 overflow-y-auto border border-[#e4e2d9] bg-[#f7f6f1] p-3 text-xs leading-5 text-[#40564e]">
          Vendor terms, version 1.0. Counsel supplies the legal wording. This screen records that the agent accepted the current version. Customer funds are collected by the platform. The agent is paid later by a manual transfer after the hold.
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="terms" className="mt-1" />
          I accept the vendor terms.
        </label>
        {error ? <p className="text-sm text-[#8a3d24]">{error}</p> : null}
        <button type="submit" className={btnGold}>Activate account</button>
      </form>
    </div>
  );
}
