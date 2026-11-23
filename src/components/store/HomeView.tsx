"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useSettings } from "@/components/settings/SettingsProvider";
import { categoryTiles, products } from "@/data/catalog";
import { inr } from "@/lib/format";

export default function HomeView() {
  const { settings } = useSettings();
  const featured = settings.featuredSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product) => product !== undefined);
  const inStock = products.filter((product) => product.stock > 0);
  const newest = inStock
    .filter((product) => !featured.some((item) => item.slug === product.slug))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const grid = [...featured, ...newest].slice(0, 8);
  const deals = [...inStock].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const spotlight = products.find((product) => product.slug === "studio-headphones") ?? products[0];
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function subscribe(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setJoined(true);
  }

  return (
    <div className="pb-12">
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-5 md:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col justify-center rounded-3xl bg-white px-5 py-8 md:px-10 md:py-10">
          <p className="text-sm font-medium text-[#178a45]">Everything in one cart</p>
          <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-tight text-[#1c1c1c] sm:text-5xl">
            Shop computers, home, and everyday finds.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#6b7280]">
            Platform goods and approved sellers. Prices in rupees. One payment covers the whole cart.
          </p>
          <Link href="/catalog" className="mt-6 inline-flex min-h-11 w-fit items-center rounded-full bg-[#178a45] px-6 text-sm font-semibold text-white hover:bg-[#12753b]">
            Shop now
          </Link>
        </div>
        {spotlight ? (
          <Link href={`/product/${spotlight.slug}`} className="grid items-center gap-4 rounded-3xl bg-[#fff4e8] p-6 sm:grid-cols-[1fr_160px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#e07a12]">Featured</p>
              <h2 className="mt-2 text-2xl font-semibold leading-snug">{spotlight.name}</h2>
              <p className="mt-2 text-sm text-[#6b7280]">★ {spotlight.rating.toFixed(1)} · {spotlight.reviewCount} reviews</p>
              <p className="mt-3 text-2xl font-bold">{inr(spotlight.price)}</p>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-white">
              <Image src={spotlight.images[0]?.src ?? ""} alt={spotlight.images[0]?.alt ?? spotlight.name} fill sizes="180px" className="object-cover" priority />
            </div>
          </Link>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(28,28,28,0.04)] md:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#178a45]">Departments</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Shop by category</h2>
            </div>
            <Link href="/catalog" className="shrink-0 text-sm font-semibold text-[#178a45]">
              See all
            </Link>
          </div>
          <div className="no-scrollbar -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-5 sm:gap-x-2 sm:overflow-visible xl:grid-cols-10">
            {categoryTiles.map((category) => (
              <Link
                key={category.name}
                href={`/catalog?category=${encodeURIComponent(category.name)}`}
                className="group flex w-[84px] shrink-0 flex-col items-center text-center sm:w-auto"
              >
                <span
                  className="grid size-[72px] place-items-center rounded-full p-1.5 transition duration-200 group-hover:-translate-y-1 sm:size-[88px]"
                  style={{ backgroundColor: category.tint }}
                >
                  <span className="relative size-full overflow-hidden rounded-full bg-white ring-2 ring-white shadow-[0_6px_16px_rgba(28,28,28,0.08)]">
                    <Image src={category.image} alt="" fill sizes="88px" className="object-cover transition duration-300 group-hover:scale-105" />
                  </span>
                </span>
                <span className="mt-2.5 text-[13px] font-semibold leading-4 text-[#1c1c1c] group-hover:text-[#178a45]">
                  {category.name}
                </span>
                <span className="mt-1 hidden text-[11px] leading-4 text-[#6b7280] sm:block">{category.blurb}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2 md:px-6">
        <Link href="/catalog?category=Home%20%26%20Living" className="grid overflow-hidden rounded-3xl bg-[#f7f1e8] sm:grid-cols-[1fr_180px]">
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#a16207]">Home edit</p>
            <h2 className="mt-2 text-2xl font-semibold leading-snug">Lamps, shades, and gifts, packed to your door.</h2>
            <span className="mt-4 inline-flex min-h-10 items-center rounded-full bg-[#178a45] px-4 text-sm font-semibold text-white">Shop home</span>
          </div>
          <div className="relative min-h-40">
            <Image src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80" alt="Brass table lamp" fill sizes="180px" className="object-cover" />
          </div>
        </Link>
        <Link href="/catalog?category=Fashion" className="grid overflow-hidden rounded-3xl bg-[#eef6f0] sm:grid-cols-[1fr_180px]">
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#178a45]">From sellers</p>
            <h2 className="mt-2 text-2xl font-semibold leading-snug">Fashion from approved agents, paid with the rest of the cart.</h2>
            <span className="mt-4 inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-[#1c1c1c]">Browse fashion</span>
          </div>
          <div className="relative min-h-40">
            <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80" alt="Leather tote bag" fill sizes="180px" className="object-cover" />
          </div>
        </Link>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl bg-white p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Featured products</h2>
            <Link href="/catalog" className="text-sm font-semibold text-[#178a45]">
              See more
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {grid.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(28,28,28,0.04)] md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e07a12]">Today</p>
              <h2 className="mt-1 text-lg font-semibold">Deals of the day</h2>
            </div>
            <Link href="/catalog" className="text-sm font-semibold text-[#178a45]">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {deals.map((product) => (
              <ProductCard key={`deal-${product.slug}`} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-4 mt-8 grid max-w-7xl overflow-hidden rounded-3xl bg-[#fbf7f2] md:mx-auto md:grid-cols-2">
        <form onSubmit={subscribe} className="px-6 py-10 md:px-10">
          <h2 className="text-3xl font-semibold tracking-tight">Subscribe to the news</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#6b7280]">New arrivals and seller drops. No account required for this preview.</p>
          <div className="mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="news-email">Email</label>
            <input
              id="news-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="min-h-11 flex-1 rounded-full border border-[#e5e7eb] bg-white px-4 text-sm outline-none"
            />
            <button type="submit" className="min-h-11 w-full rounded-full bg-[#1c1c1c] px-5 text-sm font-semibold text-white sm:w-auto">
              Join
            </button>
          </div>
          {joined ? <p className="mt-3 text-sm text-[#178a45]">You are on the list.</p> : null}
        </form>
        <div className="relative min-h-56">
          <Image
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
            alt="Shopper smiling in a light sweater"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
}
