"use client";

import { useState, type FormEvent } from "react";
import { btnGold, inputClass } from "@/components/ui/fields";
import { categories } from "@/data/catalog";
import { openApplicationEmails } from "@/data/records";

const states = [
  "Andhra Pradesh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const empty = {
  businessName: "",
  contact: "",
  mobile: "",
  email: "",
  city: "",
  state: "Kerala",
  categories: [] as string[],
  description: "",
  gstin: "",
  confirmed: false,
};

export default function ApplyView() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  function toggleCategory(category: string) {
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.businessName || !form.contact || !form.mobile || !form.email || !form.city || !form.description) {
      setError("Fill in the business, contact, mobile, email, city, and catalog description.");
      return;
    }
    if (form.categories.length === 0) {
      setError("Choose at least one intended category.");
      return;
    }
    if (!form.confirmed) {
      setError("Confirm that the information is accurate.");
      return;
    }
    if (openApplicationEmails.includes(form.email.trim().toLowerCase())) {
      setError("This email already has an open application. Wait for a decision, or use the request already on file.");
      return;
    }
    setError("");
    setReference(`APP-${Math.floor(2000 + Math.random() * 7000)}`);
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#1d5c42]">SUBMITTED</p>
        <h1 className="mt-3 font-display text-5xl">Application {reference}</h1>
        <p className="mt-4 text-sm leading-7 text-[#40564e]">
          Status is Submitted. This does not create a dashboard login. If the owner accepts the file, a one-time setup link is emailed. The link expires in 72 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-[#a36545]">SELL WITH THE HOUSE</p>
      <h1 className="mt-3 font-display text-5xl">Apply as Agent</h1>
      <p className="mt-4 text-sm leading-7 text-[#40564e]">
        Tell us about the business. The owner can accept, ask for more information, or reject the file. Product submission stays locked until payout details and vendor terms are saved.
      </p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        <label className="text-xs font-semibold">Business name<input required value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Contact person<input required value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Mobile<input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
          <label className="text-xs font-semibold">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">City<input required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
          <label className="text-xs font-semibold">State
            <select value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} className={`${inputClass} mt-1.5`}>
              {states.map((state) => <option key={state}>{state}</option>)}
            </select>
          </label>
        </div>
        <fieldset>
          <legend className="text-xs font-semibold">Intended categories</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((category) => {
              const on = form.categories.includes(category);
              return (
                <button key={category} type="button" onClick={() => toggleCategory(category)} className={`min-h-9 px-3 text-xs font-semibold ${on ? "bg-[#173c37] text-[#fbfaf6]" : "border border-[#d5d3c8]"}`} aria-pressed={on}>
                  {category}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="text-xs font-semibold">Catalog description
          <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${inputClass} mt-1.5 min-h-28 py-2`} />
        </label>
        <label className="text-xs font-semibold">GSTIN, if you have one
          <input value={form.gstin} onChange={(event) => setForm({ ...form, gstin: event.target.value })} className={`${inputClass} mt-1.5`} placeholder="Optional" />
        </label>
        <label className="flex items-start gap-3 text-sm leading-6">
          <input type="checkbox" checked={form.confirmed} onChange={(event) => setForm({ ...form, confirmed: event.target.checked })} className="mt-1" />
          I confirm this information is accurate.
        </label>
        {error ? <p className="text-sm text-[#8a3d24]" role="alert">{error}</p> : null}
        <button type="submit" className={btnGold}>Submit application</button>
      </form>
    </div>
  );
}
