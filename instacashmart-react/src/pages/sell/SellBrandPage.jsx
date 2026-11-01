import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CustomModelForm } from "../../components/sell/CustomModelForm";
import { ModelGrid } from "../../components/sell/ModelGrid";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import {
  OTHER,
  getSellConfig,
  modelsFor,
  modelsInSeries,
  resolveSellBrand,
  sellBrandUrl,
  sellModelUrl,
  sellSeriesUrl,
  seriesSlug,
  sortByGeneration,
} from "../../data/sellBrands";
import { deviceImage, useSellModels } from "../../data/sellModels";

const stripBrand = (t, e) =>
  t.toLowerCase().startsWith(`${e.toLowerCase()} `) ? t.slice(e.length + 1) : t;

const seriesToken = (t) => {
  const e = t.replace(/[()]/g, "");
  return e.match(/^\d+/)?.[0] || e.match(/^[a-z-]+(?=\d)/i)?.[0] || e;
};

export function seriesLabels(t, e) {
  if (!t.length) {
    return [];
  }
  const s = t.map((item) => stripBrand(item, e).split(/\s+/));
  let n = 0;
  while (
    s.every((item) => item.length > n + 1 && item[n].toLowerCase() === s[0][n].toLowerCase())
  ) {
    n++;
  }
  const a = s[0].slice(0, n).join(" ");
  return s.map((item) => {
    const o = [a, seriesToken(item[n])].filter(Boolean).join(" ");
    if (/series$/i.test(o)) {
      return o;
    } else {
      return `${o} Series`;
    }
  });
}

