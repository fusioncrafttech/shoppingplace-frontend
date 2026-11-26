"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { inputClass } from "@/components/ui/fields";
import { useSettings } from "@/components/settings/SettingsProvider";
import { categories, products } from "@/data/catalog";

const sorts = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Rating" },
];

export default function CatalogView() {
  const params = useSearchParams();
  const { settings } = useSettings();
  const initialQuery = params.get("q") ?? "";
  const initialCategory = params.get("category") ?? "All";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "All");
  const [brand, setBrand] = useState("All");
  const [seller, setSeller] = useState("All");
  const [minRating, setMinRating] = useState("0");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setQuery(params.get("q") ?? "");
    const nextCategory = params.get("category") ?? "All";
    setCategory(categories.includes(nextCategory) ? nextCategory : "All");
  }, [params]);

  const brands = [...new Set(products.map((product) => product.brand))];
  const sellers = ["Platform", ...new Set(products.filter((product) => product.seller.type === "agent").map((product) => product.seller.name))];

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    const filtered = products.filter((product) => {
      if (!settings.showOutOfStock && product.stock < 1) return false;
      if (category !== "All" && product.category !== category) return false;
      if (brand !== "All" && product.brand !== brand) return false;
      if (seller === "Platform" && product.seller.type !== "platform") return false;
      if (seller !== "All" && seller !== "Platform" && product.seller.name !== seller) return false;
      if (product.rating < Number(minRating)) return false;
      if (min !== null && !Number.isNaN(min) && product.price < min) return false;
      if (max !== null && !Number.isNaN(max) && product.price > max) return false;
      if (!needle) return true;
      return [product.name, product.brand, product.category].some((value) => value.toLowerCase().includes(needle));
    });

    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "relevance" && needle) {
      sorted.sort((a, b) => Number(b.name.toLowerCase().startsWith(needle)) - Number(a.name.toLowerCase().startsWith(needle)));
    }
    return sorted;
  }, [brand, category, maxPrice, minPrice, minRating, query, seller, settings.showOutOfStock, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setBrand("All");
    setSeller("All");
    setMinRating("0");
    setMinPrice("");
    setMaxPrice("");
    setSort("relevance");
  }

  const chips = [
    category !== "All" ? { id: "category", label: category, clear: () => setCategory("All") } : null,
    brand !== "All" ? { id: "brand", label: brand, clear: () => setBrand("All") } : null,
    seller !== "All" ? { id: "seller", label: seller, clear: () => setSeller("All") } : null,
    minRating !== "0" ? { id: "rating", label: `${minRating}★ and up`, clear: () => setMinRating("0") } : null,
    minPrice || maxPrice ? { id: "price", label: `₹${minPrice || "0"}–${maxPrice || "any"}`, clear: () => { setMinPrice(""); setMaxPrice(""); } } : null,
  ].filter((chip) => chip !== null);
  const heading = query.trim() ? `Results for “${query.trim()}”` : category === "All" ? "All products" : category;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[260px_1fr] lg:gap-8 lg:py-8">
      <div className="flex items-center justify-between lg:hidden">
        <h1 className="font-display text-3xl">{heading}</h1>
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className="min-h-10 rounded-full border border-[#e5e7eb] bg-white px-4 text-sm font-semibold"
          aria-expanded={filtersOpen}
        >
          {filtersOpen ? "Hide filters" : "Filters"}
        </button>
      </div>
      <aside className={`${filtersOpen ? "block" : "hidden"} h-fit rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5 lg:sticky lg:top-52 lg:block`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Filters</h2>
          <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#178a45]">
            Clear all
          </button>
        </div>
        <div className="grid gap-3">
          <label className="text-xs font-semibold text-[#40564e]">
            Search
            <input value={query} onChange={(event) => setQuery(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="Name, brand, category" />
          </label>
          <label className="text-xs font-semibold text-[#40564e]">
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)} className={`${inputClass} mt-1.5`}>
              <option>All</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#40564e]">
            Brand
            <select value={brand} onChange={(event) => setBrand(event.target.value)} className={`${inputClass} mt-1.5`}>
              <option>All</option>
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#40564e]">
            Seller
            <select value={seller} onChange={(event) => setSeller(event.target.value)} className={`${inputClass} mt-1.5`}>
              <option>All</option>
              {sellers.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-[#40564e]">
            Minimum rating
            <select value={minRating} onChange={(event) => setMinRating(event.target.value)} className={`${inputClass} mt-1.5`}>
              <option value="0">Any</option>
              <option value="3">3 and up</option>
              <option value="4">4 and up</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-semibold text-[#40564e]">
              Min ₹
              <input inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
            <label className="text-xs font-semibold text-[#40564e]">
              Max ₹
              <input inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className={`${inputClass} mt-1.5`} />
            </label>
          </div>
        </div>
      </aside>
      <div>
        <div className="mb-4 hidden items-end justify-between gap-3 lg:flex">
          <div>
            <h1 className="font-display text-4xl text-[#1c1c1c]">{heading}</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
          </div>
          <label className="text-xs font-semibold text-[#40564e]">
            Sort
            <select value={sort} onChange={(event) => setSort(event.target.value)} className={`${inputClass} mt-1.5 w-full sm:min-w-48`}>
              {sorts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <p className="text-sm text-[#6b7280]">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          <label className="text-xs font-semibold text-[#40564e]">
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className={`${inputClass} w-full min-w-40`}>
              {sorts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {chips.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.clear}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#e8f6ee] px-3 text-xs font-semibold text-[#12753b]"
              >
                {chip.label}
                <span aria-hidden="true">×</span>
                <span className="sr-only">Remove {chip.label}</span>
              </button>
            ))}
          </div>
        ) : null}
        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d5d3c8] bg-white px-6 py-16 text-center">
            <h2 className="font-display text-3xl">No matches</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#58655d]">Nothing matches that search or those filters.</p>
            <button type="button" onClick={clearFilters} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
