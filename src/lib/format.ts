export function inr(amount: number) {
  const paise = Math.round(Math.abs(amount) * 100);
  const digits = paise % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: digits,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string) {
  const value = iso.length === 10 ? `${iso}T00:00:00` : iso;
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
