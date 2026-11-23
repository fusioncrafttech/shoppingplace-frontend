"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import { categories } from "@/data/catalog";

export default function SiteHeader() {
  const { count } = useCart();
  const { settings } = useSettings();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function search(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/catalog?q=${encodeURIComponent(value)}` : "/catalog");
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="bg-[#f7f7f8] text-xs text-[#4b5563]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-6">
          <p className="min-w-0 truncate">Delivered across India · One payment</p>
          <Link href="/apply" className="shrink-0 font-semibold text-[#1c1c1c] hover:text-[#178a45] sm:hidden">
            Sell
          </Link>
          <Link href="/apply" className="hidden shrink-0 font-semibold text-[#1c1c1c] hover:text-[#178a45] sm:inline">
            Apply as Agent
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6 md:px-6">
        <Link href="/" aria-label={`${settings.brandName} home`} className="shrink-0 text-lg font-bold tracking-tight text-[#1c1c1c] sm:text-xl">
          {settings.brandName.toLowerCase()}
        </Link>
        <form onSubmit={search} className="hidden min-w-0 flex-1 md:block" role="search">
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <div className="flex overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f7f7f8] focus-within:border-[#1c1c1c] focus-within:bg-white">
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands, categories"
              className="min-h-11 w-full bg-transparent px-5 text-sm outline-none"
            />
            <button type="submit" aria-label="Search" className="grid w-12 place-items-center text-[#1c1c1c]">
              <SearchIcon />
            </button>
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link href="/login" className="px-1 text-sm font-medium text-[#1c1c1c] hover:text-[#178a45] sm:px-2">
            Sign in
          </Link>
          <Link href="/account" className="hidden px-2 text-sm font-medium text-[#1c1c1c] hover:text-[#178a45] md:inline">
            Account
          </Link>
          <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative grid size-11 place-items-center rounded-full hover:bg-[#f3f4f6]">
            <CartIcon />
            <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-[#e07a12] px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          </Link>
        </div>
      </div>
      <form onSubmit={search} className="px-4 pb-3 md:hidden" role="search">
        <label className="sr-only" htmlFor="site-search-mobile">
          Search products
        </label>
        <div className="flex overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f7f7f8] focus-within:border-[#1c1c1c] focus-within:bg-white">
          <input
            id="site-search-mobile"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="min-h-11 w-full bg-transparent px-4 text-sm outline-none"
          />
          <button type="submit" aria-label="Search" className="grid w-11 shrink-0 place-items-center text-[#1c1c1c]">
            <SearchIcon />
          </button>
        </div>
      </form>
      <nav aria-label="Categories" className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 md:flex-wrap md:overflow-visible md:px-6">
        <Link href="/catalog" className="shrink-0 rounded-full bg-[#1c1c1c] px-3.5 py-1.5 text-sm font-medium text-white">
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/catalog?category=${encodeURIComponent(category)}`}
            className="shrink-0 rounded-full bg-[#f3f4f6] px-3.5 py-1.5 text-sm font-medium text-[#374151] hover:bg-[#e8f6ee] hover:text-[#178a45]"
          >
            {category}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
