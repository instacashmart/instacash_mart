import { VerifiedTick } from "./ProductCard";
import { CloseButton, Modal } from "../ui/Modal";
import { ProductImage } from "../ui/ProductImage";
import { categoryLabel, discountPercent, sellerOf } from "../../data/accessories";
import { formatPrice } from "../../lib/format";

export function CompareModal({ open, items, onClose, onRemove, onBuy }) {
  if (!open) {
    return null;
  }
  const r = Math.min(...items.map((item) => item.price));
  const o = Math.max(...items.map((item) => sellerOf(item).rating));
  const Cell = ({ children }) => (
    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
      {children}
    </span>
  );
  const Cell2 = () => <i className="fa-solid fa-star text-amber-500 text-xs" />;
  const u = [
    [
      "Price",
      (m) => (
        <>
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(m.price)}</span>
          {m.price === r && <Cell>Lowest</Cell>}
        </>
      ),
    ],
    ["MRP", (m) => <span className="text-slate-400 line-through">{formatPrice(m.mrp)}</span>],
    [
      "You save",
      (m) => (
        <span className="font-bold text-brand-700">
          {formatPrice(m.mrp - m.price)}
          {" ("}
          {discountPercent(m)}
          {"%)"}
        </span>
      ),
    ],
    ["Category", (m) => categoryLabel(m.category)],
    ["Condition", (m) => m.grade],
    ["Specs", (m) => m.specs],
    [
      "Product rating",
      (m) => (
        <>
          <Cell2 /> {m.rating}
        </>
      ),
    ],
    [
      "Seller",
      (m) => (
        <>
          {sellerOf(m).name} <VerifiedTick seller={sellerOf(m)} />
        </>
      ),
    ],
    [
      "Seller rating",
      (m) => {
        const p = sellerOf(m);
        return (
          <>
            <Cell2 /> {p.rating}{" "}
            <span className="text-slate-400">
              {"• "}
              {p.sales.toLocaleString("en-IN")}
              {" sales"}
            </span>
            {p.rating === o && <Cell>Top</Cell>}
          </>
        );
      },
    ],
    ["Warranty", (m) => m.warranty],
    ["Replacement", (m) => m.replacement],
  ];
  return (
    <Modal open onClose={onClose} className="max-w-4xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Side by side
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mt-1">
            Compare products
          </h3>
        </div>
        <CloseButton onClick={onClose} label="Close comparison" />
      </div>
      <div className="overflow-x-auto custom-scrollbar mt-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="w-32 min-w-[7rem]" />
              {items.map((item) => (
                <th key={item.id} className="p-3 align-top min-w-[11rem] font-normal">
                  <div className="relative">
                    <ProductImage
                      product={item}
                      boxClass="w-full aspect-[4/3] rounded-xl bg-slate-100"
                      iconClass="text-5xl"
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-slate-700 text-xs shadow-xs"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-extrabold text-slate-900 leading-snug">
                    {item.name}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {u.map(([m, p]) => (
              <tr key={m} className="border-t border-slate-200">
                <th
                  scope="row"
                  className="py-3 pr-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 align-middle"
                >
                  {m}
                </th>
                {items.map((item) => (
                  <td key={item.id} className="p-3 text-slate-800 font-medium">
                    {p(item)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-slate-200">
              <th />
              {items.map((item) => (
                <td key={item.id} className="p-3">
                  <button
                    type="button"
                    onClick={() => onBuy(item)}
                    className="w-full py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition"
                  >
                    Buy Now
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
