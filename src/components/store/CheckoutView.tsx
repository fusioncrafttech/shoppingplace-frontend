"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useSettings } from "@/components/settings/SettingsProvider";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { btnGold, btnGhost, inputClass } from "@/components/ui/fields";
import { products } from "@/data/catalog";
import { customerAddresses } from "@/data/records";
import { inr } from "@/lib/format";
import { priceCart, type CartInput } from "@/lib/pricing";
import type { Address } from "@/types/store";

export default function CheckoutView() {
  const params = useSearchParams();
  const router = useRouter();
  const { lines, clear, remove, placeOrder } = useCart();
  const { settings } = useSettings();
  const buy = params.get("buy");
  const buyQty = Math.max(1, Number(params.get("qty") ?? 1) || 1);
  const [addresses, setAddresses] = useState<Address[]>(customerAddresses);
  const [addressId, setAddressId] = useState(customerAddresses[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: "New", name: "", phone: "", lines: "" });
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [failure, setFailure] = useState("");
  const [addressError, setAddressError] = useState("");

  const source: CartInput[] = useMemo(() => {
    if (buy) {
      const product = products.find((item) => item.slug === buy);
      if (!product || product.stock < 1) return [];
      return [
        {
          name: product.name,
          seller: product.seller.type === "platform" ? settings.brandName : product.seller.name,
          sellerType: product.seller.type,
          qty: Math.min(buyQty, product.stock),
          unit: product.price,
        },
      ];
    }
    return lines.map(({ product, qty }) => ({
      name: product.name,
      seller: product.seller.type === "platform" ? settings.brandName : product.seller.name,
      sellerType: product.seller.type,
      qty,
      unit: product.price,
    }));
  }, [buy, buyQty, lines, settings.brandName]);

  const priced = priceCart(source, applied);
  const address = addresses.find((item) => item.id === addressId);

  if (source.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Nothing to check out"
          text="Your cart is empty, or that product is out of stock. A failed payment does not create an order."
          action={{ href: "/catalog", label: "Browse the catalog" }}
        />
      </div>
    );
  }

  function applyCode(event: FormEvent) {
    event.preventDefault();
    setApplied(code);
  }

  function saveAddress(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.phone.trim() || !draft.lines.trim()) return;
    const next = { id: `addr-${Date.now()}`, ...draft };
    setAddresses((current) => [...current, next]);
    setAddressId(next.id);
    setAdding(false);
    setDraft({ label: "New", name: "", phone: "", lines: "" });
  }

  function capture() {
    if (!address) return;
    const id = `SP-${Math.floor(10000 + Math.random() * 89999)}`;
    placeOrder({
      id,
      placedAt: new Date().toISOString(),
      total: priced.total,
      address: `${address.name}, ${address.lines}`,
      groups: priced.groups.map((group) => ({
        seller: group.seller,
        status: "Confirmed",
        lines: group.lines.map((line) => ({ name: line.name, qty: line.qty, amount: line.base })),
      })),
    });
    if (buy) remove(buy);
    else clear();
    setPaying(false);
    router.push(`/checkout/confirmation?id=${id}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_340px] lg:px-10">
      <div>
        <h1 className="font-display text-5xl">Checkout</h1>
        <p className="mt-2 text-sm text-[#58655d]">
          {buy ? "Buy now checks out this single item." : "One payment covers every seller in the cart."}
        </p>
        {failure ? (
          <p className="mt-5 border border-[#e7c4b6] bg-[#f8ece6] px-4 py-3 text-sm leading-6 text-[#8a3d24]" role="alert">
            {failure}
          </p>
        ) : null}

        <section className="mt-8">
          <h2 className="font-display text-3xl">Delivery address</h2>
          <div className="mt-4 grid gap-3">
            {addresses.map((item) => (
              <label key={item.id} className={`block cursor-pointer border p-4 ${addressId === item.id ? "border-[#173c37] bg-white" : "border-[#e4e2d9]"}`}>
                <span className="flex items-start gap-3">
                  <input type="radio" name="address" checked={addressId === item.id} onChange={() => setAddressId(item.id)} className="mt-1" />
                  <span>
                    <span className="block text-sm font-semibold">{item.label} · {item.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#40564e]">{item.lines}</span>
                    <span className="mt-1 block text-xs text-[#6d7a72]">{item.phone}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
          {adding ? (
            <form onSubmit={saveAddress} className="mt-4 grid gap-3 border border-[#e4e2d9] p-4">
              <input required placeholder="Label" value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} className={inputClass} />
              <input required placeholder="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={inputClass} />
              <input required placeholder="Phone" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} className={inputClass} />
              <textarea required placeholder="Address" value={draft.lines} onChange={(event) => setDraft({ ...draft, lines: event.target.value })} className={`${inputClass} min-h-24 py-2`} />
              <button type="submit" className={btnGhost}>Save address</button>
            </form>
          ) : (
            <button type="button" onClick={() => setAdding(true)} className="mt-4 text-sm font-semibold text-[#a36545]">
              Add an address
            </button>
          )}
          {addressError ? <p className="mt-3 text-sm text-[#8a3d24]">{addressError}</p> : null}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-3xl">Promo code</h2>
          <p className="mt-2 text-sm text-[#58655d]">One code. Try SAVE100 for ₹100 off, or ATELIER10 on Atelier North items.</p>
          <form onSubmit={applyCode} className="mt-4 flex flex-wrap gap-3">
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Code" className={`${inputClass} max-w-xs`} />
            <button type="submit" className={btnGhost}>Apply</button>
            {applied ? (
              <button type="button" className="text-sm font-semibold text-[#a36545]" onClick={() => { setApplied(null); setCode(""); }}>
                Remove
              </button>
            ) : null}
          </form>
          {priced.promoError ? <p className="mt-3 text-sm text-[#8a3d24]">{priced.promoError}</p> : null}
          {priced.promoLabel ? <p className="mt-3 text-sm text-[#1d5c42]">{priced.promoLabel}</p> : null}
        </section>
      </div>

      <aside className="h-fit border border-[#e4e2d9] bg-[#f7f6f1] p-5">
        <h2 className="text-xs font-semibold tracking-[0.14em] text-[#a36545]">ORDER</h2>
        <div className="mt-4 grid gap-5">
          {priced.groups.map((group) => (
            <div key={group.seller}>
              <p className="text-sm font-semibold">Ships from {group.seller}</p>
              <ul className="mt-2 grid gap-1 text-sm text-[#40564e]">
                {group.lines.map((line) => (
                  <li key={line.name} className="flex justify-between gap-3">
                    <span>{line.name} × {line.qty}</span>
                    <span>{inr(line.gross)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <dl className="mt-5 grid gap-2 border-t border-[#e4e2d9] pt-4 text-sm">
          <div className="flex justify-between"><dt>Merchandise</dt><dd>{inr(priced.merchandise)}</dd></div>
          <div className="flex justify-between"><dt>Discount</dt><dd>{priced.discount ? `−${inr(priced.discount)}` : inr(0)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{priced.shipping ? inr(priced.shipping) : "Free"}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>Amount due</dt><dd>{inr(priced.total)}</dd></div>
        </dl>
        <button
          type="button"
          className={`${btnGold} mt-5 w-full`}
          onClick={() => {
            if (!address) {
              setAddressError("Choose a delivery address before paying.");
              return;
            }
            setAddressError("");
            setFailure("");
            setPaying(true);
          }}
        >
          Pay {inr(priced.total)} with Razorpay
        </button>
        <p className="mt-3 text-xs leading-5 text-[#6d7a72]">The order is confirmed only after payment is captured. This preview does not charge a card.</p>
      </aside>

      {paying ? (
        <Modal title="Razorpay" onClose={() => setPaying(false)}>
          <p className="text-sm leading-6 text-[#40564e]">
            Checkout preview for {inr(priced.total)}. Funds in the live product would settle to the owner’s Razorpay account. Nothing is charged here.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            {["UPI", "Card", "Netbanking"].map((method) => (
              <div key={method} className="border border-[#e4e2d9] bg-white px-3 py-4">{method}</div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className={btnGold} onClick={capture}>
              Capture payment
            </button>
            <button
              type="button"
              className={btnGhost}
              onClick={() => {
                setPaying(false);
                setFailure("Payment was not captured. Your cart is unchanged, and no order was created.");
              }}
            >
              Fail payment
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
