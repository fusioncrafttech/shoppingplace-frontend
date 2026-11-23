"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { btnGhost, btnPrimary, inputClass } from "@/components/ui/fields";
import { categories } from "@/data/catalog";
import { managedProducts } from "@/data/records";
import { useSettings } from "@/components/settings/SettingsProvider";
import { inr } from "@/lib/format";
import type { ManagedProduct } from "@/types/store";

const empty = { name: "", price: "", stock: "", category: "Home & Living", brand: "Atelier", description: "" };

export default function AgentProducts() {
  const { settings } = useSettings();
  const [items, setItems] = useState<ManagedProduct[]>(managedProducts.filter((item) => item.agent === "Atelier North"));
  const [form, setForm] = useState(empty);
  const [notice, setNotice] = useState("");
  const [edits, setEdits] = useState<Record<string, { stock: string; price: string; name: string }>>({});

  function values(item: ManagedProduct) {
    return edits[item.id] ?? { stock: String(item.stock), price: String(item.price), name: item.name };
  }

  function saveOperational(item: ManagedProduct) {
    const next = values(item);
    const price = Number(next.price);
    const stock = Number(next.stock);
    if (!stock && stock !== 0) return;
    const change = item.price === 0 ? 100 : (Math.abs(price - item.price) / item.price) * 100;
    if (change > settings.priceThresholdPercent) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                stock,
                status: "Revision pending",
                revision: {
                  name: entry.name,
                  price,
                  summary: `Price move from ${inr(entry.price)} to ${inr(price)} is above the ${settings.priceThresholdPercent}% threshold.`,
                },
              }
            : entry,
        ),
      );
      setNotice("That price change waits as a revision. Shoppers still see the approved price.");
      return;
    }
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, stock, price } : entry)));
    setNotice("Stock and price updated on the live listing.");
  }

  function saveMaterial(item: ManagedProduct) {
    const next = values(item);
    if (next.name.trim() === item.name) {
      setNotice("Change the title to send a material revision.");
      return;
    }
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: "Revision pending",
              revision: { name: next.name.trim(), price: entry.price, summary: "Title change. Shoppers still see the approved title." },
            }
          : entry,
      ),
    );
    setNotice("Revision submitted. Shoppers still see the approved version.");
  }

  function create(submit: boolean) {
    if (!form.name || !form.price || !form.stock) {
      setNotice("Name, price, and stock are required.");
      return;
    }
    const product: ManagedProduct = {
      id: `PRD-${Math.floor(500 + Math.random() * 400)}`,
      owner: "agent",
      agent: "Atelier North",
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      brand: form.brand,
      status: submit ? "Pending approval" : "Draft",
      submittedAt: submit ? new Date().toISOString() : undefined,
    };
    setItems((current) => [product, ...current]);
    setForm(empty);
    setNotice(submit ? "Submitted for review. It cannot be purchased until the owner approves it." : "Draft saved. Only you can see it.");
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Products</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#58655d]">
        Stock and a price change at or below {settings.priceThresholdPercent}% go live at once. Title, images, category, and larger price moves wait as a revision.
      </p>
      {items.length === 0 ? (
        <p className="mt-6 border border-dashed border-[#d5d3c8] bg-white px-4 py-8 text-sm leading-6">
          You have no products yet. Save a draft, then submit it. The owner approves it before it appears on the website.
        </p>
      ) : null}
      {notice ? <p className="mt-4 border border-[#d7e4dc] bg-[#eef6f1] px-4 py-3 text-sm">{notice}</p> : null}
      <div className="mt-5 grid gap-4">
        {items.map((item) => {
          const edit = values(item);
          return (
            <article key={item.id} className="border border-[#e4e2d9] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{item.name}</h2>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-xs text-[#6d7a72]">{item.category} · {item.brand}</p>
              {item.reason ? <p className="mt-3 bg-[#f8ece6] px-3 py-2 text-sm text-[#8a3d24]">Rejected: {item.reason}</p> : null}
              {item.revision ? (
                <p className="mt-3 bg-[#e7eef6] px-3 py-2 text-sm text-[#234866]">
                  Revision waiting: {item.revision.summary} Shoppers still see {item.name} at {inr(item.price)}.
                </p>
              ) : null}
              {item.status === "Live" || item.status === "Revision pending" ? (
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="text-xs font-semibold">Stock<input value={edit.stock} onChange={(event) => setEdits({ ...edits, [item.id]: { ...edit, stock: event.target.value } })} className={`${inputClass} mt-1.5 w-24`} /></label>
                  <label className="text-xs font-semibold">Price<input value={edit.price} onChange={(event) => setEdits({ ...edits, [item.id]: { ...edit, price: event.target.value } })} className={`${inputClass} mt-1.5 w-28`} /></label>
                  <button type="button" className={btnGhost} onClick={() => saveOperational(item)}>Update stock or price</button>
                  <label className="text-xs font-semibold">Title<input value={edit.name} onChange={(event) => setEdits({ ...edits, [item.id]: { ...edit, name: event.target.value } })} className={`${inputClass} mt-1.5 w-56`} /></label>
                  <button type="button" className={btnGhost} onClick={() => saveMaterial(item)}>Submit title revision</button>
                </div>
              ) : null}
              {item.status === "Draft" || item.status === "Rejected" ? (
                <button
                  type="button"
                  className={`${btnPrimary} mt-4`}
                  onClick={() => {
                    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "Pending approval", reason: undefined, submittedAt: new Date().toISOString() } : entry));
                    setNotice("Submitted for review.");
                  }}
                >
                  Submit for review
                </button>
              ) : null}
            </article>
          );
        })}
      </div>

      <form className="mt-8 max-w-xl border border-[#e4e2d9] bg-white p-4" onSubmit={(event) => event.preventDefault()}>
        <h2 className="font-display text-2xl">New product</h2>
        <div className="mt-3 grid gap-3">
          <input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className={inputClass} />
            <input placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className={inputClass} />
          </div>
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input placeholder="Brand" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} className={inputClass} />
          <textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className={`${inputClass} min-h-20 py-2`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className={btnGhost} onClick={() => create(false)}>Save draft</button>
          <button type="button" className={btnPrimary} onClick={() => create(true)}>Submit for review</button>
        </div>
      </form>
    </div>
  );
}
