import { useState } from "react";
import { Link } from "react-router-dom";
import { seriesLabels } from "../../pages/sell/SellBrandPage";

const modelTileClass =
  "group flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 hover:border-brand-500 hover:bg-brand-50/40 transition";

function OtherModelTile() {
  return (
    <>
      <span className="w-full h-28 sm:h-36 flex items-center justify-center">
        <span className="w-14 h-14 rounded-full bg-white border border-slate-200 text-brand-600 flex items-center justify-center text-xl group-hover:scale-105 transition">
          <i className="fa-solid fa-pen-to-square" />
        </span>
      </span>
      <span className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900 group-hover:text-brand-700 transition">
        Others
      </span>
      <span className="mt-1 text-[11px] text-slate-500">Type your model</span>
    </>
  );
}

export function ModelGrid({ brand, models, renderEmpty, other }) {
  const [textValue, setTextValue] = useState("");
  const [textValue2, setTextValue2] = useState("");
  const c = seriesLabels(
    models.map((model) => model.name),
    brand,
  );
  const u = [...new Set(c)];
  const m = u.length > 1 && u.length < models.length;
  const p = textValue.trim().toLowerCase();
  const h = models.filter(
    (model, index) =>
      (!textValue2 || c[index] === textValue2) && (!p || model.name.toLowerCase().includes(p)),
  );
  return (
    <div>
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-brand-600" />
        <input
          type="search"
          value={textValue}
          onChange={(evt) => setTextValue(evt.target.value)}
          placeholder="Search for model"
          aria-label={`Search ${brand} models`}
          className="w-full pl-11 pr-4 py-3.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>
      {m && (
        <>
          <h2 className="mt-7 text-base sm:text-lg font-bold text-slate-900">Choose by series</h2>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 mt-3">
            {["", ...u].map((item) => {
              const f = item === textValue2;
              return (
                <button
                  key={item || "all"}
                  type="button"
                  onClick={() => setTextValue2(item)}
                  aria-pressed={f}
                  className={`shrink-0 min-w-[96px] px-5 py-3 rounded-xl border text-sm whitespace-nowrap transition ${f ? "border-brand-600 text-slate-900 font-bold bg-brand-50/40" : "border-slate-200 text-slate-700 hover:border-slate-400"}`}
                >
                  {item || "All"}
                </button>
              );
            })}
          </div>
        </>
      )}
      <h2 className="mt-7 text-base sm:text-lg font-bold text-slate-900">Choose Model</h2>
      {h.length || (other && (!renderEmpty || !p)) ? (
        <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-4">
          {h.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-500 hover:shadow-md transition"
            >
              <span className="w-full h-28 sm:h-36 flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className={`w-full h-full group-hover:scale-105 transition ${item.cover ? "object-cover" : "object-contain"}`}
                />
              </span>
              <span className="mt-3 text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-700 transition">
                {item.name}
              </span>
              {item.note && (
                <span className="mt-1 text-[11px] font-bold text-brand-700">{item.note}</span>
              )}
            </Link>
          ))}
          {other &&
            (other.to ? (
              <Link to={other.to} className={modelTileClass}>
                <OtherModelTile />
              </Link>
            ) : (
              <button type="button" onClick={other.onClick} className={modelTileClass}>
                <OtherModelTile />
              </button>
            ))}
        </div>
      ) : (
        renderEmpty?.(textValue.trim())
      )}
    </div>
  );
}
