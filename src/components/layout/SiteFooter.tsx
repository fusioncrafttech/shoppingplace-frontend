const footerLinks = [
  { label: "About", href: "#top" },
  { label: "Contact", href: "mailto:hello@shoppingplace.example" },
  { label: "Privacy Policy", href: "#footer" },
  { label: "Terms & Conditions", href: "#footer" },
];

export default function SiteFooter() {
  return (
    <footer id="footer" className="bg-[#173c37] text-[#f3f1e9]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <div>
          <a href="#top" className="font-display text-2xl">ShoppingPlace<span className="text-[#e8b77e]">.</span></a>
          <p className="mt-2 text-xs text-[#c8d2c9]">Good finds, all in one place.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#e0e5dc]">
          {footerLinks.map((link) => <a key={link.label} className="transition-colors hover:text-[#e8b77e]" href={link.href}>{link.label}</a>)}
        </nav>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-7xl px-6 py-4 text-[11px] text-[#c8d2c9] md:px-10 lg:px-16">© {new Date().getFullYear()} ShoppingPlace. All rights reserved.</p>
      </div>
    </footer>
  );
}