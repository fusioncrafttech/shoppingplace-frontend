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
    <article className="flex min-w-0 flex-col rounded-2xl border border-[#f0f0f0] bg-white p-2.5 sm:p-3">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-[#f6f6f6]">
        <Image
          src={product.images[0]?.src ?? ""}
          alt={product.images[0]?.alt ?? product.name}
          fill
          sizes="(min-width: 1024px) 22vw, 45vw"
          className="object-cover"
        />
        {unavailable ? (
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#b45309]">
            Out of stock
          </span>
        ) : null}
      </Link>
      <h3 className="mt-2.5 min-h-10 text-[13px] font-medium leading-5 text-[#1c1c1c] sm:mt-3 sm:text-sm">
        <Link href={`/product/${product.slug}`} className="hover:text-[#178a45]">
          {product.name}
        </Link>
      </h3>
      {product.reviewCount > 0 ? (
        <p className="mt-1 flex items-center gap-1 text-xs text-[#6b7280]">
          <span className="text-[#e07a12]" aria-label={`${product.rating} out of 5 stars`}>
            ★
          </span>
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </p>
      ) : (
        <p className="mt-1 text-xs text-[#9ca3af]">No reviews yet</p>
      )}
      <p className="mt-2 text-sm font-bold text-[#1c1c1c] sm:text-base">{inr(product.price)}</p>
      <p className="mt-0.5 truncate text-[11px] text-[#6b7280]">Sold by {seller}</p>
      <button
        type="button"
        disabled={unavailable}
        onClick={() => {
          add(product.slug, 1);
          setAdded(true);
        }}
        className="mt-3 min-h-9 rounded-full bg-[#178a45] text-xs font-semibold text-white hover:bg-[#12753b] disabled:cursor-not-allowed disabled:bg-[#d1d5db]"
      >
        {unavailable ? "Out of stock" : added ? "Added" : "Add"}
      </button>
    </article>
  );
}
