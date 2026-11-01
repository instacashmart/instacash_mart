import { useEffect, useState } from "react";
import { formatDate, formatDateTime, formatPrice, orderSummary } from "../../lib/format";
import { orderStages, store } from "../../lib/store";

export function TrackResult({ query }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (!query) {
      setResult(null);
      setError("");
      setLoading(false);
      return () => {
        active = false;
      };
    }
    setLoading(true);
    setError("");
    store
      .findOrder(query)
      .then((order) => {
        if (active) {
          setResult(order);
        }
      })
      .catch((lookupError) => {
        if (active) {
          setError(lookupError.message || "Unable to look up this order.");
          setResult(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [query]);
  if (!query) {
    return null;
  }
  if (loading) {
    return <p className="py-6 text-center text-slate-500">Looking up your order…</p>;
  }
  if (error) {
    return <p role="alert" className="py-6 text-center text-red-700">{error}</p>;
  }
  const e = result;
  if (!e) {
    return (
      <div className="text-center py-6">
        <p className="font-bold text-slate-900">
          {"No order found for “"}
          {query}
          {"”"}
        </p>
        <p className="text-slate-500 mt-1">
          Check the ID on your confirmation screen and try again.
        </p>
      </div>
    );
  }
  const { type, item } = e;
  const a = orderStages[type];
  const r = item.status === "Cancelled";
  const o = Math.max(
    0,
    a.findIndex((item2) => item2.status === item.status),
  );
  const l = {
    New: item.createdAt,
    ...(item.history || {}),
  };
  const c =
    type === "sell"
      ? item.date
        ? `Pickup on ${formatDate(item.date, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}`
        : "Sell pickup"
      : `${formatPrice(item.price)} • Accessory order`;
  return (
    <>
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
        <p className="font-mono font-bold text-brand-700 text-[11px]">{item.id}</p>
        <p className="font-bold text-slate-900">{orderSummary(type, item)}</p>
        <p className="text-[11px] text-slate-500">{c}</p>
      </div>
      {r && (
        <p className="mb-4 font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {"This order was cancelled"}
          {l.Cancelled ? ` on ${formatDateTime(l.Cancelled)}` : ""}
          {"."}
        </p>
      )}
      <div className="space-y-4">
        {a.map((item2, index) => {
          const p = !r && index <= o;
          return (
            <div key={item2.status} className={`flex items-start gap-3 ${p ? "" : "opacity-60"}`}>
              <div
                className={`w-6 h-6 rounded-full ${p ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-600"} flex items-center justify-center text-[10px] shrink-0 mt-0.5`}
              >
                <i className={`fa-solid ${p && index < o ? "fa-check" : item2.icon}`} />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {item2.label}
                  {p && index === o && (
                    <span className="ml-1 text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-slate-400">
                  {p ? formatDateTime(l[item2.status]) : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {item.note && (
        <div className="mt-4 p-3 rounded-xl bg-brand-50 border border-brand-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
            Latest update
          </p>
          <p className="text-slate-800 mt-0.5">{item.note}</p>
        </div>
      )}
    </>
  );
}
