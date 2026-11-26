"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import { inr } from "@/lib/format";
import type { Product } from "@/types/store";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { settings } = useSettings();
  const [added, setAdded] = useState(false);
  const seller = product.seller.type === "platform" ? settings.brandName : product.seller.name;
  const unavailable = product.stock < 1;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(28,28,28,0.1)]">
      <Link href={`/product/${product.slug}`} aria-label={product.name} className="relative block aspect-square overflow-hidden bg-[#f4f1ea]">
        <Image
          src={product.images[0]?.src ?? ""}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {unavailable ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#b45309] shadow-sm">
            Out of stock
          </span>
        ) : product.topSeller ? (
          <span aria-hidden="true" className="absolute left-2.5 top-2.5 rounded-full bg-[#178a45] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            Popular
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a8175]">{product.category}</p>
        <h3 className="mt-1 min-h-10 text-[13px] font-semibold leading-5 text-[#1c1c1c] sm:text-sm">
          <Link href={`/product/${product.slug}`} className="hover:text-[#178a45]">
            {product.name}
          </Link>
        </h3>
        {product.reviewCount > 0 ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-[#6b7280]">
            <span className="text-[#e07a12]" aria-label={`${product.rating} out of 5 stars`}>
              ★
            </span>
            <span className="font-medium text-[#1c1c1c]">{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-[#9ca3af]">No reviews yet</p>
        )}
        <p className="mt-2 text-base font-bold tracking-tight text-[#1c1c1c]">{inr(product.price)}</p>
        <p className="mt-0.5 truncate text-[11px] text-[#6b7280]">Sold by {seller}</p>
        <button
          type="button"
          disabled={unavailable}
          onClick={() => {
            add(product.slug, 1);
            setAdded(true);
          }}
          className={`mt-3 min-h-10 rounded-full text-xs font-semibold transition-colors ${
            added
              ? "bg-[#e8f6ee] text-[#12753b]"
              : "bg-[#178a45] text-white hover:bg-[#12753b] disabled:cursor-not-allowed disabled:bg-[#d1d5db]"
          }`}
        >
          {unavailable ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
