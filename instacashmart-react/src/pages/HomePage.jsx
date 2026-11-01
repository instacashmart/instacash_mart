import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { TestimonialCard, useTestimonials } from "../components/reviews/Testimonials";
import { TrendingDevices, sectionCardClass } from "../components/store/TrendingDevices";
import { Accordion } from "../components/ui/Accordion";
import { ProductImage } from "../components/ui/ProductImage";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useApp } from "../context/AppContext";
import { categoryIcon, discountPercent, sellerOf } from "../data/accessories";
import { sellCategoryPath } from "../data/sellBrands";
import { sellCategories } from "../data/sellCatalog";
import { supportPhone, supportPhoneHref, whyUsCards } from "../data/site";
import { vehicleBasePath, vehicleTypes } from "../data/vehicles";
import { formatPrice } from "../lib/format";
import { useStoreList } from "../lib/store";

function HomeReviews() {
  const t = useTestimonials();
  return (
    <section id="reviews" className={`${sectionCardClass} reveal py-8 lg:py-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Seller Reviews" title="Over 42,000+ Happy Sellers in India">
          <div className="flex items-center gap-1 text-amber-500 mt-2">
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star-half-stroke" />
            <span className="text-xs font-bold text-slate-700 ml-1">
              4.9 / 5 Overall Satisfaction
            </span>
          </div>
        </SectionHeader>
        <div className="reveal-group grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.slice(0, 3).map((item) => (
            <TestimonialCard key={item.key} review={item} />
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">
          <Link to="/reviews" className="font-bold text-brand-700 hover:text-brand-800">
            {"See all "}
            {t.length}
            {" reviews"}
          </Link>{" "}
          {"or"}{" "}
          <Link to="/feedback" className="font-bold text-slate-900 hover:text-brand-700">
            share your experience
          </Link>
        </p>
      </div>
    </section>
  );
}

function PopularAccessories() {
  const { openBuy, goToStore } = useApp();
  const popularList = useStoreList("popular");
  const n = useMemo(
    () =>
      popularList.map((item) => ({
        ...item,
        price: Number(item.price),
        mrp: Number(item.mrp) || Number(item.price),
        icon: item.icon || categoryIcon(item.category),
        grade: item.grade || "New",
      })),
    [popularList],
  );
  if (n.length) {
    return (
      <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-6" aria-label="Popular accessories">
        <div className="reveal bg-white rounded-2xl border border-slate-200 p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Popular accessories
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Top-rated chargers, cases, earbuds and more
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                goToStore({
                  category: "all",
                })
              }
              className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-200 bg-brand-50 hover:bg-brand-100 text-xs font-bold text-brand-700 transition"
            >
              {"Shop all accessories"} <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>
          <div className="reveal-group flex gap-3 sm:gap-4 overflow-x-auto custom-scrollbar pb-2">
            {n.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openBuy(item)}
                className="group shrink-0 w-40 sm:w-48 text-left rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition overflow-hidden bg-white"
              >
                <span className="relative block aspect-square bg-slate-100 overflow-hidden">
                  <ProductImage
                    product={item}
                    boxClass="w-full h-full group-hover:scale-105 transition duration-500"
                    iconClass="text-5xl"
                  />
                  {discountPercent(item) > 0 && (
                    <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white">
                      {discountPercent(item)}
                      {"% off"}
                    </span>
                  )}
                </span>
                <span className="block p-3">
                  <span className="block text-xs font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2rem]">
                    {item.name}
                  </span>
                  <span className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-slate-900">
                      {formatPrice(item.price)}
                    </span>
                    {item.mrp > item.price && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatPrice(item.mrp)}
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                    {"by "}
                    {sellerOf(item).name}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  } else {
    return null;
  }
}

function SellSection() {
  return (
    <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-6" aria-label="Sell your item">
      <div id="gadgets" className="reveal bg-white rounded-2xl p-5 sm:p-8 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-2">
              <span>Sell Your Item</span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Instant estimate
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pick any device below to calculate its maximum buyback price
            </p>
          </div>
          <Link
            to="/brands"
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-200 bg-brand-50 hover:bg-brand-100 text-xs font-bold text-brand-700 transition"
          >
            <span>View All Brands</span>
            <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        </div>
        <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 sm:gap-4">
          {sellCategories.map((sellCategory, index) => (
            <Link
              key={sellCategory.key}
              to={sellCategoryPath(sellCategory.key)}
              className={`group p-4 rounded-2xl text-center hover:border-brand-500 hover:shadow-md transition flex flex-col items-center ${index === 0 ? "border-2 border-brand-500 bg-brand-50/40" : "border border-slate-200 bg-slate-50/60 hover:bg-brand-50/30"} ${sellCategory.key === "camera" ? "col-span-2 sm:col-span-1" : ""}`}
            >
              {sellCategory.image ? (
                <img
                  src={sellCategory.image}
                  alt={`Sell your ${sellCategory.short.toLowerCase()}`}
                  className="w-20 h-20 object-contain group-hover:scale-110 transition mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white shadow-2xs border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:text-brand-600 group-hover:scale-110 transition mb-3">
                  <i className={`fa-solid ${sellCategory.icon} text-3xl`} />
                </div>
              )}
              <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition">
                {sellCategory.tile}
              </span>
            </Link>
          ))}
          {vehicleTypes.map((vehicleType) => (
            <Link
              key={vehicleType.key}
              to={vehicleBasePath(vehicleType.key)}
              className="group p-4 rounded-2xl text-center border border-slate-200 bg-slate-50/60 hover:bg-brand-50/30 hover:border-brand-500 hover:shadow-md transition flex flex-col items-center"
            >
              <img
                src={vehicleType.tileImage || vehicleType.image}
                alt={`Buy or sell ${vehicleType.tile.toLowerCase()}`}
                className="w-20 h-20 object-contain group-hover:scale-110 transition mb-3"
              />
              <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-600 transition">
                {vehicleType.tile}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why-us" className={`${sectionCardClass} reveal py-8 lg:py-10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Trust & Excellence" title="Why Sellers Love InstaCashMart">
          <p className="text-sm text-slate-600 mt-2">
            Designed from the ground up for maximum safety, unmatched speed, and absolute peace of
            mind.
          </p>
        </SectionHeader>
        <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyUsCards.map((whyUsCard) =>
            whyUsCard.imageOnly ? (
              <div
                key={whyUsCard.title}
                className="relative rounded-2xl border border-slate-200 overflow-hidden hover:border-brand-500 hover:shadow-lg transition"
              >
                <img
                  src={whyUsCard.image}
                  alt={
                    whyUsCard.titleOnImage
                      ? ""
                      : [whyUsCard.title, whyUsCard.text].filter(Boolean).join(": ")
                  }
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {whyUsCard.titleOnImage && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/85 via-slate-900/50 to-transparent px-5 pt-12 pb-4">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight drop-shadow">
                      {whyUsCard.title}
                    </h3>
                    {whyUsCard.text && (
                      <p className="text-xs text-white/85 leading-relaxed mt-1.5 drop-shadow">
                        {whyUsCard.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                key={whyUsCard.title}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-500 hover:shadow-lg transition overflow-hidden"
              >
                {whyUsCard.image && (
                  <img
                    src={whyUsCard.image}
                    alt=""
                    loading="lazy"
                    className="block -mx-5 -mt-5 mb-4 w-[calc(100%+2.5rem)] max-w-none aspect-video object-cover"
                  />
                )}
                <div
                  className={`w-12 h-12 rounded-xl ${whyUsCard.iconClass} flex items-center justify-center text-xl mb-3`}
                >
                  <i className={`fa-solid ${whyUsCard.icon}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{whyUsCard.title}</h3>
                {whyUsCard.text && (
                  <p className="text-xs text-slate-500 leading-relaxed">{whyUsCard.text}</p>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const { openTrack } = useApp();
  const [e] = useSearchParams();
  useEffect(() => {
    const s = e.get("track");
    if (s) {
      openTrack(s);
    }
  }, [e, openTrack]);
  return (
    <main>
      <h1 className="sr-only">InstaCashMart: sell your old gadgets and buy accessories</h1>
      <SellSection />
      <TrendingDevices query={e.get("q") || ""} />
      <PopularAccessories />
      <WhyUs />
      <HomeReviews />
      <section id="faqs" className={`${sectionCardClass} reveal py-8 lg:py-10`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Got Questions?"
            title="Frequently Asked Questions"
            className="text-center mb-8"
          >
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about selling on InstaCashMart
            </p>
          </SectionHeader>
          <Accordion />
          <p className="text-center text-xs text-slate-500 mt-6">
            {"Still have questions?"}{" "}
            <Link to="/faqs" className="font-bold text-brand-700 hover:text-brand-800">
              See all FAQs
            </Link>{" "}
            {"or call"}{" "}
            <a href={supportPhoneHref} className="font-bold text-slate-900">
              {supportPhone}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
