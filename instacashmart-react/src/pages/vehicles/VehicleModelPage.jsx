import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EnquiryModal } from "../../components/vehicles/EnquiryModal";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import {
  brandsWithListings,
  estimateResale,
  getVehicleType,
  modelsWithListings,
  sellVehiclePath,
  slugify,
  useVehicles,
  vehicleBasePath,
  vehicleBrandPath,
  vehicleModelPath,
} from "../../data/vehicles";
import { formatPriceCompact } from "../../lib/format";

const emiYears = [1, 3, 5];

export function VehicleModelPage({ type }) {
  const e = getVehicleType(type);
  const { brand = "", model = "" } = useParams();
  const a = useVehicles();
  const brand2 = useMemo(() => brandsWithListings(a, type), [a, type]).find(
    (item) => slugify(item.key) === brand,
  );
  const l = brand2 ? modelsWithListings(a, type, brand2.key) : [];
  const c = l.find((item) => slugify(item.name) === model);
  const [vehicle, setVehicle] = useState(null);
  useEffect(() => {
    if (brand2 && c) {
      document.title = `${brand2.name} ${c.name} – Price, Resale Value & Listings | InstaCashMart`;
    }
  }, [brand2?.key, c?.name]);
  if (!c) {
    return (
      <main>
        <BackToHome />
        <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-extrabold text-slate-900">Model not found</p>
          <Link
            to={brand2 ? vehicleBrandPath(type, brand2.key) : vehicleBasePath(type)}
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            {brand2 ? `All ${brand2.name} models` : `All ${e.short.toLowerCase()} brands`}
          </Link>
        </section>
      </main>
    );
  }
  const p = new Date().getFullYear();
  const h = type === "car" ? 12000 : 8000;
  const _ = c.newPrice
    ? emiYears.map((emiYear) => ({
        age: emiYear,
        range: estimateResale({
          type,
          brand: brand2.key,
          model: c.name,
          year: p - emiYear,
          km: emiYear * h,
          owners: "1st",
        }),
      }))
    : [];
  const f = c.listings.length ? Math.min(...c.listings.map((listing) => listing.price)) : 0;
  const S = l.filter((item) => item.name !== c.name);
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <Breadcrumbs
          items={[
            [e.short, vehicleBasePath(type)],
            ["Brand", vehicleBasePath(type)],
            ["Model", vehicleBrandPath(type, brand2.key)],
            [c.name],
          ]}
        />
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 md:gap-10 mt-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden h-64 sm:h-80">
            <img
              src={c.image || e.image}
              alt={`${brand2.name} ${c.name}`}
              className={c.image ? "w-full h-full object-cover" : "w-3/4 h-3/4 object-contain"}
            />
          </div>
          <div className="min-w-0">
            <span className="inline-flex h-8 items-center">
              <BrandLogo brand={brand2} />
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {brand2.name} {c.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {c.newPrice && (
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {"New: "}
                  {formatPriceCompact(c.newPrice)}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700">
                {c.listings.length
                  ? `${c.listings.length} for sale • from ${formatPriceCompact(f)}`
                  : "None for sale yet"}
              </span>
            </div>
            {_.length > 0 && (
              <>
                <p className="mt-5 text-sm font-bold text-slate-900">Estimated resale value</p>
                <div className="mt-2 rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {_.map(({ age, range }) => (
                    <div key={age} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {p - age}
                          {" model"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {age}
                          {" yr old • ~"}
                          {(age * h).toLocaleString("en-IN")} {"km • 1st owner"}
                        </p>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatPriceCompact(range.low)}
                        {" –"} {formatPriceCompact(range.high)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Estimates for a well-kept vehicle. Get an exact figure when you list it.
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <Link
                to={sellVehiclePath(type, brand2.key, c.name)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
              >
                {"Sell your "}
                {c.name} <i className="fa-solid fa-arrow-right text-xs" />
              </Link>
              {c.listings.length > 0 && (
                <a
                  href="#listings"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-900 text-sm font-bold text-slate-900 transition"
                >
                  {"View "}
                  {c.listings.length}
                  {" for sale"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <section
        id="listings"
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-label={`${c.name} for sale`}
      >
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-4">
          {brand2.name} {c.name}
          {" for sale"}{" "}
          <span className="text-slate-400 font-semibold">
            {"("}
            {c.listings.length}
            {")"}
          </span>
        </h2>
        {c.listings.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {c.listings.map((listing) => (
              <VehicleCard
                key={listing.id}
                vehicle={listing}
                onContact={() => setVehicle(listing)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 px-6 text-center">
            <p className="text-base font-extrabold text-slate-900">
              {"No "}
              {c.name}
              {" for sale right now"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Have one? List it for free and reach buyers.
            </p>
          </div>
        )}
      </section>
      {S.length > 0 && (
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
              to={vehicleBrandPath(type, brand2.key)}
              className="text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              {"All models "}
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {S.map((item) => (
              <Link
                key={item.name}
                to={vehicleModelPath(type, brand2.key, item.name)}
                className="shrink-0 w-36 flex flex-col items-center text-center p-2 rounded-xl border border-slate-200 hover:border-brand-500 bg-white transition"
              >
                <span className="h-20 w-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                  <img
                    src={item.image || e.image}
                    alt={item.name}
                    loading="lazy"
                    className={
                      item.image ? "w-full h-full object-cover" : "w-3/4 h-3/4 object-contain"
                    }
                  />
                </span>
                <span className="mt-2 text-xs font-semibold text-slate-900 line-clamp-2">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {vehicle && <EnquiryModal vehicle={vehicle} onClose={() => setVehicle(null)} />}
    </main>
  );
}
