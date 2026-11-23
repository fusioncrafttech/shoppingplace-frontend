"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/components/settings/SettingsProvider";
import { btnPrimary, inputClass } from "@/components/ui/fields";
import { products } from "@/data/catalog";
import type { StoreSettings } from "@/types/store";

export default function SettingsConsole() {
  const { settings, save } = useSettings();
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  function patch(partial: Partial<StoreSettings>) {
    setDraft((current) => ({ ...current, ...partial }));
    setSaved(false);
  }

  return (
    <form
      className="max-w-3xl"
      onSubmit={(event) => {
        event.preventDefault();
        save(draft);
        setSaved(true);
      }}
    >
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mt-2 text-sm text-[#58655d]">These values are the ones the storefront and the ledger rules use in this preview.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold">Store brand<input value={draft.brandName} onChange={(event) => patch({ brandName: event.target.value })} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Default commission %<input type="number" min={0} max={100} value={draft.commissionPercent} onChange={(event) => patch({ commissionPercent: Number(event.target.value) })} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Hold length
          <select value={draft.holdDays} onChange={(event) => patch({ holdDays: Number(event.target.value) as 5 | 6 | 7 })} className={`${inputClass} mt-1.5`}>
            <option value={5}>5 days</option>
            <option value={6}>6 days</option>
            <option value={7}>7 days</option>
          </select>
        </label>
        <label className="text-xs font-semibold">Material price threshold %<input type="number" value={draft.priceThresholdPercent} onChange={(event) => patch({ priceThresholdPercent: Number(event.target.value) })} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold">Cooling period, days<input type="number" value={draft.coolingPeriodDays} onChange={(event) => patch({ coolingPeriodDays: Number(event.target.value) })} className={`${inputClass} mt-1.5`} /></label>
        <label className="flex items-center gap-3 text-sm sm:mt-6">
          <input type="checkbox" checked={draft.showOutOfStock} onChange={(event) => patch({ showOutOfStock: event.target.checked })} />
          Keep out-of-stock products visible
        </label>
      </div>

      <h2 className="mt-10 font-display text-3xl">Homepage banners</h2>
      <div className="mt-4 grid gap-4">
        {draft.banners.map((banner, index) => (
          <div key={banner.id} className="grid gap-3 border border-[#e4e2d9] bg-white p-4">
            <input value={banner.eyebrow} onChange={(event) => {
              const banners = draft.banners.map((item, itemIndex) => itemIndex === index ? { ...item, eyebrow: event.target.value } : item);
              patch({ banners });
            }} className={inputClass} />
            <input value={banner.title} onChange={(event) => {
              const banners = draft.banners.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item);
              patch({ banners });
            }} className={inputClass} />
            <textarea value={banner.text} onChange={(event) => {
              const banners = draft.banners.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item);
              patch({ banners });
            }} className={`${inputClass} min-h-20 py-2`} />
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-3xl">Featured products</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {products.map((product) => {
          const on = draft.featuredSlugs.includes(product.slug);
          return (
            <label key={product.slug} className="flex items-center gap-3 bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={on}
                onChange={() => {
                  const featuredSlugs = on ? draft.featuredSlugs.filter((slug) => slug !== product.slug) : [...draft.featuredSlugs, product.slug];
                  patch({ featuredSlugs });
                }}
              />
              {product.name}
            </label>
          );
        })}
      </div>
      <button type="submit" className={`${btnPrimary} mt-6`}>Save settings</button>
      {saved ? <p className="mt-3 text-sm text-[#1d5c42]">Saved. The storefront banner, brand, featured row, and out-of-stock rule use these values.</p> : null}
    </form>
  );
}
