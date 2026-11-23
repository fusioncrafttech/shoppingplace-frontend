export type CartInput = {
  name: string;
  seller: string;
  sellerType: "platform" | "agent";
  qty: number;
  unit: number;
};

export type PricedLine = CartInput & {
  gross: number;
  discount: number;
  base: number;
};

export type SellerGroup = {
  seller: string;
  sellerType: "platform" | "agent";
  lines: PricedLine[];
  merchandise: number;
  discount: number;
};

export type PricedCart = {
  lines: PricedLine[];
  groups: SellerGroup[];
  merchandise: number;
  discount: number;
  shipping: number;
  total: number;
  promoLabel?: string;
  promoError?: string;
};

function allocatePaise(totalPaise: number, weights: number[]) {
  if (weights.length === 0) return [];
  const safe = weights.map((weight) => Math.max(0, weight));
  const sum = safe.reduce((total, weight) => total + weight, 0);
  if (totalPaise <= 0 || sum <= 0) return safe.map(() => 0);

  const raw = safe.map((weight) => (totalPaise * weight) / sum);
  const floors = raw.map((value) => Math.floor(value));
  let left = totalPaise - floors.reduce((total, value) => total + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  const shares = [...floors];
  let cursor = 0;
  while (left > 0) {
    shares[order[cursor % order.length].index] += 1;
    left -= 1;
    cursor += 1;
  }
  return shares;
}

function roundPaise(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function priceCart(items: CartInput[], code: string | null): PricedCart {
  const lines: PricedLine[] = items.map((item) => {
    const gross = roundPaise(item.unit * item.qty);
    return { ...item, gross, discount: 0, base: gross };
  });

  let promoLabel: string | undefined;
  let promoError: string | undefined;
  const normalized = code?.trim().toUpperCase() ?? "";

  if (normalized) {
    const grosses = lines.map((line) => line.gross);
    const merchandise = grosses.reduce((total, gross) => total + gross, 0);
    if (normalized === "SAVE100") {
      if (merchandise < 500) {
        promoError = "SAVE100 applies on merchandise of ₹500 or more.";
      } else {
        const shares = allocatePaise(10000, grosses);
        lines.forEach((line, index) => {
          line.discount = shares[index] / 100;
          line.base = roundPaise(line.gross - line.discount);
        });
        promoLabel = "SAVE100 · platform funded · ₹100 off";
      }
    } else if (normalized === "ATELIER10") {
      const weights = lines.map((line) => (line.seller === "Atelier North" ? line.gross : 0));
      const sellerGross = weights.reduce((total, gross) => total + gross, 0);
      if (sellerGross <= 0) {
        promoError = "ATELIER10 applies only to items sold by Atelier North.";
      } else {
        const offPaise = Math.round(sellerGross * 10);
        const shares = allocatePaise(offPaise, weights);
        lines.forEach((line, index) => {
          line.discount = shares[index] / 100;
          line.base = roundPaise(line.gross - line.discount);
        });
        promoLabel = "ATELIER10 · funded by Atelier North";
      }
    } else {
      promoError = "That code does not apply to this cart.";
    }
  }

  const groups: SellerGroup[] = [];
  lines.forEach((line) => {
    let group = groups.find((entry) => entry.seller === line.seller);
    if (!group) {
      group = { seller: line.seller, sellerType: line.sellerType, lines: [], merchandise: 0, discount: 0 };
      groups.push(group);
    }
    group.lines.push(line);
    group.merchandise = roundPaise(group.merchandise + line.gross);
    group.discount = roundPaise(group.discount + line.discount);
  });

  const merchandise = roundPaise(lines.reduce((total, line) => total + line.gross, 0));
  const discount = roundPaise(lines.reduce((total, line) => total + line.discount, 0));
  const afterDiscount = roundPaise(merchandise - discount);
  const shipping = afterDiscount <= 0 ? 0 : afterDiscount >= 5000 ? 0 : 80;
  const total = roundPaise(afterDiscount + shipping);

  return { lines, groups, merchandise, discount, shipping, total, promoLabel, promoError };
}
