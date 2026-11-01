import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import {
  OTHER,
  findModelBySlug,
  getSellConfig,
  modelsFor,
  modelsInSeries,
  resolveSellBrand,
  sellBrandUrl,
  sellModelUrl,
  sellSeriesUrl,
  seriesSlug,
} from "../../data/sellBrands";
import { variantOptions } from "../../data/sellCatalog";
import { deviceImage, useSellModels } from "../../data/sellModels";
import { howItWorksSteps } from "../../data/site";

function resolveSellModel(t, e, s, n) {
  if (s !== OTHER) {
    return findModelBySlug(t, e.key, s);
  }
  const typed = (n || "").trim();
  if (!typed) {
    return null;
  }
  const name2 = typed.toLowerCase().startsWith(`${e.name.toLowerCase()} `)
    ? typed
    : `${e.name} ${typed}`;
  return (
    modelsFor(t, e.key).find((item) =>
      [typed, name2].some((item2) => item2.toLowerCase() === item.name.toLowerCase()),
    ) || {
      name: name2,
      typed,
    }
  );
}

export function SellModelPage({ category }) {
  const e = getSellConfig(category);
  const { brand = "", model = "" } = useParams();
  useSellModels();
  const [a] = useSearchParams();
  const brand2 = resolveSellBrand(category, brand, a);
  const o = brand2 && resolveSellModel(category, brand2, model, a.get("model"));
  const l = variantOptions[category] || {};
  const c = [
    ["ram", "RAM"],
    ["storage", "Storage"],
  ].filter(([y]) => l[y]);
  const u = () => Object.fromEntries(c.map(([y]) => [y, l[y].def]));
  const [form, setForm] = useState(u);
  useEffect(() => {
    if (o) {
      document.title = `Sell Old ${o.name} Online at Best Price | InstaCashMart`;
    }
    setForm(u());
  }, [o?.name, category]);
  if (!o) {
    return (
      <main>
        <BackToHome />
        <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-extrabold text-slate-900">Model not found</p>
          <Link
            to={brand2 ? sellBrandUrl(category, brand2) : e.path}
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            {brand2 ? `All ${brand2.name} models` : `All ${e.noun} brands`}
          </Link>
        </section>
      </main>
    );
  }
  const h = `/sell?${new URLSearchParams({
    cat: category,
    ...(o.typed
      ? {
          brand: OTHER,
          otherBrand: brand2.name,
          otherModel: o.typed,
        }
      : {
          brand: brand2.key,
          model: o.name,
        }),
    ...Object.fromEntries(c.map(([y]) => [y, l[y].opts[form[y]]])),
  })}`;
  const _ = modelsFor(category, brand2.key).filter((item) => item.name !== o.name);
  const f = brand2.series?.find((y) => {
    var b;
    if ((b = modelsInSeries(category, brand2, seriesSlug(y))) == null) {
      return undefined;
    } else {
      return b.some((item) => item.name === o.name);
    }
  });
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <Breadcrumbs
          items={
            brand2.series && category !== "phone"
              ? [
                  ["Device", "/#gadgets"],
                  ["Brand", e.path],
                  ["Series", sellBrandUrl(category, brand2)],
                  ["Model", sellSeriesUrl(category, brand2, f ? seriesSlug(f) : OTHER)],
                  [o.name],
                ]
              : [
                  ["Device", "/#gadgets"],
                  ["Brand", e.path],
                  ["Model", sellBrandUrl(category, brand2)],
                  [o.name],
                ]
          }
        />
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 md:gap-10 mt-5">
          <div className="rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-6 h-64 sm:h-80">
            <img
              src={deviceImage(category, o.name, brand2.key)}
              alt={o.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <span className="inline-flex h-8 items-center">
              <BrandLogo brand={brand2} />
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {"Sell Old "}
              {o.name}
            </h1>
            {f && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {f.replace(/\s*\(.*\)$/, "")}
                {" series"}
              </p>
            )}
            {c.length > 0 && (
              <p className="mt-5 text-sm font-bold text-slate-900">Choose your variant</p>
            )}
            {c.map(([y, b]) => (
              <div key={y} className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{b}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {l[y].opts.map((opt, index) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setForm((R) => ({
                          ...R,
                          [y]: index,
                        }))
                      }
                      aria-pressed={index === form[y]}
                      className={`px-4 py-2 rounded-xl border text-sm transition ${index === form[y] ? "border-brand-600 bg-brand-50/40 font-bold text-slate-900" : "border-slate-200 text-slate-700 hover:border-slate-400"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {c.length > 1 && (
              <p className="mt-3 text-xs text-slate-500">
                {"Selected:"}{" "}
                <span className="font-bold text-slate-900">
                  {c.map(([y]) => l[y].opts[form[y]]).join(" / ")}
                </span>
              </p>
            )}
            <p className="mt-4 text-sm text-slate-500">
              Answer a few quick questions about its condition to get your exact price.
            </p>
            <Link
              to={h}
              className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
            >
              {"Get Exact Value "}
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-label="How it works"
      >
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900">How selling works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {howItWorksSteps.map((howItWorksStep, index) => (
            <div
              key={howItWorksStep.title}
              className="flex gap-3 p-4 rounded-xl border border-slate-200"
            >
              <span
                className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${howItWorksStep.iconClass}`}
              >
                <i className={`fa-solid ${howItWorksStep.icon}`} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {index + 1}
                  {". "}
                  {howItWorksStep.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-3">{howItWorksStep.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {_.length > 0 && (
        <section
          className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
          aria-label={`More ${brand2.name} models`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-extrabold text-slate-900">
              {"More "}
              {brand2.name}
              {" models"}
            </h2>
            <Link
              to={sellBrandUrl(category, brand2)}
              className="text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              {"All models "}
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {_.map((item) => (
              <Link
                key={item.name}
                to={sellModelUrl(category, brand2, item.name)}
                className="shrink-0 w-36 flex flex-col items-center text-center p-3 rounded-xl border border-slate-200 hover:border-brand-500 bg-white transition"
              >
                <img
                  src={deviceImage(category, item.name, brand2.key)}
                  alt={item.name}
                  loading="lazy"
                  className="h-20 w-full object-contain"
                />
                <span className="mt-2 text-xs font-semibold text-slate-900 line-clamp-2">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
