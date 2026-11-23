"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { btnGhost, btnPrimary, inputClass } from "@/components/ui/fields";
import { categories, products } from "@/data/catalog";
import { managedProducts as seed } from "@/data/records";
import { formatDateTime, inr } from "@/lib/format";
import type { ManagedProduct, Review } from "@/types/store";

type ReviewRow = Review & { product: string };

const reviewSeed: ReviewRow[] = products.flatMap((product) =>
  product.reviews.map((review) => ({ ...review, product: product.name })),
);

export default function ProductsConsole() {
  const [items, setItems] = useState<ManagedProduct[]>(seed);
  const [reviews, setReviews] = useState(reviewSeed);
  const [tab, setTab] = useState<"Platform" | "Agent queue" | "Reviews">("Agent queue");
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({ name: "", price: "", stock: "", category: "Home & Living", brand: "ShoppingPlace", description: "" });

  const queue = items.filter((item) => item.owner === "agent" && (item.status === "Pending approval" || item.status === "Revision pending"));
  const platform = items.filter((item) => item.owner === "platform");

  function decide(id: string, approve: boolean) {
    if (!approve && !reason.trim()) {
      setNotice("Rejection needs a reason.");
      return;
    }
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (approve && item.revision) {
          return { ...item, name: item.revision.name, price: item.revision.price, status: "Live", revision: undefined, reason: undefined };
        }
        if (approve) return { ...item, status: "Live", reason: undefined };
        if (item.revision) return { ...item, status: "Live", revision: undefined, reason: reason.trim() };
        return { ...item, status: "Rejected", reason: reason.trim() };
      }),
    );
    setReason("");
    setNotice(approve ? "Approved. The listing shoppers see is the approved version." : "Rejected. The agent can edit and submit again. The reason is kept.");
  }

  function unpublish(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: "Unpublished" } : item)));
    setNotice("Unpublished. It leaves the website and cannot be added to a cart. Past orders stay.");
  }

  function create(publish: boolean) {
    if (!draft.name || !draft.price || !draft.stock) {
      setNotice("Name, price, and stock are required.");
      return;
    }
    const product: ManagedProduct = {
      id: `PRD-${Math.floor(400 + Math.random() * 500)}`,
      owner: "platform",
      name: draft.name,
      price: Number(draft.price),
      stock: Number(draft.stock),
      category: draft.category,
      brand: draft.brand,
      status: publish ? "Live" : "Draft",
    };
    setItems((current) => [product, ...current]);
    setDraft({ name: "", price: "", stock: "", category: "Home & Living", brand: "ShoppingPlace", description: "" });
    setNotice(publish ? "Published to the website. Platform products do not enter the agent queue." : "Saved as a draft. Hidden from the website.");
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Products</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {(["Platform", "Agent queue", "Reviews"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`min-h-9 px-3 text-xs font-semibold ${tab === item ? "bg-[#173c37] text-[#fbfaf6]" : "border border-[#d5d3c8] bg-white"}`}>{item}</button>
        ))}
      </div>
      {notice ? <p className="mt-4 border border-[#d7e4dc] bg-[#eef6f1] px-4 py-3 text-sm">{notice}</p> : null}

      {tab === "Platform" ? (
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ProductTable items={platform} onUnpublish={unpublish} />
          <form className="h-fit border border-[#e4e2d9] bg-white p-4" onSubmit={(event) => event.preventDefault()}>
            <h2 className="font-display text-2xl">New platform product</h2>
            <div className="mt-3 grid gap-3">
              <input placeholder="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} />
              <input placeholder="Price" inputMode="numeric" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} className={inputClass} />
              <input placeholder="Stock" inputMode="numeric" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} className={inputClass} />
              <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={inputClass}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <input placeholder="Brand" value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} className={inputClass} />
              <textarea placeholder="Description" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className={`${inputClass} min-h-20 py-2`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={btnGhost} onClick={() => create(false)}>Save draft</button>
              <button type="button" className={btnPrimary} onClick={() => create(true)}>Publish</button>
            </div>
          </form>
        </div>
      ) : null}

      {tab === "Agent queue" ? (
        <div className="mt-5 grid gap-4">
          {queue.length === 0 ? <p className="text-sm text-[#58655d]">No agent submissions are waiting.</p> : null}
          {queue.map((item) => (
            <article key={item.id} className="border border-[#e4e2d9] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#6d7a72]">{item.agent} · {item.id}</p>
                  <h2 className="mt-1 text-lg font-semibold">{item.name}</h2>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-sm">{inr(item.price)} · stock {item.stock} · {item.category}</p>
              {item.submittedAt ? <p className="mt-1 text-xs text-[#6d7a72]">Submitted {formatDateTime(item.submittedAt)}</p> : null}
              {item.revision ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="bg-[#f3f1e9] p-3 text-sm">
                    <p className="text-xs font-semibold tracking-wide text-[#6d7a72]">LIVE VERSION</p>
                    <p className="mt-2 font-medium">{item.name}</p>
                    <p>{inr(item.price)}</p>
                    <p className="mt-2 text-xs">Shoppers still see this until you approve the revision.</p>
                  </div>
                  <div className="border border-[#d5d3c8] p-3 text-sm">
                    <p className="text-xs font-semibold tracking-wide text-[#a36545]">REVISION</p>
                    <p className="mt-2 font-medium">{item.revision.name}</p>
                    <p>{inr(item.revision.price)}</p>
                    <p className="mt-2">{item.revision.summary}</p>
                  </div>
                </div>
              ) : null}
              <label className="mt-4 block text-xs font-semibold">
                Reason if rejecting
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} className={`${inputClass} mt-1.5 min-h-20 py-2`} />
              </label>
              <div className="mt-3 flex gap-2">
                <button type="button" className={btnPrimary} onClick={() => decide(item.id, true)}>Approve</button>
                <button type="button" className={btnGhost} onClick={() => decide(item.id, false)}>Reject</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "Reviews" ? (
        <div className="mt-5 grid gap-3">
          {reviews.map((review) => (
            <article key={review.id} className={`border border-[#e4e2d9] bg-white p-4 ${review.hidden ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold">{review.product} · {review.title}</p>
                <button type="button" className="text-xs font-semibold text-[#a36545]" onClick={() => setReviews((current) => current.map((item) => item.id === review.id ? { ...item, hidden: !item.hidden } : item))}>
                  {review.hidden ? "Show review" : "Hide review"}
                </button>
              </div>
              <p className="mt-2 text-sm">{review.text}</p>
              <p className="mt-1 text-xs text-[#6d7a72]">{review.author} · {"★".repeat(review.rating)}{review.hidden ? " · hidden from the product page" : ""}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductTable({ items, onUnpublish }: { items: ManagedProduct[]; onUnpublish: (id: string) => void }) {
  return (
    <div className="overflow-x-auto border border-[#e4e2d9] bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-[#eeeae2] text-xs uppercase tracking-wide text-[#6d7a72]">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Stock</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[#eeeae2]">
              <td className="px-4 py-3"><p className="font-medium">{item.name}</p><p className="text-xs text-[#6d7a72]">{item.brand} · {item.category}</p></td>
              <td className="px-4 py-3">{inr(item.price)}</td>
              <td className="px-4 py-3">{item.stock}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3">{item.status === "Live" ? <button type="button" className="text-xs font-semibold text-[#a36545]" onClick={() => onUnpublish(item.id)}>Unpublish</button> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
