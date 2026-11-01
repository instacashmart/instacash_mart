import { useProductReviews } from "../reviews/ProductReviews";
import { ProductImage } from "../ui/ProductImage";
import { discountPercent, sellerOf } from "../../data/accessories";
import { formatPrice } from "../../lib/format";

const gradeClasses = {
  New: "bg-slate-900",
  Superb: "bg-brand-500",
  Good: "bg-slate-400",
  Fair: "bg-amber-500",
};

export const VerifiedTick = ({ seller }) =>
  seller.verified ? (
    <i className="fa-solid fa-circle-check text-brand-600" title="Verified seller" />
  ) : null;

export function ProductCard({ product, inCompare, onBuy, onCompare, onReviews }) {
  const seller = sellerOf(product);
  const { count } = useProductReviews(product);
  return (
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition duration-300 flex flex-col overflow-hidden">
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        <ProductImage
          product={product}
          boxClass="w-full h-full group-hover:scale-105 transition duration-500"
          iconClass="text-5xl sm:text-6xl"
        />
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-900 shadow-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full ${gradeClasses[product.grade] || "bg-slate-400"}`}
          />
          {product.grade}
        </span>
        <span className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">
          {discountPercent(product)}
          {"% off"}
        </span>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {product.brand}
        </p>
        <h3 className="mt-0.5 text-sm font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 truncate">{product.specs}</p>
        <p className="mt-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-brand-700 px-1.5 py-0.5 rounded">
            {product.rating} <i className="fa-solid fa-star text-[9px]" />
          </span>
          <button
            type="button"
            onClick={onReviews}
            className="text-[11px] font-semibold text-slate-500 hover:text-brand-700 hover:underline"
          >
            {count ? `${count} review${count > 1 ? "s" : ""}` : "No reviews yet"}
          </button>
        </p>
        <div className="mt-2.5 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-slate-400 line-through">{formatPrice(product.mrp)}</span>
        </div>
        <p className="text-xs font-bold text-brand-700">
          {"You save "}
          {formatPrice(product.mrp - product.price)}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 mb-3">
          <p className="truncate">
            {"Sold by"} <span className="font-bold text-slate-900">{seller.name}</span>{" "}
            <VerifiedTick seller={seller} />
          </p>
          <p className="mt-0.5">
            <i className="fa-solid fa-star text-amber-500" />{" "}
            <span className="font-bold text-slate-900">{seller.rating}</span> {"seller • "}
            {seller.sales.toLocaleString("en-IN")}
            {" sales"}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onBuy}
            className="flex-1 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition"
          >
            Buy Now
          </button>
          <button
            type="button"
            onClick={onCompare}
            aria-pressed={inCompare}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            title={inCompare ? "Remove from compare" : "Compare"}
            className={`w-10 h-10 shrink-0 rounded-full border text-sm transition ${inCompare ? "bg-slate-900 border-slate-900 text-white" : "border-slate-300 text-slate-900 hover:border-slate-900"}`}
          >
            <i className={`fa-solid ${inCompare ? "fa-check" : "fa-code-compare"}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
