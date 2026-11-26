"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
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
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 shadow-[0_8px_24px_rgba(28,28,28,0.04)] backdrop-blur">
      <div className="bg-[#123024] text-xs text-[#d7eadf]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-6">
          <p className="min-w-0 truncate">Delivered across India · One payment for the whole cart</p>
          <Link href="/apply" className="shrink-0 font-semibold text-white hover:text-[#f3d7a2]">
            <span className="sm:hidden">Sell</span>
            <span className="hidden sm:inline">Apply as Agent</span>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-5 md:px-6">
        <Link href="/" aria-label={`${settings.brandName} home`} className="flex shrink-0 items-center gap-2.5 text-[#1c1c1c]">
          <span className="grid size-9 place-items-center rounded-xl bg-[#178a45] text-sm font-bold text-white shadow-[0_6px_14px_rgba(23,138,69,0.28)]">
            {settings.brandName.slice(0, 1)}
          </span>
          <span className="text-lg font-bold tracking-tight sm:text-xl">{settings.brandName.toLowerCase()}</span>
        </Link>
        <form onSubmit={search} className="hidden min-w-0 flex-1 md:block" role="search">
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <div className="flex overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f6f7f5] focus-within:border-[#178a45] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#178a45]/10">
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="min-h-12 min-w-0 flex-1 bg-transparent px-5 text-sm outline-none"
            />
            <button type="submit" className="m-1 inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-[#178a45] px-4 text-sm font-semibold text-white hover:bg-[#12753b]">
              <SearchIcon />
              Search
            </button>
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-medium text-[#1c1c1c] hover:bg-[#f3f4f6] sm:px-3">
            <UserIcon />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
          <Link href="/account" className="hidden min-h-11 items-center rounded-full px-3 text-sm font-medium text-[#1c1c1c] hover:bg-[#f3f4f6] lg:inline-flex">
            Account
          </Link>
          <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-medium hover:bg-[#f3f4f6] sm:px-3">
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-[#e07a12] px-1.5 text-[11px] font-bold text-white">{count}</span>
            ) : null}
          </Link>
        </div>
      </div>
      <form onSubmit={search} className="px-4 pb-3 md:hidden" role="search">
        <label className="sr-only" htmlFor="site-search-mobile">
          Search products
        </label>
        <div className="flex overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f6f7f5] focus-within:border-[#178a45] focus-within:bg-white">
          <input
            id="site-search-mobile"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="min-h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
          />
          <button type="submit" className="m-1 inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#178a45] px-3 text-sm font-semibold text-white">
            <SearchIcon />
            Search
          </button>
        </div>
      </form>
      <Suspense fallback={<CategoryNav active="" />}>
        <CategoryNavLive />
      </Suspense>
    </header>
  );
}

function CategoryNavLive() {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = pathname.startsWith("/catalog") ? (params.get("category") ?? "All") : "";
  return <CategoryNav active={categories.includes(active) || active === "All" ? active : ""} />;
}

function CategoryNav({ active }: { active: string }) {
  return (
    <nav aria-label="Categories" className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 md:flex-wrap md:overflow-visible md:px-6">
      <CategoryPill href="/catalog" label="All" current={active === "All"} />
      {categories.map((category) => (
        <CategoryPill
          key={category}
          href={`/catalog?category=${encodeURIComponent(category)}`}
          label={category}
          current={active === category}
        />
      ))}
    </nav>
  );
}

function CategoryPill({ href, label, current }: { href: string; label: string; current: boolean }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        current ? "bg-[#178a45] text-white" : "bg-[#f3f4f6] text-[#374151] hover:bg-[#e8f6ee] hover:text-[#178a45]"
      }`}
    >
      {label}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2c1.4-2.6 3.6-3.7 7-3.7s5.6 1.1 7 3.7" />
    </svg>
  );
}