export function SellBrandPage({ category }) {
  const e = getSellConfig(category);
  const { brand = "" } = useParams();
  const [n] = useSearchParams();
  const a = resolveSellBrand(category, brand, n);
  const r = useSellModels();
  const brand2 = a
    ? {
        ...a,
        series: [
          ...new Set([
            ...(a.series || []),
            ...r
              .filter((item) => {
                return item.category === category && item.brand === a.key && item.series?.trim();
              })
              .map((item) => item.series.trim()),
          ]),
        ],
      }
    : null;
  const [initialModel, setInitialModel] = useState("");
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (brand2) {
      document.title = `Sell Old ${brand2.name} ${e.noun[0].toUpperCase() + e.noun.slice(1)} | InstaCashMart`;
    }
    setInitialModel("");
    setFlag(false);
  }, [brand2?.key, brand2?.name, e]);
  if (!brand2) {
    return (
      <main>
        <BackToHome />
        <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-extrabold text-slate-900">Brand not found</p>
          <p className="text-sm text-slate-500 mt-1">
            {"Pick your "}
            {e.noun}
            {e.noun.endsWith("s") ? "'" : "'s"}
            {" brand from the full list."}
          </p>
          <Link
            to={e.path}
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            {"All "}
            {e.noun}
            {" brands"}
          </Link>
        </section>
      </main>
    );
  }
  const p = e.noun[0].toUpperCase() + e.noun.slice(1);
  const h = !!brand2.series && category !== "phone";
  const _ = n.get("series");
  const f = h && _ ? modelsInSeries(category, brand2, _) : null;
  const S = h && !f;
  const y = `Other ${brand2.name} ${p}s`;
  const b = f && (_ === OTHER ? y : brand2.series.find((sery) => seriesSlug(sery) === _));
  const B = f || modelsFor(category, brand2.key);
  const E = category === "phone" ? sortByGeneration(B) : B;
  return (
    <main>
      <BackToHome />
      <section
        className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
        aria-label={`${brand2.name} models`}
      >
        <Breadcrumbs
          items={
            h
              ? [
                  ["Device", "/#gadgets"],
                  ["Brand", e.path],
                  ["Series", S ? "" : sellBrandUrl(category, brand2)],
                  ...(S ? [] : [["Model"]]),
                ]
              : [["Device", "/#gadgets"], ["Brand", e.path], ["Model"]]
          }
        />
        <div className="flex items-center gap-4 mt-5">
          <span className="hidden sm:flex w-24 h-16 shrink-0 rounded-xl border border-slate-200 bg-white items-center justify-center p-2">
            <BrandLogo brand={brand2} />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {b
                ? _ === OTHER
                  ? `Sell ${b} Online At Best Price`
                  : `Sell Old ${brand2.name} ${b.replace(/\s*\(.*\)$/, "")} Online At Best Price`
                : `Sell Old ${brand2.name} ${p} Online At Best Price`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {E.length ? `${E.length} models • ` : "Choose Others and type your model • "}
              {"Free doorstep pickup & instant payment"}
            </p>
          </div>
        </div>
        {S ? (
          <>
            <h2 className="mt-7 text-lg sm:text-xl font-bold text-slate-900">Select Series</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {"Pick the series your "}
              {brand2.name} {e.noun}
              {" belongs to."}
            </p>
            <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-4">
              {[...brand2.series.map((sery) => [sery, seriesSlug(sery)]), [y, OTHER]].map(
                ([R, D]) => {
                  const O = modelsInSeries(category, brand2, D) || [];
                  const C = O[0];
                  return (
                    <Link
                      key={D}
                      to={sellSeriesUrl(category, brand2, D)}
                      className="group min-w-0 flex flex-col items-center text-center p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-500 hover:shadow-sm transition"
                    >
                      <span className="flex items-center justify-center w-full h-24 sm:h-28 rounded-lg bg-slate-50">
                        {C ? (
                          <img
                            src={deviceImage(category, C.name, brand2.key)}
                            alt=""
                            loading="lazy"
                            className="max-h-full max-w-full object-contain p-1.5 transition group-hover:scale-105"
                          />
                        ) : (
                          <i className="fa-solid fa-mobile-screen-button text-3xl text-slate-300" />
                        )}
                      </span>
                      <span className="mt-2 min-w-0 max-w-full text-[13px] sm:text-sm font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">
                        {R.replace(/\//g, "/​")}
                      </span>
                      <span className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
                        {O.length
                          ? `${O.length} ${O.length === 1 ? "model" : "models"}`
                          : "Type your model"}
                      </span>
                    </Link>
                  );
                },
              )}
            </div>
          </>
        ) : (
          <div className="mt-6">
            <ModelGrid
              key={`${brand2.key}-${_ || ""}`}
              brand={brand2.name}
              models={E.map((item) => ({
                name: item.name,
                image: deviceImage(category, item.name, brand2.key),
                to: sellModelUrl(category, brand2, item.name),
              }))}
              other={{
                onClick: () => setFlag(true),
              }}
              renderEmpty={(R) => (
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    {"No "}
                    {brand2.name}
                    {" model matches “"}
                    {R}
                    {"”."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInitialModel(R);
                      setFlag(true);
                    }}
                    className="mt-3 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white transition"
                  >
                    Add it as another model
                  </button>
                </div>
              )}
            />
          </div>
        )}
        {flag && (
          <CustomModelForm
            key={brand2.key}
            category={category}
            brand={brand2}
            initialModel={initialModel}
            onClose={() => {
              setFlag(false);
              setInitialModel("");
            }}
          />
        )}
        {!flag && (
          <p className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {"Don't see your model?"}{" "}
            <button
              type="button"
              onClick={() => setFlag(true)}
              className="font-bold text-brand-700 hover:text-brand-800"
            >
              {"Type your "}
              {brand2.name}
              {" model"}
            </button>
          </p>
        )}
      </section>
      <section
        className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-label="Other brands"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            {"Other "}
            {e.noun}
            {" brands"}
          </h2>
          <Link to={e.path} className="text-xs font-bold text-brand-700 hover:text-brand-800">
            {"All brands "}
            <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
          {e.brands
            .filter((brand3) => brand3.key !== brand2.key)
            .map((item) => (
              <Link
                key={item.key}
                to={sellBrandUrl(category, item)}
                aria-label={item.name}
                className="shrink-0 w-28 h-16 rounded-xl border border-slate-200 hover:border-brand-500 bg-white flex items-center justify-center px-3 transition"
              >
                <BrandLogo brand={item} />
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
