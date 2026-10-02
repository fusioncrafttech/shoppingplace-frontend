import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group min-w-0">
      <div className={`relative aspect-[4/4.5] overflow-hidden ${product.tone}`}>
        <div
          role="img"
          aria-label={product.imageAlt}
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url('${product.image}')` }}
        />
        <span className="absolute left-3 top-3 bg-[#fbfaf6] px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-[#173c37]">
          {product.label}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <h3 className="text-sm font-medium leading-5 text-[#173c37]">{product.name}</h3>
        <p className="shrink-0 text-sm font-semibold text-[#173c37]">{product.price}</p>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#58655d]">
        <span aria-label={`${product.rating} out of 5 stars`} className="text-[#a36545]">★</span>
        <span>{product.rating}</span>
        <span aria-hidden="true">·</span>
        <span>{product.reviews} reviews</span>
      </div>
      <button
        type="button"
        disabled
        aria-label={`Add ${product.name} to cart (demo only)`}
        title="Cart actions will be available when a backend is connected"
        className="mt-4 min-h-10 w-full border border-[#173c37] px-4 text-xs font-semibold text-[#173c37] transition-colors hover:bg-[#173c37] hover:text-[#fbfaf6] disabled:cursor-not-allowed disabled:opacity-80"
      >
        Add to Cart
      </button>
    </article>
  );
}