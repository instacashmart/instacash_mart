import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ModelGrid } from "../../components/sell/ModelGrid";
import { BackToHome } from "../../components/ui/BackToHome";
import { BrandLogo } from "../../components/ui/BrandLogo";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EnquiryModal } from "../../components/vehicles/EnquiryModal";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import {
  brandsWithListings,
  getVehicleType,
  modelsWithListings,
  sellVehiclePath,
  slugify,
  useVehicles,
  vehicleBasePath,
  vehicleBrandPath,
  vehicleModelPath,
} from "../../data/vehicles";

export function VehicleBrandPage({ type }) {
  const e = getVehicleType(type);
  const { brand = "" } = useParams();
  const n = useVehicles();
  const a = useMemo(() => brandsWithListings(n, type), [n, type]);
  const brand2 = a.find((item) => slugify(item.key) === brand);
  const [vehicle, setVehicle] = useState(null);
  useEffect(() => {
    if (brand2) {
      document.title = `${brand2.name} ${e.label} – Prices & Listings | InstaCashMart`;
    }
  }, [brand2?.key, e]);
  if (!brand2) {
    return (
      <main>
        <BackToHome />
        <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-extrabold text-slate-900">Brand not found</p>
          <Link
            to={vehicleBasePath(type)}
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            {"All "}
            {e.short.toLowerCase()}
            {" brands"}
          </Link>
        </section>
      </main>
    );
  }
  const c = n.filter(
    (item) => item.type === type && item.brand.toLowerCase() === brand2.key.toLowerCase(),
  );
  const u = modelsWithListings(n, type, brand2.key);
  const m = [...new Set(c.map((item) => item.fuel).filter(Boolean))];
  const p = [...new Set(c.map((item) => item.city).filter(Boolean))];
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <Breadcrumbs items={[["Home", "/"], [e.label, vehicleBasePath(type)], [brand2.name]]} />
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 mt-5">
          <div className="w-36 h-24 shrink-0 rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-3">
            <BrandLogo brand={brand2} large />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {brand2.name} {e.label}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {u.length
                ? `Models: ${u.map((item) => item.name).join(", ")}`
                : `Pre-owned ${brand2.name} ${e.short.toLowerCase()}s`}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {c.length}
                {" for sale"}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                {u.length}
                {" models"}
              </span>
            </div>
          </div>
          <Link
            to={sellVehiclePath(type, brand2.key)}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
          >
            {"Sell your "}
            {brand2.name} <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-gas-pump text-brand-600" />{" "}
            {m.length ? m.join(", ") : "Fuel types vary by listing"}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-brand-600" />{" "}
            {p.length ? `Available in ${p.join(", ")}` : "No cities yet"}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-brand-600" />
            {" Verified sellers & Assured listings"}
          </p>
        </div>
      </section>
      {u.length > 0 && (
        <section
          className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
          aria-label={`${brand2.name} models`}
        >
          <ModelGrid
            key={brand2.key}
            brand={brand2.name}
            models={u.map((item) => ({
              name: item.name,
              image: item.image || e.image,
              cover: !!item.image,
              note: item.listings.length ? `${item.listings.length} for sale` : "",
              to: vehicleModelPath(type, brand2.key, item.name),
            }))}
            other={{
              to: sellVehiclePath(type, brand2.key),
            }}
          />
        </section>
      )}
      <section
        id="listings"
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-label={`${brand2.name} ${e.short.toLowerCase()}s for sale`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {brand2.name} {e.short.toLowerCase()}
            {"s for sale"}{" "}
            <span className="text-slate-400 font-semibold">
              {"("}
              {c.length}
              {")"}
            </span>
          </h2>
        </div>
        {c.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {c.map((item) => (
              <VehicleCard key={item.id} vehicle={item} onContact={() => setVehicle(item)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 px-6 text-center">
            <p className="text-base font-extrabold text-slate-900">
              {"No "}
              {brand2.name} {e.short.toLowerCase()}
              {"s for sale right now"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Have one? List it for free and reach buyers.
            </p>
            <Link
              to={sellVehiclePath(type, brand2.key)}
              className="inline-block mt-5 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-sm font-bold text-white transition"
            >
              {"Sell your "}
              {brand2.name}
            </Link>
          </div>
        )}
      </section>
      <section
        className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-label="Other brands"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            {"Other "}
            {e.short.toLowerCase()}
            {" brands"}
          </h2>
          <Link
            to={vehicleBasePath(type)}
            className="text-xs font-bold text-brand-700 hover:text-brand-800"
          >
            {"All brands "}
            <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
          {a
            .filter((item) => item.key !== brand2.key)
            .map((item) => (
              <Link
                key={item.key}
                to={vehicleBrandPath(type, item.key)}
                aria-label={item.name}
                className="shrink-0 w-32 h-16 rounded-xl border border-slate-200 hover:border-brand-500 bg-white flex items-center justify-center px-3 transition"
              >
                <BrandLogo brand={item} />
              </Link>
            ))}
        </div>
      </section>
      {vehicle && <EnquiryModal vehicle={vehicle} onClose={() => setVehicle(null)} />}
    </main>
  );
}
