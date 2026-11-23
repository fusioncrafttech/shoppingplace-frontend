"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = { href: string; label: string; badge?: number };

export default function DashboardShell({
  role,
  name,
  nav,
  children,
}: {
  role: string;
  name: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f3f1e9] text-[#173c37] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="no-print bg-[#173c37] text-[#f6f1e6] lg:min-h-screen">
        <div className="flex items-center justify-between gap-4 px-5 py-5 lg:block">
          <Link href="/" className="font-display text-2xl">
            ShoppingPlace<span className="text-[#e8b77e]">.</span>
          </Link>
          <p className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-[#e8b77e]">{role.toUpperCase()}</p>
        </div>
        <nav aria-label={`${role} navigation`} className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:px-3 lg:pb-8">
          {nav.map((item) => {
            const active = item.href === "/admin" || item.href === "/agent" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-10 shrink-0 items-center justify-between gap-3 px-3 text-sm ${active ? "bg-[#e8b77e] text-[#173c37]" : "text-[#e7eee9] hover:bg-white/10"}`}
              >
                <span>{item.label}</span>
                {item.badge ? <span className={`grid min-w-5 place-items-center px-1 text-[10px] font-semibold ${active ? "bg-[#173c37] text-[#e8b77e]" : "bg-[#e8b77e] text-[#173c37]"}`}>{item.badge}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <div className="no-print flex items-center justify-between gap-4 border-b border-[#e4e2d9] bg-[#fbfaf6] px-4 py-4 md:px-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#a36545]">{role}</p>
            <p className="text-sm font-medium">{name}</p>
          </div>
          <Link href="/" className="text-sm font-medium text-[#40564e] hover:text-[#a36545]">
            View store
          </Link>
        </div>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
