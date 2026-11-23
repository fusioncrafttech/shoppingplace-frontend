"use client";

import Link from "next/link";
import { useSettings } from "@/components/settings/SettingsProvider";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/catalog" },
      { label: "Electronics", href: "/catalog?category=Electronics" },
      { label: "Fashion", href: "/catalog?category=Fashion" },
      { label: "Home & Living", href: "/catalog?category=Home%20%26%20Living" },
      { label: "Kitchen", href: "/catalog?category=Kitchen" },
      { label: "Grocery", href: "/catalog?category=Grocery" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Orders", href: "/account" },
      { label: "Addresses", href: "/account" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Sell",
    links: [
      { label: "Apply as Agent", href: "/apply" },
      { label: "Seller setup", href: "/activate" },
      { label: "Agent console", href: "/agent" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Delivery", href: "/catalog" },
      { label: "Returns", href: "/account" },
      { label: "Contact", href: "/login" },
    ],
  },
];

export default function SiteFooter() {
  const { settings } = useSettings();
  return (
    <footer className="border-t border-[#ece7df] bg-[#fbf7f2] text-[#1c1c1c]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-5">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            {settings.brandName.toLowerCase()}
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#6b7280]">
            Platform goods and approved sellers, paid once at checkout.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-sm font-semibold">{column.title}</p>
            <ul className="mt-3 grid gap-2 text-sm text-[#4b5563]">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#178a45]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-[#ece7df]">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-[#6b7280] md:px-6">
          © {new Date().getFullYear()} {settings.brandName}. Interface preview with sample data.
        </p>
      </div>
    </footer>
  );
}
