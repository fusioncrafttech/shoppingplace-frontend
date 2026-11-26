"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import { btnGold, btnGhost, inputClass } from "@/components/ui/fields";
import { visibleReviews } from "@/data/catalog";
import { formatDate, inr } from "@/lib/format";
import type { Product, Review } from "@/types/store";

export default function ProductDetail({ product }: { product: Product }) {
  const { settings } = useSettings();
  const { add } = useCart();
  const router = useRouter();
  const [image, setImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(visibleReviews(product));
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const seller = product.seller.type === "platform" ? settings.brandName : product.seller.name;
  const unavailable = product.stock < 1;
  const photo = product.images[image] ?? product.images[0];

  function leaveReview(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !text.trim()) {
      setReviewNote("Add a title and a short review.");
      return;
    }
    setReviews((current) => [
      {
        id: `local-${Date.now()}`,
        author: "You",
        rating,
        title: title.trim(),
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);
    setTitle("");
    setText("");
    setReviewNote("Your review is on this page for this visit.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#178a45]">{product.category}</p>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className={`relative aspect-square overflow-hidden rounded-[28px] ${product.tone}`}>
            {photo ? <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /> : null}
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-3">
              {product.images.map((item, index) => (
                <button key={item.src} type="button" onClick={() => setImage(index)} className={`relative size-20 overflow-hidden rounded-2xl ring-2 ${index === image ? "ring-[#178a45]" : "ring-transparent"}`} aria-label={`Show image ${index + 1}`}>
                  <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="rounded-[28px] bg-white p-6 shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5 sm:p-8">
          <h1 className="font-display text-4xl text-[#1c1c1c] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold">{inr(product.price)}</p>
          {product.reviewCount > 0 ? (
            <p className="mt-2 text-sm text-[#58655d]">
              ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#58655d]">No reviews yet.</p>
          )}
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#40564e]">{product.description}</p>
          <div className="mt-6 rounded-2xl bg-[#f6f3ec] p-4">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#a36545]">SOLD BY</p>
            <p className="mt-1 text-lg font-medium">{seller}</p>
            <p className="mt-1 text-sm leading-6 text-[#58655d]">
              {product.seller.type === "platform"
                ? `Sold by ${seller}.`
                : `Sold by ${seller}, an approved seller on ${settings.brandName}.`}
            </p>
          </div>
          <p className={`mt-5 text-sm font-semibold ${unavailable ? "text-[#8a3d24]" : "text-[#1d5c42]"}`}>
            {unavailable ? "Out of stock. This item cannot be added to the cart." : `${product.stock} in stock`}
          </p>
          <div className="mt-5">
            <label className="block max-w-28 text-xs font-semibold text-[#40564e]">
              Quantity
              <input
                type="number"
                min={1}
                max={Math.max(product.stock, 1)}
                value={qty}
                disabled={unavailable}
                onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))}
                className={`${inputClass} mt-1.5 w-full`}
              />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button type="button" disabled={unavailable} className={`${btnGhost} w-full`} onClick={() => add(product.slug, qty)}>
                Add to cart
              </button>
              <button
                type="button"
                disabled={unavailable}
                className={`${btnGold} w-full`}
                onClick={() => router.push(`/checkout?buy=${product.slug}&qty=${Math.min(qty, product.stock)}`)}
              >
                Buy now
              </button>
            </div>
          </div>
          <dl className="mt-8 grid gap-3 border-t border-[#e4e2d9] pt-6">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[140px_1fr] gap-3 text-sm">
                <dt className="text-[#6d7a72]">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-12 grid gap-10 rounded-[28px] bg-white p-6 shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5 lg:grid-cols-[1fr_320px] sm:p-8">
        <div>
          <h2 className="font-display text-4xl">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-[#58655d]">No reviews yet. If you have received this product, you can leave one.</p>
          ) : (
            <div className="mt-6 grid gap-5">
              {reviews.map((review) => (
                <article key={review.id} className="border-b border-[#e4e2d9] pb-5">
                  <p className="text-sm font-semibold">
                    {"★".repeat(review.rating)}
                    <span className="ml-2 text-[#58655d]">{review.title}</span>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#40564e]">{review.text}</p>
                  <p className="mt-2 text-xs text-[#6d7a72]">
                    {review.author} · {formatDate(review.date)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={leaveReview} className="h-fit rounded-2xl bg-[#f6f3ec] p-4">
          <h3 className="font-display text-2xl">Leave a review</h3>
          <p className="mt-1 text-xs leading-5 text-[#6d7a72]">For customers who have received the product.</p>
          <label className="mt-4 block text-xs font-semibold">
            Stars
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className={`${inputClass} mt-1.5`}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-xs font-semibold">
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} className={`${inputClass} mt-1.5`} />
          </label>
          <label className="mt-3 block text-xs font-semibold">
            Review
            <textarea value={text} onChange={(event) => setText(event.target.value)} className={`${inputClass} mt-1.5 min-h-24 py-2`} />
          </label>
          {reviewNote ? <p className="mt-3 text-xs text-[#40564e]">{reviewNote}</p> : null}
          <button type="submit" className={`${btnPrimaryClass} mt-4 w-full`}>
            Submit review
          </button>
        </form>
      </section>
    </div>
  );
}

const btnPrimaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white";
