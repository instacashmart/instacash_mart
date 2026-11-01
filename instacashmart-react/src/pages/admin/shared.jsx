import { useState } from "react";
import { formatDateTime, formatDateTimeYear, orderSummary } from "../../lib/format";
import { orderStages, store } from "../../lib/store";

function OrderStatusBadge({ type, item }) {
  if (item.status === "Cancelled") {
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
        Cancelled
      </span>
    );
  }
  const s = orderStages[type];
  const n = s.find((item2) => item2.status === item.status) || s[0];
  const a = n === s[s.length - 1];
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${a ? "bg-brand-600 text-white border-brand-600" : "bg-brand-50 text-brand-700 border-brand-200"}`}
    >
      {n.label}
    </span>
  );
}

export function OrderCard({ type, item, rows, showToast }) {
  const handleSetStatus = (o) => {
    store.setStatus(type, item.id, o);
    const l = orderStages[type].find((item2) => item2.status === o);
    showToast(`${item.id}: ${l ? l.label : o}`);
  };
  const handleClick = () => {
    if (window.confirm(`Delete ${item.id}? This cannot be undone.`)) {
      store.remove(type, item.id);
      showToast(`${item.id} deleted`);
    }
  };
  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-mono font-bold text-brand-700">{item.id}</p>
          <h3 className="text-sm font-bold text-slate-900 break-words">
            {orderSummary(type, item)}
          </h3>
          <p className="text-[11px] text-slate-400">{formatDateTimeYear(item.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge type={type} item={item} />
          <button
            type="button"
            onClick={handleClick}
            aria-label="Delete"
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300 transition"
          >
            <i className="fa-solid fa-trash-can text-xs" />
          </button>
        </div>
      </div>
      <OrderTracker type={type} item={item} onSetStatus={handleSetStatus} showToast={showToast} />
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
        {rows
          .filter(([, o]) => o)
          .map(([o, l]) => (
            <div key={o} className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-500">{o}</span>
              <span className="text-right font-semibold text-slate-900 break-words">{l}</span>
            </div>
          ))}
      </div>
    </article>
  );
}

function OrderTracker({ type, item, onSetStatus, showToast }) {
  const a = orderStages[type];
  const disabled = item.status === "Cancelled";
  const o = Math.max(
    0,
    a.findIndex((item2) => item2.status === item.status),
  );
  const l = {
    New: item.createdAt,
    ...(item.history || {}),
  };
  const [state, setState] = useState(item.note || "");
  const handleClick = () => {
    const h = a.filter((item2) => l[item2.status] || item2.status === "New");
    onSetStatus(h[h.length - 1].status);
  };
  const handleClick2 = () => {
    store.update(type, item.id, {
      note: state.trim(),
      noteAt: new Date().toISOString(),
    });
    showToast(`Update saved for ${item.id}`);
  };
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Order tracker
        </span>
        {disabled ? (
          <button
            type="button"
            onClick={handleClick}
            className="text-[11px] font-bold text-brand-700 hover:text-brand-800"
          >
            Reopen order
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSetStatus("Cancelled")}
            className="text-[11px] font-bold text-red-600 hover:text-red-700"
          >
            Cancel order
          </button>
        )}
      </div>
      <ol className="grid grid-cols-4 gap-1">
        {a.map((item2, index) => {
          const f = !disabled && index <= o;
          return (
            <li key={item2.status} className="relative">
              {index > 0 && (
                <span
                  className={`absolute top-4 right-1/2 w-full h-0.5 ${f ? "bg-brand-500" : "bg-slate-200"}`}
                />
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSetStatus(item2.status)}
                title={`Mark as ${item2.label}`}
                className={`relative w-full flex flex-col items-center gap-1 text-center group ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition ${f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"} ${!disabled && index === o ? "ring-4 ring-brand-100" : ""}`}
                >
                  <i className={`fa-solid ${item2.icon}`} />
                </span>
                <span
                  className={`text-[11px] font-bold leading-tight ${f ? "text-slate-900" : "text-slate-400"}`}
                >
                  {item2.label}
                </span>
                <span className="text-[10px] text-slate-400 min-h-[14px]">
                  {f && l[item2.status] ? formatDateTime(l[item2.status]) : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {disabled && (
        <p className="mt-2 text-[11px] font-semibold text-red-700 bg-red-50 rounded-lg px-3 py-2">
          {"Cancelled "}
          {formatDateTime(l.Cancelled)}
        </p>
      )}
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          value={state}
          onChange={(evt) => setState(evt.target.value)}
          aria-label="Update for customer"
          placeholder={
            type === "sell"
              ? "Update for customer, e.g. Technician Rohan (98765 43210) arriving 4–5 PM"
              : "Update for customer, e.g. Shipped via Delhivery, AWB 1234567890"
          }
          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={handleClick2}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
        >
          Save update
        </button>
      </div>
    </div>
  );
}

export const EmptyNote = ({ children }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 py-10 px-6 text-center text-sm text-slate-500">
    {children}
  </div>
);

export const RatingStars = ({ value }) => (
  <span className="text-amber-400 text-xs whitespace-nowrap" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((item) => (
      <i key={item} className={`fa-solid fa-star ${item <= value ? "" : "text-slate-200"}`} />
    ))}
  </span>
);

export const adminInputClass =
  "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";

export const phoneLink = (t) =>
  t && (
    <a href={`tel:+91${t}`} className="text-brand-700 hover:underline">
      {"+91 "}
      {t}
    </a>
  );
