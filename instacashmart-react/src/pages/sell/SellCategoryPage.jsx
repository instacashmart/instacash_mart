import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CustomModelForm } from "../../components/sell/CustomModelForm";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { getSellConfig, modelsFor, sellBrandUrl } from "../../data/sellBrands";
import { useSellModels } from "../../data/sellModels";

export function SellCategoryPage({ category }) {
  const e = getSellConfig(category);
  const [textValue, setTextValue] = useState("");
  const [a, r] = useState(false);
  const o = useSellModels();
  const l = useMemo(
    () =>
      e.brands.map((brand) => {
        const h = modelsFor(category, brand.key);
        return {
          ...brand,
          count: h.length,
        };
      }),
    [e, category, o],
  );
  const c = l.reduce((total, item) => total + item.count, 0);
  const u = textValue.trim().toLowerCase();
  const m = u
    ? l.filter(
        (item) =>
          item.name.toLowerCase().includes(u) ||
          modelsFor(category, item.key).some((item2) => item2.name.toLowerCase().includes(u)),
      )
    : l;
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500"
        >
          <Link to="/" className="hover:text-brand-700">
            Home
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px] text-slate-400" />
          <span className="text-slate-900">{e.crumb}</span>
        </nav>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mt-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {"Sell your old "}
              {e.noun}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {"Choose your "}
              {e.noun}
              {e.noun.endsWith("s") ? "'" : "'s"}
              {" brand to see the models we buy and their best prices"}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {l.length}
                {" brands"}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {c}
                {" models"}
              </span>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="search"
              value={textValue}
              onChange={(evt) => setTextValue(evt.target.value)}
              placeholder={`Brand or model, ${e.searchHint}`}
              aria-label="Search brand or model"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </section>
      <section
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
        aria-label={`${e.noun} brands`}
      >
        {m.length ? (
          <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {m.map((item) => (
              <Link
                key={item.key}
                to={sellBrandUrl(category, item)}
                className="group flex flex-col items-center text-center p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-500 hover:shadow-md transition"
              >
                <span className="h-14 w-full flex items-center justify-center group-hover:scale-105 transition">
                  <BrandLogo brand={item} />
                </span>
                <span className="mt-3 text-sm font-bold text-slate-900 group-hover:text-brand-700 transition">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {item.count}
                  {" models"}
                </span>
              </Link>
            ))}
            <button
              type="button"
              onClick={() => r(true)}
              aria-expanded={a}
              className={`group flex flex-col items-center justify-center text-center p-4 rounded-2xl border-2 border-dashed transition ${a ? "border-brand-500 bg-brand-50/60" : "border-slate-300 bg-slate-50/60 hover:border-brand-500 hover:bg-brand-50/40"}`}
            >
              <span className="h-14 w-full flex items-center justify-center">
                <span className="w-11 h-11 rounded-full bg-white border border-slate-200 text-brand-600 flex items-center justify-center text-lg group-hover:scale-105 transition">
                  <i className="fa-solid fa-pen-to-square" />
                </span>
              </span>
              <span className="mt-3 text-sm font-bold text-slate-900 group-hover:text-brand-700 transition">
                Others
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">Type your brand</span>
              <span className="mt-2 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                Price on inspection
              </span>
            </button>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-base font-extrabold text-slate-900">
              {"No brand or model matches “"}
              {textValue}
              {"”"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Check the spelling, or type your brand below.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => r(true)}
                className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white transition"
              >
                Type your brand
              </button>
              <button
                type="button"
                onClick={() => setTextValue("")}
                className="px-5 py-2.5 rounded-full border border-slate-900 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                Show all brands
              </button>
            </div>
          </div>
        )}
        {a && (
          <CustomModelForm
            key={category}
            category={category}
            initialBrand={m.length ? "" : textValue.trim()}
            onClose={() => r(false)}
          />
        )}
        {!a && (
          <p className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {"Can't find your brand?"}{" "}
            <button
              type="button"
              onClick={() => r(true)}
              className="font-bold text-brand-700 hover:text-brand-800"
            >
              Type your brand
            </button>
          </p>
        )}
      </section>
    </main>
  );
}
