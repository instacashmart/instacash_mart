import { useMemo } from "react";
import { orderStages, store, useStoreVersion } from "../../lib/store";

function OrderTimelineCard({ type, item, onSelect }) {
  const n = orderStages[type];
  const a = item.status === "Cancelled";
  const r = Math.max(
    0,
    n.findIndex((item2) => item2.status === item.status),
  );
  const o = n[r];
  const l = !a && r === n.length - 1;
  const c = type === "sell" ? [item.model, item.storage].filter(Boolean).join(" • ") : item.product;
  const u = a
    ? "bg-red-50 text-red-700 border-red-200"
    : l
      ? "bg-brand-600 text-white border-brand-600"
      : "bg-brand-50 text-brand-700 border-brand-200";
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className="shrink-0 w-64 sm:w-72 flex flex-col justify-start text-left rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition p-4 bg-white"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <i
            className={`fa-solid ${type === "sell" ? "fa-hand-holding-dollar" : "fa-bag-shopping"}`}
          />
          {type === "sell" ? "Sell pickup" : "Accessory order"}
        </span>
        <span className="font-mono text-[10px] font-bold text-slate-400">{item.id}</span>
      </span>
      <span className="block text-sm font-bold text-slate-900 mt-1.5 truncate">{c}</span>
      <span
        className={`mt-2 self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${u}`}
      >
        <i className={`fa-solid ${a ? "fa-ban" : o.icon} text-[10px]`} />
        {a ? "Cancelled" : o.label}
      </span>
      <span
        className="mt-3 grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${n.length}, minmax(0, 1fr))`,
        }}
      >
        {n.map((item2, index) => (
          <span
            key={item2.status}
            className={`h-1.5 rounded-full ${a ? "bg-red-200" : index <= r ? "bg-brand-500" : "bg-slate-200"}`}
          />
        ))}
      </span>
      {item.note && (
        <span className="block text-[11px] text-slate-600 mt-2.5 line-clamp-2">
          <i className="fa-solid fa-circle-info text-brand-600 mr-1" />
          {item.note}
        </span>
      )}
      <span className="block text-[11px] font-bold text-brand-700 mt-2.5">
        {"View tracking "}
        <i className="fa-solid fa-arrow-right text-[10px]" />
      </span>
    </button>
  );
}

export function MyOrders({ onSelect, className = "mt-6 p-5 sm:p-6" }) {
  const s = useStoreVersion();
  const n = useMemo(
    () =>
      [
        ...store.list("sell").map((item) => ({
          type: "sell",
          item,
        })),
        ...store.list("buy").map((item) => ({
          type: "buy",
          item,
        })),
      ].sort((a, r) => String(r.item.createdAt).localeCompare(String(a.item.createdAt))),
    [s],
  );
  if (n.length) {
    return (
      <section
        id="my-orders"
        className={`reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto rounded-2xl border border-slate-200 bg-white ${className}`}
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              My Orders
            </h2>
            <p className="text-xs text-slate-500">
              Live status of your pickups and accessory orders
            </p>
          </div>
          <span className="shrink-0 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {n.length} {n.length === 1 ? "order" : "orders"}
          </span>
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto custom-scrollbar pb-2">
          {n.map(({ type, item }) => (
            <OrderTimelineCard key={item.id} type={type} item={item} onSelect={onSelect} />
          ))}
        </div>
      </section>
    );
  } else {
    return null;
  }
}
