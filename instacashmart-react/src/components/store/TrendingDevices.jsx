import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { useApp } from "../../context/AppContext";
import { searchTokens } from "../../data/accessories";
import { categoryImages, trendingFilters } from "../../data/site";
import { formatPrice } from "../../lib/format";
import { useStoreList } from "../../lib/store";

export const sectionCardClass =
  "max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-6 rounded-2xl border border-slate-200 bg-white";

function TrendingImage({ image, fallbackImage, name, icon }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image, fallbackImage]);
  const source = !failed && image ? image : !failed && fallbackImage !== image
    ? fallbackImage
    : "";
  if (!source) {
    return <i className={`fa-solid ${icon || "fa-mobile-screen"} text-slate-700 text-4xl`} />;
  }
  return (
    <img
      src={source}
      alt={name}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function TrendingDevices({ query = "" }) {
  const [textValue, setTextValue] = useState("all");
  const { openBuy } = useApp();
  const trendingList = useStoreList("trending");
  const r = useMemo(() => {
    const c = new Set(trendingList.map((item) => item.cat).filter(Boolean));
    return trendingFilters.filter(
      (trendingFilter) => trendingFilter.key === "all" || c.has(trendingFilter.key),
    );
  }, [trendingList]);
  useEffect(() => {
    if (textValue !== "all" && !r.some((item) => item.key === textValue)) {
      setTextValue("all");
    }
  }, [textValue, r]);
  const o = searchTokens(query);
  const l = trendingList.filter((item) => {
    const u = searchTokens(
      `${item.name} ${item.brand} ${item.model || ""} ${item.specs || ""}`,
    ).join(" ");
    return (textValue === "all" || item.cat === textValue) && o.every((item2) => u.includes(item2));
  });
  return (
    <section id="trending-devices" className={`${sectionCardClass} reveal py-8 lg:py-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <SectionHeader
            eyebrow={query ? "Search Results" : "High Demand This Week"}
            title={
              query ? `Devices matching “${query}”` : "Trending Devices With Highest Resale Value"
            }
            className=""
          >
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Get immediate top-dollar buyback quotes for these popular models
            </p>
          </SectionHeader>
          <div className="flex flex-wrap items-center gap-2">
            {r.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTextValue(item.key)}
                aria-pressed={textValue === item.key}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${textValue === item.key ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {l.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
            {query
              ? `No trending devices match “${query}”. Try another device name.`
              : "No trending devices found in this category."}
          </div>
        ) : (
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {l.map((item) => {
              const u = categoryImages[item.cat];
              const image = item.image || u;
              return (
                <div
                  key={item.id || item.name}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-500 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between h-full glow-card"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 truncate max-w-[120px]">
                        {item.brand}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${item.badgeClass || "text-amber-700 bg-amber-50"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="h-28 flex items-center justify-center p-2 mb-3 bg-slate-50/70 rounded-xl overflow-hidden group-hover:bg-brand-50/30 transition-colors">
                      <TrendingImage
                        image={image}
                        fallbackImage={u}
                        name={item.name}
                        icon={item.icon}
                      />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {item.specs || `${item.brand} device`}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Get Up To
                      </span>
                      <span className="text-base font-extrabold text-brand-600">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openBuy({
                          name: item.name,
                          category: item.cat || "phone",
                          price: item.price,
                          specs: item.specs || `${item.brand} device`,
                          grade: "Certified",
                          image,
                          icon: item.icon || "fa-mobile-screen",
                        })
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition shrink-0"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
