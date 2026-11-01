import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import {
  brandsWithListings,
  getVehicleType,
  sellVehiclePath,
  useVehicles,
  vehicleBrandPath,
  vehicleBrowsePath,
  vehicleModels,
} from "../../data/vehicles";

export function VehicleBrandsPage({ type }) {
  const e = getVehicleType(type);
  const s = useVehicles();
  const [textValue, setTextValue] = useState("");
  const r = useMemo(() => brandsWithListings(s, type), [s, type]);
  const o = s.filter((item) => item.type === type);
  const l = textValue.trim().toLowerCase();
  const c = l
    ? r.filter(
        (item) =>
          item.name.toLowerCase().includes(l) ||
          Object.keys(vehicleModels[type][item.key] || {}).some((item2) =>
            item2.toLowerCase().includes(l),
          ) ||
          o.some((item2) => item2.brand === item.key && item2.model.toLowerCase().includes(l)),
      )
    : r;
  useEffect(() => {
    document.title = `${e.label} – Choose a Brand | InstaCashMart`;
  }, [e]);
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <Breadcrumbs items={[["Home", "/"], [e.label]]} />
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mt-4">
          <div className="flex items-center gap-5 max-w-2xl">
            <img src={e.image} alt="" className="hidden sm:block w-32 h-24 object-contain" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {e.label}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {"Choose a brand to see its models, prices and"} {e.short.toLowerCase()}
                {"s for sale"}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {r.length}
                  {" brands"}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {o.length}
                  {" for sale"}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-80 space-y-2">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="search"
                value={textValue}
                onChange={(evt) => setTextValue(evt.target.value)}
                placeholder={
                  type === "car" ? "Brand or model, e.g. Creta" : "Brand or model, e.g. Classic 350"
                }
                aria-label="Search brand or model"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={vehicleBrowsePath(type)}
                className="text-center px-3 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-900 transition"
              >
                {"All "}
                {e.short.toLowerCase()}
                {"s for sale"}
              </Link>
              <Link
                to={sellVehiclePath(type)}
                className="text-center px-3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition"
              >
                {"Sell your "}
                {e.short.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
        aria-label={`${e.short} brands`}
      >
        {c.length ? (
          <div className="reveal-group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {c.map((item) => (
              <Link
                key={item.key}
                to={vehicleBrandPath(type, item.key)}
                className="group flex flex-col items-center text-center p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-500 hover:shadow-md transition"
              >
                <span className="h-14 w-full flex items-center justify-center group-hover:scale-105 transition">
                  <BrandLogo brand={item} />
                </span>
                <span className="mt-3 text-sm font-bold text-slate-900 group-hover:text-brand-700 transition">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {item.tagline || `${e.short}s`}
                </span>
                <span
                  className={`mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.count ? "text-brand-700 bg-brand-50" : "text-slate-500 bg-slate-100"}`}
                >
                  {item.count ? `${item.count} for sale` : "None for sale yet"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-base font-extrabold text-slate-900">
              {"No brand or model matches “"}
              {textValue}
              {"”"}
            </p>
            <button
              type="button"
              onClick={() => setTextValue("")}
              className="mt-4 px-5 py-2.5 rounded-full border border-slate-900 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition"
            >
              Show all brands
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
