import { Link } from "react-router-dom";
import { BackToHome } from "../components/ui/BackToHome";
import { BrandLogo } from "../components/ui/BrandLogo";
import { sellBrandCatalog, sellCategoryPath } from "../data/sellBrands";
import { sellCategories } from "../data/sellCatalog";
import { useSellModels } from "../data/sellModels";

const BRAND_PREVIEW_COUNT = 4;

export function BrandsPage() {
  useSellModels();
  return (
    <main>
      <BackToHome />
      <section
        id="all-brands"
        className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white py-8 lg:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Sell Top Brands at Guaranteed Best Prices
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose your device to see every brand we buy
            </p>
          </div>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {sellCategories.map((sellCategory) => {
              const e = sellBrandCatalog[sellCategory.key]?.brands || [];
              return (
                <Link
                  key={sellCategory.key}
                  to={sellCategoryPath(sellCategory.key)}
                  className="group flex flex-col p-5 rounded-2xl border border-slate-200 bg-white hover:border-brand-500 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center">
                      {sellCategory.image ? (
                        <img
                          src={sellCategory.image}
                          alt=""
                          className="w-16 h-16 object-contain group-hover:scale-110 transition"
                        />
                      ) : (
                        <i className={`fa-solid ${sellCategory.icon} text-3xl text-slate-700`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-extrabold text-slate-900 group-hover:text-brand-700 transition">
                        {sellCategory.label}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {e.length}
                        {" brands"}
                      </p>
                    </div>
                  </div>
                  <div
                    className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2"
                    aria-hidden="true"
                  >
                    {e.slice(0, BRAND_PREVIEW_COUNT).map((item) => (
                      <span
                        key={item.key}
                        className="flex-1 min-w-0 h-9 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-center px-1.5 overflow-hidden [&_img]:max-h-5 [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&>span]:!text-[10px]"
                      >
                        <BrandLogo brand={item} />
                      </span>
                    ))}
                    {e.length > BRAND_PREVIEW_COUNT && (
                      <span className="shrink-0 text-[11px] font-bold text-slate-500 px-1">
                        {"+"}
                        {e.length - BRAND_PREVIEW_COUNT}
                      </span>
                    )}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700">
                    {"View all "}
                    {e.length}
                    {" brands"}{" "}
                    <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
