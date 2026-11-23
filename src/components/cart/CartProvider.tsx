"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/data/catalog";
import type { PlacedOrder, Product } from "@/types/store";

type Line = { slug: string; qty: number };

type CartContextValue = {
  lines: { product: Product; qty: number }[];
  count: number;
  amount: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  orders: PlacedOrder[];
  placeOrder: (order: PlacedOrder) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartKey = "shoppingplace-cart";
const orderKey = "shoppingplace-orders";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedLines = localStorage.getItem(cartKey);
      const storedOrders = localStorage.getItem(orderKey);
      if (storedLines) setLines(JSON.parse(storedLines) as Line[]);
      if (storedOrders) setOrders(JSON.parse(storedOrders) as PlacedOrder[]);
    } catch {
      setLines([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(cartKey, JSON.stringify(lines));
  }, [lines, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(orderKey, JSON.stringify(orders));
  }, [orders, ready]);

  const detailed = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((item) => item.slug === line.slug);
          return product ? { product, qty: line.qty } : null;
        })
        .filter((line): line is { product: Product; qty: number } => line !== null),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines: detailed,
      count: detailed.reduce((total, line) => total + line.qty, 0),
      amount: detailed.reduce((total, line) => total + line.product.price * line.qty, 0),
      add: (slug, qty = 1) => {
        const product = products.find((item) => item.slug === slug);
        if (!product || product.stock < 1) return;
        setLines((current) => {
          const existing = current.find((line) => line.slug === slug);
          const nextQty = Math.min(product.stock, (existing?.qty ?? 0) + qty);
          if (existing) return current.map((line) => (line.slug === slug ? { ...line, qty: nextQty } : line));
          return [...current, { slug, qty: nextQty }];
        });
      },
      setQty: (slug, qty) => {
        const product = products.find((item) => item.slug === slug);
        if (!product) return;
        setLines((current) => {
          if (qty <= 0) return current.filter((line) => line.slug !== slug);
          return current.map((line) =>
            line.slug === slug ? { ...line, qty: Math.min(product.stock, qty) } : line,
          );
        });
      },
      remove: (slug) => setLines((current) => current.filter((line) => line.slug !== slug)),
      clear: () => setLines([]),
      orders,
      placeOrder: (order) => setOrders((current) => [order, ...current]),
    }),
    [detailed, orders],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
