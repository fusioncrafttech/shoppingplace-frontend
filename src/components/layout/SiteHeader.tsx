export default function SiteHeader() {
  return (
    <header id="top" className="border-b border-[#e4e2d9] bg-[#fbfaf6]">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-6 md:px-10 lg:px-16">
        <a href="#top" aria-label="ShoppingPlace home" className="flex shrink-0 items-center gap-2.5">
          <span aria-hidden="true" className="grid size-8 place-items-center bg-[#173c37] font-display text-lg text-[#e8b77e]">S</span>
          <span className="font-semibold tracking-normal text-[#173c37]">ShoppingPlace</span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-[#40564e] md:flex">
          <a className="transition-colors hover:text-[#a36545]" href="#top">Home</a>
          <a className="transition-colors hover:text-[#a36545]" href="#featured">Products</a>
          <a className="transition-colors hover:text-[#a36545]" href="#categories">Categories</a>
        </nav>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <a href="#footer" className="text-sm font-medium text-[#40564e] transition-colors hover:text-[#a36545]">Login</a>
          <a href="#featured" aria-label="Cart, empty demo" title="Cart demo" className="inline-flex min-h-10 items-center gap-2 border border-[#c9d0c7] px-3 text-sm font-medium text-[#173c37] transition-colors hover:border-[#173c37]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.7"><path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.9-1.4L21 9H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="grid size-5 place-items-center bg-[#e8b77e] text-[10px] text-[#173c37]">0</span>
          </a>
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="flex justify-center gap-8 border-t border-[#e4e2d9] px-5 py-3 text-xs text-[#40564e] md:hidden">
        <a href="#top">Home</a>
        <a href="#featured">Products</a>
        <a href="#categories">Categories</a>
      </nav>
    </header>
  );
}