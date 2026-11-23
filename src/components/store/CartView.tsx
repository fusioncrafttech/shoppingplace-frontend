"use client";

import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { btnGold } from "@/components/ui/fields";
import { useCart } from "@/components/cart/CartProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import { inr } from "@/lib/format";

export default function CartView() {
  const { lines, setQty, remove, add, amount } = useCart();
  const { settings } = useSettings();
  const groups = new Map<string, typeof lines>();
  lines.forEach((line) => {
    const seller = line.product.seller.type === "platform" ? settings.brandName : line.product.seller.name;
    groups.set(seller, [...(groups.get(seller) ?? []), line]);
  });

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <EmptyState
          title="Your cart is empty"
          text="When you find something you like, it will wait here, grouped by the seller who ships it."
          action={{ href: "/catalog", label: "Browse the catalog" }}
        />
        <button
          type="button"
          className="mx-auto mt-6 block text-sm font-semibold text-[#a36545]"
          onClick={() => {
            add("brass-table-lamp", 1);
            add("cotton-shade", 2);
            add("gift-box", 1);
          }}
        >
          Add the sample mixed cart
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_300px] lg:px-10">
      <div>
        <h1 className="font-display text-3xl sm:text-5xl">Cart</h1>
        <p className="mt-2 text-sm text-[#58655d]">Items are grouped by the seller who will pack them.</p>
        <div className="mt-8 grid gap-8">
          {[...groups.entries()].map(([seller, sellerLines]) => (
            <section key={seller}>
              <h2 className="text-sm font-semibold tracking-wide text-[#a36545]">Ships from {seller}</h2>
              <div className="mt-3 divide-y divide-[#e4e2d9] border-y border-[#e4e2d9]">
                {sellerLines.map(({ product, qty }) => (
                  <div key={product.slug} className="grid grid-cols-[72px_1fr] gap-3 py-4 sm:grid-cols-[88px_1fr] sm:gap-4">
                    <div className={`relative aspect-square ${product.tone}`}>
                      {product.images[0] ? (
                        <Image src={product.images[0].src} alt="" fill sizes="88px" className="object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <Link href={`/product/${product.slug}`} className="font-medium hover:text-[#a36545]">
                          {product.name}
                        </Link>
                        <p className="font-semibold">{inr(product.price * qty)}</p>
                      </div>
                      <p className="mt-1 text-xs text-[#6d7a72]">{inr(product.price)} each</p>
                      <div className="mt-3 flex items-center gap-3">
                        <label className="text-xs text-[#40564e]">
                          Qty
                          <input
                            type="number"
                            min={1}
                            max={product.stock}
                            value={qty}
                            onChange={(event) => setQty(product.slug, Number(event.target.value))}
                            className="ml-2 min-h-9 w-16 border border-[#d5d3c8] bg-white px-2 text-sm"
                          />
                        </label>
                        <button type="button" onClick={() => remove(product.slug)} className="text-xs font-semibold text-[#a36545]">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <aside className="h-fit border border-[#e4e2d9] bg-[#f7f6f1] p-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#a36545]">SUMMARY</p>
        <p className="mt-3 flex justify-between text-sm">
          <span>Merchandise</span>
          <span>{inr(amount)}</span>
        </p>
        <p className="mt-2 text-xs leading-5 text-[#6d7a72]">Shipping and any promo code are added at checkout. One code per order.</p>
        <Link href="/checkout" className={`${btnGold} mt-5 w-full`}>
          Checkout
        </Link>
      </aside>
    </div>
  );
}
