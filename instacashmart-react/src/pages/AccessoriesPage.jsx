import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReviewsPanel } from "../components/reviews/ProductReviews";
import { CompareModal } from "../components/store/CompareModal";
import { ProductCard } from "../components/store/ProductCard";
import { TrendingDevices } from "../components/store/TrendingDevices";
import { BackToHome } from "../components/ui/BackToHome";
import { ProductImage } from "../components/ui/ProductImage";
import { useApp } from "../context/AppContext";
import {
  accessoryCategories,
  categoryLabel,
  matchesSearch,
  productCategories,
  searchTokens,
} from "../data/accessories";
import { searchModels } from "../data/sellCatalog";

const COMPARE_LIMIT = 3;

export function AccessoriesPage() {
  const { catalog, market, setMarket, setMarketCategory, setMarketQuery, openBuy, showToast } =
    useApp();
  const [l] = useSearchParams();
  const [items, setItems] = useState([]);
  const [flag, setFlag] = useState(false);
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const C = l.get("cat");
    setMarket({
      category:
        C && accessoryCategories.some((accessoryCategory) => accessoryCategory.key === C)
          ? C
          : "all",
      query: l.get("q") || "",
    });
  }, [l, setMarket]);
  const f = market.query.trim();
  const S = f.length > 0 && searchModels(f).length > 0;
  const y = useMemo(() => {
    const C = searchTokens(market.query);
    return catalog.filter(
      (item) =>
        (market.category === "all" || item.category === market.category) && matchesSearch(item, C),
    );
  }, [catalog, market]);
  const b = S
    ? catalog.filter((item) => market.category === "all" || item.category === market.category)
    : y;
  const B = (C) => catalog.filter((item) => item.category === C).length;
  const E = (C) => catalog.find((item) => item.id === C);
  const items2 = items.map(E).filter(Boolean);
  const D = (C) => {
    if (items.includes(C)) {
      setItems((v) => v.filter((item) => item !== C));
    } else if (items.length >= COMPARE_LIMIT) {
      showToast(`You can compare up to ${COMPARE_LIMIT} products at a time.`);
    } else {
      setItems((v) => [...v, C]);
    }
  };
  const handleRemove = (C) => {
    const v = items.filter((item) => item !== C);
    setItems(v);
    if (v.length < 2) {
      setFlag(false);
    }
  };
  return (
    <main>
      <BackToHome />
      <TrendingDevices query={S ? "" : market.query} />
      <section
        id="buy-phones"
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white py-8 lg:py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              {market.category === "all" ? "Buy Accessories" : categoryLabel(market.category)}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Chargers, cables, cases, earbuds and more from rated sellers
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-slate-200">
            {productCategories.map((productCategory) => {
              const v = market.category === productCategory.key;
              return (
                <button
                  key={productCategory.key}
                  type="button"
                  onClick={() => setMarketCategory(productCategory.key)}
                  aria-pressed={v}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition ${v ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-slate-900"}`}
                >
                  <i className={`fa-solid ${productCategory.icon} text-xs`} />
                  {productCategory.label}
                  <span className={`font-semibold ${v ? "text-slate-300" : "text-slate-400"}`}>
                    {B(productCategory.key)}
                  </span>
                </button>
              );
            })}
          </div>
          {market.category === "all" && !f ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-12 px-6 text-center">
              <i className="fa-solid fa-hand-pointer text-2xl text-slate-400" />
              <p className="text-base font-extrabold text-slate-900 mt-3">Pick a category above</p>
              <p className="text-sm text-slate-500 mt-1">
                Choose Chargers, Cables, Cases or any other tab to see products.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 text-sm">
                <p className="text-slate-500" aria-live="polite">
                  {S
                    ? `Browse ${b.length} accessories while viewing trending devices`
                    : `${y.length} ${y.length === 1 ? "result" : "results"}${f ? ` for “${f}”` : ""}`}
                </p>
                {f && (
                  <button
                    type="button"
                    onClick={() => setMarketQuery("")}
                    className="text-xs font-bold text-brand-700 hover:text-brand-800"
                  >
                    <i className="fa-solid fa-xmark" />
                    {" Clear search"}
                  </button>
                )}
              </div>
              {b.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 py-16 px-6 text-center">
                  <p className="text-lg font-extrabold text-slate-900">No products match</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Try a different search, another category or fewer filters.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setMarket({
                        category: "all",
                        query: "",
                      })
                    }
                    className="mt-5 px-5 py-2.5 rounded-full border border-slate-900 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition"
                  >
                    Show all products
                  </button>
                </div>
              ) : (
                <div className="reveal-group grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                  {b.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      inCompare={items.includes(item.id)}
                      onBuy={() => openBuy(item)}
                      onCompare={() => D(item.id)}
                      onReviews={() => setProduct(item)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {items2.length > 0 && (
        <div className="fixed bottom-20 xl:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {items2.map((item) => (
              <ProductImage
                key={item.id}
                product={item}
                boxClass="w-9 h-9 rounded-lg border border-slate-700"
                iconClass="text-sm"
              />
            ))}
          </div>
          <p className="flex-1 min-w-0 text-xs sm:text-sm font-semibold truncate">
            {items2.length < 2
              ? "Add one more product to compare"
              : `${items2.length} products selected`}
          </p>
          <button
            type="button"
            onClick={() => {
              setItems([]);
              setFlag(false);
            }}
            className="text-xs font-bold text-slate-300 hover:text-white px-2 py-2 transition"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={items2.length < 2}
            onClick={() => setFlag(true)}
            className="shrink-0 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full transition"
          >
            Compare
          </button>
        </div>
      )}
      <CompareModal
        open={flag && items2.length >= 2}
        items={items2}
        onClose={() => setFlag(false)}
        onRemove={handleRemove}
        onBuy={(C) => {
          setFlag(false);
          openBuy(C);
        }}
      />
      {product && <ReviewsPanel product={product} onClose={() => setProduct(null)} />}
    </main>
  );
}
