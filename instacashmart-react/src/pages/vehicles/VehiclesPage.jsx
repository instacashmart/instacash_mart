import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { EnquiryModal } from "../../components/vehicles/EnquiryModal";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import {
  brandsWithListings,
  fuelTypes,
  getVehicleType,
  priceBands,
  useVehicles,
  vehicleMatches,
  vehicleTypes,
} from "../../data/vehicles";
import { formatPriceCompact } from "../../lib/format";

const sortOptions = [
  ["new", "Newest first"],
  ["low", "Price: low to high"],
  ["high", "Price: high to low"],
  ["km", "Kms driven: lowest"],
];

const sorters = {
  new: (t, e) => (e.condition === "New") - (t.condition === "New") || (e.year || 0) - (t.year || 0),
  low: (t, e) => t.price - e.price,
  high: (t, e) => e.price - t.price,
  km: (t, e) => (t.km || 0) - (e.km || 0),
};

const filterInputClass =
  "w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500";

export function VehiclesPage() {
  const t = useVehicles();
  const [e, s] = useSearchParams();
  const n = e.get("type") === "car" ? "car" : "bike";
  const a = e.get("brand") || "";
  const [state, setState] = useState(e.get("q") || "");
  const [textValue, setTextValue] = useState("all");
  const [state2, setState2] = useState(-1);
  const [textValue2, setTextValue2] = useState("new");
  const [vehicle, setVehicle] = useState(null);
  useEffect(() => setState(e.get("q") || ""), [e]);
  const S = (O) => {
    setState2(-1);
    s(
      O === "bike"
        ? {}
        : {
            type: O,
          },
      {
        replace: true,
      },
    );
  };
  const y = (O) => {
    const C = new URLSearchParams(e);
    if (O && O !== a) {
      C.set("brand", O);
    } else {
      C.delete("brand");
    }
    C.delete("q");
    s(C, {
      replace: true,
    });
  };
  const b = useMemo(() => brandsWithListings(t, n), [t, n]);
  const brand = a && b.find((item) => item.key.toLowerCase() === a.toLowerCase());
  const E = useMemo(() => {
    const O = priceBands[n][state2];
    return t
      .filter(
        (item) =>
          item.type === n &&
          (!a || item.brand.toLowerCase() === a.toLowerCase()) &&
          (textValue === "all" || item.fuel === textValue) &&
          (!O || (item.price >= O[1] && item.price < O[2])) &&
          vehicleMatches(item, state),
      )
      .sort(sorters[textValue2]);
  }, [t, n, a, textValue, state2, textValue2, state]);
  const R = state.trim() || textValue !== "all" || state2 >= 0 || a;
  const handleClick = () => {
    setState("");
    setTextValue("all");
    setState2(-1);
    if (a) {
      y("");
    }
  };
  return (
    <main>
      <BackToHome />
      <section
        id="listings"
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white py-8 lg:py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                {"Buy Used Bikes & Cars"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Pre-owned two-wheelers and cars from owners, dealers and InstaCashMart Assured
              </p>
            </div>
            <Link
              to="/bikes-cars/sell"
              className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold transition"
            >
              <i className="fa-solid fa-tag text-xs" />
              {" Sell your bike or car"}
            </Link>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-slate-200">
            {vehicleTypes.map((vehicleType) => {
              const C = n === vehicleType.key;
              return (
                <button
                  key={vehicleType.key}
                  type="button"
                  onClick={() => S(vehicleType.key)}
                  aria-pressed={C}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition ${C ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-700 hover:border-slate-900"}`}
                >
                  <i className={`fa-solid ${vehicleType.icon} text-xs`} />
                  {vehicleType.label}
                  <span className={`font-semibold ${C ? "text-slate-300" : "text-slate-400"}`}>
                    {t.filter((item) => item.type === vehicleType.key).length}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4" aria-label="Brands">
            {b.map((item) => {
              const C = brand?.key === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => y(item.key)}
                  aria-pressed={C}
                  title={item.name}
                  className={`shrink-0 w-32 h-20 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${C ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-slate-200 bg-white hover:border-slate-400"}`}
                >
                  <span className="h-9 flex items-center justify-center">
                    <BrandLogo brand={item} />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {item.count} {item.count === 1 ? "listing" : "listings"}
                  </span>
                </button>
              );
            })}
          </div>
          {brand && (
            <div className="mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4">
              <span className="w-20 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                <BrandLogo brand={brand} />
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-extrabold text-slate-900">
                  {brand.name} {getVehicleType(n).label}
                </h2>
                <p className="text-xs text-slate-500">
                  {brand.count
                    ? `${brand.count} ${brand.count === 1 ? "listing" : "listings"} • from ${formatPriceCompact(brand.from)}`
                    : "No listings right now"}
                  {brand.tagline && ` • ${brand.tagline}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => y("")}
                className="text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                All brands
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-5">
            <div className="relative col-span-2 lg:col-span-1">
              <input
                type="search"
                value={state}
                onChange={(evt) => setState(evt.target.value)}
                placeholder={
                  n === "car" ? "Search Creta, Swift, diesel..." : "Search Classic 350, Activa..."
                }
                aria-label="Search listings"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-slate-400 text-xs" />
            </div>
            <select
              value={textValue}
              onChange={(evt) => setTextValue(evt.target.value)}
              aria-label="Fuel"
              className={filterInputClass}
            >
              <option value="all">All fuel types</option>
              {fuelTypes.map((fuelType) => (
                <option key={fuelType} value={fuelType}>
                  {fuelType}
                </option>
              ))}
            </select>
            <select
              value={state2}
              onChange={(evt) => setState2(Number(evt.target.value))}
              aria-label="Budget"
              className={filterInputClass}
            >
              <option value={-1}>Any budget</option>
              {priceBands[n].map(([O], index) => (
                <option key={O} value={index}>
                  {O}
                </option>
              ))}
            </select>
            <select
              value={textValue2}
              onChange={(evt) => setTextValue2(evt.target.value)}
              aria-label="Sort"
              className={`${filterInputClass} col-span-2 lg:col-span-1`}
            >
              {sortOptions.map(([O, C]) => (
                <option key={O} value={O}>
                  {C}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 mb-4 text-sm">
            <p className="text-slate-500" aria-live="polite">
              {E.length} {brand ? `${brand.name} ` : ""}
              {getVehicleType(n).label.toLowerCase()} {E.length === 1 ? "listing" : "listings"}
              {state.trim() && ` for “${state.trim()}”`}
            </p>
            {R && (
              <button
                type="button"
                onClick={handleClick}
                className="text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                <i className="fa-solid fa-xmark" />
                {" Clear filters"}
              </button>
            )}
          </div>
          {E.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 px-6 text-center">
              <p className="text-lg font-extrabold text-slate-900">No listings match</p>
              <p className="text-sm text-slate-500 mt-1">
                Try another search, fuel type or budget.
              </p>
              <button
                type="button"
                onClick={handleClick}
                className="mt-5 px-5 py-2.5 rounded-full border border-slate-900 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition"
              >
                Show all listings
              </button>
            </div>
          ) : (
            <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {E.map((item) => (
                <VehicleCard key={item.id} vehicle={item} onContact={() => setVehicle(item)} />
              ))}
            </div>
          )}
        </div>
      </section>
      {vehicle && <EnquiryModal vehicle={vehicle} onClose={() => setVehicle(null)} />}
    </main>
  );
}
