"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useSettings } from "@/components/settings/SettingsProvider";
import { categoryTiles, products } from "@/data/catalog";
import { inr } from "@/lib/format";

const promises = [
  { title: "Across India", text: "Orders are packed and delivered nationwide." },
  { title: "One checkout", text: "Platform goods and seller items pay together." },
  { title: "Approved sellers", text: "Every agent is reviewed before they can list." },
  { title: "Track it later", text: "Orders stay in your account after you sign in." },
];

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
  const deals = [...inStock]
    .filter((product) => !grid.some((item) => item.slug === product.slug))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const spotlight = products.find((product) => product.slug === "studio-headphones") ?? products[0];
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  function subscribe(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setJoined(true);
  }

  return (
    <div className="pb-16">
      <section className="mx-auto max-w-7xl px-4 pt-5 md:px-6">
        <div className="grid overflow-hidden rounded-[28px] bg-[#123024] text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-14">
            <p className="text-sm font-semibold text-[#b7e4c7]">Everything in one cart</p>
            <h1 className="font-display mt-3 max-w-xl text-4xl leading-[1.05] text-white sm:text-6xl">
              Shop computers, home, and everyday finds.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#d7eadf] sm:text-base">
              Platform goods and approved sellers. Prices in rupees. One payment covers the whole cart.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/catalog" className="inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-[#123024] hover:bg-[#f3d7a2]">
                Shop now
              </Link>
              <Link href="/catalog?category=Home%20%26%20Living" className="inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white hover:bg-white/10">
                Shop home
              </Link>
            </div>
          </div>
          {spotlight ? (
            <Link href={`/product/${spotlight.slug}`} className="relative m-3 flex min-h-72 flex-col justify-end overflow-hidden rounded-[22px] bg-[#1d4a36] sm:m-4">
              <Image
                src={spotlight.images[0]?.src ?? ""}
                alt={spotlight.images[0]?.alt ?? spotlight.name}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="relative bg-gradient-to-t from-[#123024] via-[#123024]/75 to-transparent p-5 pt-16">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#f3d7a2]">Featured</p>
                <h2 className="mt-1 text-2xl font-semibold leading-snug">{spotlight.name}</h2>
                <p className="mt-1 text-sm text-[#d7eadf]">★ {spotlight.rating.toFixed(1)} · {spotlight.reviewCount} reviews</p>
                <p className="mt-2 text-2xl font-bold">{inr(spotlight.price)}</p>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {promises.map((item) => (
          <div key={item.title} className="rounded-2xl bg-white px-4 py-4 shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5">
            <p className="text-sm font-semibold text-[#123024]">{item.title}</p>
            <p className="mt-1 text-sm leading-5 text-[#6b7280]">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5 md:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#178a45]">Departments</p>
              <h2 className="font-display mt-1 text-3xl text-[#1c1c1c]">Shop by category</h2>
            </div>
            <Link href="/catalog" className="shrink-0 text-sm font-semibold text-[#178a45] hover:underline">
              See all
            </Link>
          </div>
          <div className="no-scrollbar -mx-1 mt-6 flex gap-3 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-5 sm:gap-x-3 sm:overflow-visible xl:grid-cols-10">
            {categoryTiles.map((category) => (
              <Link
                key={category.name}
                href={`/catalog?category=${encodeURIComponent(category.name)}`}
                className="group flex w-[92px] shrink-0 flex-col items-center text-center sm:w-auto"
              >
                <span
                  className="grid size-[76px] place-items-center rounded-full p-1.5 transition duration-200 group-hover:-translate-y-1 sm:size-[92px]"
                  style={{ backgroundColor: category.tint }}
                >
                  <span className="relative size-full overflow-hidden rounded-full bg-white ring-2 ring-white shadow-[0_8px_18px_rgba(28,28,28,0.1)]">
                    <Image src={category.image} alt="" fill sizes="92px" className="object-cover transition duration-300 group-hover:scale-105" />
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

      <section className="mx-auto mt-8 grid max-w-7xl gap-4 px-4 md:grid-cols-2 md:px-6">
        <Link href="/catalog?category=Home%20%26%20Living" className="group relative min-h-64 overflow-hidden rounded-[28px]">
          <Image src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c140c]/80 via-[#1c140c]/45 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#f3d7a2]">Home edit</p>
            <h2 className="mt-2 max-w-xs text-2xl font-semibold leading-snug sm:text-3xl">Lamps, shades, and gifts, packed to your door.</h2>
            <span className="mt-4 inline-flex min-h-10 w-fit items-center rounded-full bg-white px-4 text-sm font-semibold text-[#1c1c1c]">Shop home</span>
          </div>
        </Link>
        <Link href="/catalog?category=Fashion" className="group relative min-h-64 overflow-hidden rounded-[28px]">
          <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10281c]/80 via-[#10281c]/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b7e4c7]">From sellers</p>
            <h2 className="mt-2 max-w-xs text-2xl font-semibold leading-snug sm:text-3xl">Fashion from approved agents, paid with the rest of the cart.</h2>
            <span className="mt-4 inline-flex min-h-10 w-fit items-center rounded-full bg-[#178a45] px-4 text-sm font-semibold text-white">Browse fashion</span>
          </div>
        </Link>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#178a45]">Picked for you</p>
            <h2 className="font-display mt-1 text-3xl text-[#1c1c1c]">Featured products</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-[#178a45] hover:underline">
            See more
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {grid.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e07a12]">Highly rated</p>
            <h2 className="font-display mt-1 text-3xl text-[#1c1c1c]">More to explore</h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-[#178a45] hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={`deal-${product.slug}`} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-4 mt-12 grid max-w-7xl overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5 md:mx-auto md:grid-cols-2">
        <form onSubmit={subscribe} className="px-6 py-10 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#178a45]">Stay in the loop</p>
          <h2 className="font-display mt-2 text-4xl text-[#1c1c1c]">Subscribe to the news</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#6b7280]">New arrivals and seller drops. No account required for this preview.</p>
          <div className="mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="news-email">Email</label>
            <input
              id="news-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-12 flex-1 rounded-full border border-[#e5e7eb] bg-[#f7f7f8] px-4 text-sm outline-none focus:border-[#178a45] focus:bg-white"
            />
            <button type="submit" className="min-h-12 w-full rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white hover:bg-[#12753b] sm:w-auto">
              Join
            </button>
          </div>
          {joined ? <p className="mt-3 text-sm font-medium text-[#178a45]">You are on the list.</p> : null}
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
