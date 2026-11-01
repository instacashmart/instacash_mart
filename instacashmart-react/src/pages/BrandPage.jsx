import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BackToHome } from "../components/ui/BackToHome";
import { deviceCatalog, getSellCategory } from "../data/sellCatalog";
import { deviceImage, useSellModels } from "../data/sellModels";
import logoAppleImage2 from "../assets/images/logo-apple.webp";
import logoAsusImage2 from "../assets/images/logo-asus.webp";
import logoDellImage2 from "../assets/images/logo-dell.webp";
import logoGoogle from "../assets/images/logo-google.webp";
import logoHpImage2 from "../assets/images/logo-hp.webp";
import logoLenovoImage2 from "../assets/images/logo-lenovo.webp";
import logoOneplusImage2 from "../assets/images/logo-oneplus.webp";
import logoOppoImage2 from "../assets/images/logo-oppo.webp";
import logoSamsungImage2 from "../assets/images/logo-samsung.webp";
import logoVivoImage2 from "../assets/images/logo-vivo.webp";
import logoXiaomiImage2 from "../assets/images/logo-xiaomi.webp";

const topBrands = [
  {
    key: "Apple",
    name: "Apple",
    tagline: "iPhones, Macs, iPads",
    logo: logoAppleImage2,
  },
  {
    key: "Samsung",
    name: "Samsung",
    tagline: "Galaxy S, Z Fold, Tab",
    logo: logoSamsungImage2,
  },
  {
    key: "OnePlus",
    name: "OnePlus",
    tagline: "Number & Nord Series",
    logo: logoOneplusImage2,
  },
  {
    key: "Xiaomi",
    name: "Xiaomi",
    tagline: "Mi, Redmi, POCO",
    logo: logoXiaomiImage2,
  },
  {
    key: "Dell",
    name: "Dell",
    tagline: "XPS, Inspiron, Alienware",
    logo: logoDellImage2,
  },
  {
    key: "HP",
    name: "HP",
    tagline: "Spectre, Envy, Pavilion",
    logo: logoHpImage2,
  },
  {
    key: "Lenovo",
    name: "Lenovo",
    tagline: "ThinkPad, Legion, Yoga",
    logo: logoLenovoImage2,
  },
  {
    key: "Google",
    name: "Google Pixel",
    tagline: "Pixel 8, 7, Fold",
    logo: logoGoogle,
  },
  {
    key: "Sony",
    name: "Sony",
    tagline: "PlayStation, WH Audio",
    icon: "fa-gamepad",
  },
  {
    key: "Asus",
    name: "Asus",
    tagline: "ROG, ZenBook, TUF",
    logo: logoAsusImage2,
  },
  {
    key: "Vivo",
    name: "Vivo",
    tagline: "X-Series, V-Series",
    logo: logoVivoImage2,
  },
  {
    key: "Oppo",
    name: "Oppo / Realme",
    tagline: "Find, Reno, GT",
    logo: logoOppoImage2,
  },
];

const getTopBrand = (t) => topBrands.find((topBrand) => topBrand.key === t);

export function BrandPage() {
  const { brand = "" } = useParams();
  const e = getTopBrand(brand);
  useSellModels();
  const s = Object.entries(deviceCatalog)
    .filter(([, r]) => r.models[brand])
    .map(([r, o]) => ({
      key: r,
      models: o.models[brand],
    }));
  useEffect(() => {
    if (e) {
      document.title = `Sell ${e.name} | InstaCashMart`;
    }
  }, [e]);
  if (!e || !s.length) {
    return (
      <main>
        <BackToHome />
        <section className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-extrabold text-slate-900">Brand not found</p>
            <p className="text-sm text-slate-500 mt-1">Pick a brand from the full list.</p>
            <Link
              to="/brands"
              className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              View All Brands
            </Link>
          </div>
        </section>
      </main>
    );
  }
  const n = s.flatMap((item) => item.models);
  const a = (r, o) =>
    `/sell?${new URLSearchParams({
      cat: r,
      brand,
      ...(o
        ? {
            model: o,
          }
        : {}),
    })}`;
  return (
    <main>
      <BackToHome />
      <section className="reveal-group max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <div className="w-32 h-20 shrink-0 rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-3">
              {e.logo ? (
                <img
                  src={e.logo}
                  alt={`${e.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <i className={`fa-solid ${e.icon} text-4xl text-slate-800`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {"Sell your "}
                {e.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{e.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {n.length}
                  {" models"}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {s.length}
                  {" device "}
                  {s.length === 1 ? "type" : "types"}
                </span>
              </div>
            </div>
            <Link
              to={a(s[0].key)}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
            >
              {"Sell "}
              {e.name} <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <i className="fa-solid fa-truck-fast text-brand-600" />
              {" Free doorstep pickup"}
            </p>
            <p className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-brand-600" /> {"Certified data wipe"}
            </p>
            <p className="flex items-center gap-2">
              <i className="fa-solid fa-bolt text-brand-600" />
              {" Instant UPI / bank payment"}
            </p>
          </div>
        </div>
        {s.map((item) => {
          const o = getSellCategory(item.key);
          return (
            <div key={item.key} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-slate-900">
                <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm">
                  <i className={`fa-solid ${o.icon}`} />
                </span>
                {o.label}
                <span className="text-xs font-semibold text-slate-400">{item.models.length}</span>
              </h2>
              <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {item.models.map((model) => (
                  <div
                    key={model.name}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition"
                  >
                    <span className="w-16 h-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1.5">
                      <img
                        src={deviceImage(item.key, model.name, brand)}
                        alt={model.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{model.name}</p>
                    </div>
                    <Link
                      to={a(item.key, model.name)}
                      className="shrink-0 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      Sell
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          <i className="fa-solid fa-arrow-left text-xs" />
          {" All brands"}
        </Link>
      </section>
    </main>
  );
}
