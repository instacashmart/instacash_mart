import { useEffect, useState } from "react";
import { fieldClass } from "../../pages/sell/SellPage";

export function ModelSearch({ models, selected, onSelect, onCustom }) {
  const [modelSearch, setModelSearch] = useState(selected?.name || "");
  const [o, l] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => setModelSearch(selected?.name || ""), [selected]);
  const m = modelSearch.trim().toLowerCase();
  const p = models
    .map((model, index) => ({
      m: model,
      i: index,
    }))
    .filter(({ m: m2 }) => m.split(/\s+/).every((item) => m2.name.toLowerCase().includes(item)));
  const h = p.some(({ m: m2 }) => m2.name.toLowerCase() === m);
  const _ = m && !h;
  const f = p.length + (_ ? 1 : 0);
  const S = (b) => {
    if (b < p.length) {
      onSelect(p[b].i);
      setModelSearch(p[b].m.name);
    } else {
      onCustom(modelSearch.trim());
    }
    l(false);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === "ArrowDown" || evt.key === "ArrowUp") {
      evt.preventDefault();
      l(true);
      setCount((B) => (B + (evt.key === "ArrowDown" ? 1 : -1) + f) % Math.max(f, 1));
    } else if (evt.key === "Enter" && o && f) {
      evt.preventDefault();
      S(count);
    } else if (evt.key === "Escape") {
      l(false);
    }
  };
  return (
    <div className="relative">
      <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none" />
      <input
        id="modelSearch"
        type="text"
        role="combobox"
        aria-expanded={o}
        aria-controls="modelSearchList"
        aria-autocomplete="list"
        autoComplete="off"
        value={modelSearch}
        placeholder="Type your model, e.g. iPhone 15 Pro"
        onChange={(evt) => {
          setModelSearch(evt.target.value);
          setCount(0);
          l(true);
        }}
        onFocus={() => l(true)}
        onBlur={() => {
          l(false);
          setModelSearch(selected?.name || "");
        }}
        onKeyDown={handleKeyDown}
        className={`${fieldClass} pl-10 pr-4 py-3 font-semibold`}
      />
      {o && f > 0 && (
        <ul
          id="modelSearchList"
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg py-1"
        >
          {p.map(({ m: m2, i }, index) => (
            <li
              key={m2.name}
              role="option"
              aria-selected={selected?.name === m2.name}
              onMouseDown={(evt) => {
                evt.preventDefault();
                S(index);
              }}
              onMouseEnter={() => setCount(index)}
              className={`px-4 py-2.5 text-sm font-semibold cursor-pointer flex items-center justify-between ${index === count ? "bg-brand-50 text-brand-700" : "text-slate-700"}`}
            >
              <span>{m2.name}</span>
              {selected?.name === m2.name && (
                <i className="fa-solid fa-check text-xs text-brand-600" />
              )}
            </li>
          ))}
          {_ && (
            <li
              role="option"
              aria-selected={false}
              onMouseDown={(evt) => {
                evt.preventDefault();
                S(p.length);
              }}
              onMouseEnter={() => setCount(p.length)}
              className={`px-4 py-2.5 text-sm cursor-pointer border-t border-slate-100 ${count === p.length ? "bg-brand-50 text-brand-700" : "text-slate-600"}`}
            >
              <i className="fa-solid fa-pen-to-square mr-2 text-xs" />
              {p.length ? "Not listed? Use" : "No match. Use"}{" "}
              <span className="font-bold">
                {'"'}
                {modelSearch.trim()}
                {'"'}
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
