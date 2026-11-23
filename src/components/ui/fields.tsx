import type { ReactNode } from "react";

export const inputClass =
  "min-h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#1c1c1c] outline-none placeholder:text-[#9ca3af] focus:border-[#1c1c1c]";

export const btnPrimary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#12753b] disabled:cursor-not-allowed disabled:opacity-50";

export const btnGold =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#12753b] disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d1d5db] bg-white px-5 text-sm font-semibold text-[#1c1c1c] transition-colors hover:border-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-50";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#40564e]">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs leading-5 text-[#6d7a72]">{hint}</span> : null}
    </label>
  );
}
