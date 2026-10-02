import ProductCard from "@/components/ui/ProductCard";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

const categories = [
  { name: "Electronics", detail: "Smart picks for every day", icon: "◉", tone: "bg-[#dce9e7]" },
  { name: "Fashion", detail: "Pieces with a point of view", icon: "✳", tone: "bg-[#f0e1d7]" },
  { name: "Home & Living", detail: "Make room for good things", icon: "⌂", tone: "bg-[#e9e7d8]" },
  { name: "Beauty", detail: "A little ritual, a lot of joy", icon: "✿", tone: "bg-[#f1dfe1]" },
  { name: "Sports", detail: "Find your next gear", icon: "↗", tone: "bg-[#dce5ee]" },
];

const products = [
  {
    name: "Studio Wireless Headphones",
    price: "$129.00",
    rating: "4.9",
    reviews: "128",
    label: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Warm orange over-ear wireless headphones",
    tone: "bg-[#eee9e1]",
  },
  {
    name: "Everyday Leather Tote",
    price: "$88.00",
    rating: "4.8",
    reviews: "86",
    label: "JUST IN",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Minimal leather tote bag",
    tone: "bg-[#ece5dc]",
  },
  {
    name: "Form Ceramic Table Lamp",
    price: "$74.00",
    rating: "4.7",
    reviews: "64",
    label: "DESIGN PICK",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Sculptural table lamp in a softly lit room",
    tone: "bg-[#e7e7df]",
  },
  {
    name: "Daily Ritual Skincare Set",
    price: "$56.00",
    rating: "5.0",
    reviews: "42",
    label: "CUSTOMER FAVE",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Clean skincare bottles on a neutral surface",
    tone: "bg-[#e6e5dd]",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-[#173c37] text-[#fffdf8]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_45%,rgba(232,170,111,0.28),transparent_34%),linear-gradient(115deg,#173c37_0%,#204c43_62%,#85674f_100%)]" />
          <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-10 px-6 py-20 md:min-h-[600px] md:grid-cols-[1.05fr_0.95fr] md:px-10 lg:px-16">
            <div className="max-w-xl py-4">
              <p className="mb-6 text-xs font-semibold tracking-[0.18em] text-[#e8b77e]">A BETTER KIND OF EVERYDAY</p>
              <h1 className="font-display text-6xl leading-[0.98] sm:text-7xl lg:text-8xl">Shopping<br />Place<span className="text-[#e8b77e]">.</span></h1>
              <p className="mt-7 max-w-md text-2xl leading-tight text-[#f3e8d8]">Everything you need, all in one place.</p>
              <p className="mt-4 max-w-md text-base leading-7 text-[#d2ddd4]">Discover products from different categories and shop with ease.</p>
              <a className="mt-9 inline-flex min-h-12 items-center gap-5 bg-[#e8b77e] px-6 text-sm font-semibold text-[#173c37] transition-colors hover:bg-[#f3cc9e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="#featured">Explore Products <span aria-hidden="true">↗</span></a>
            </div>
            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute -inset-5 rotate-3 border border-white/20" />
              <div role="img" aria-label="Curated home objects and everyday essentials" className="aspect-[5/4] bg-cover bg-center shadow-2xl" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=90')" }} />
              <div className="absolute -bottom-5 -left-5 bg-[#f3e8d8] px-5 py-4 text-[#173c37] sm:px-7">
                <p className="text-[10px] font-semibold tracking-[0.16em]">GOOD FINDS, GOOD FEELING</p>
                <p className="mt-1 font-display text-2xl">Make it yours.</p>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-1/3 bg-[#e8b77e]" />
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16 lg:py-24">
          <div className="mb-9 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#a36545]">BROWSE YOUR WAY</p>
              <h2 className="mt-3 font-display text-4xl text-[#173c37] sm:text-5xl">Find your corner.</h2>
            </div>
            <a className="hidden border-b border-[#173c37] pb-1 text-sm font-medium text-[#173c37] hover:text-[#a36545] sm:block" href="#featured">Shop all categories <span aria-hidden="true">↗</span></a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <a key={category.name} href="#featured" className={`group min-h-40 p-5 transition-transform hover:-translate-y-1 sm:min-h-48 sm:p-6 ${category.tone}`}>
                <span aria-hidden="true" className="font-display text-3xl text-[#a36545]">{category.icon}</span>
                <p className="mt-7 text-sm font-semibold text-[#173c37]">{category.name}</p>
                <p className="mt-1 text-xs leading-5 text-[#58655d]">{category.detail}</p>
                <span className="mt-3 inline-block text-sm text-[#a36545] transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section id="featured" className="border-y border-[#d8d8cc] bg-[#f3f1e9]">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16 lg:py-24">
            <div className="mb-9 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[#a36545]">A FEW GOOD THINGS</p>
                <h2 className="mt-3 font-display text-4xl text-[#173c37] sm:text-5xl">Picked for you.</h2>
              </div>
              <a className="hidden border-b border-[#173c37] pb-1 text-sm font-medium text-[#173c37] hover:text-[#a36545] sm:block" href="#featured">View all products <span aria-hidden="true">↗</span></a>
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => <ProductCard key={product.name} product={product} />)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}