import { Link } from "react-router-dom";
import { BackToHome } from "../components/ui/BackToHome";
import { sellCategoryPath } from "../data/sellBrands";
import { sellCategories } from "../data/sellCatalog";
import { vehicleBasePath, vehicleTypes } from "../data/vehicles";

export function DevicesPage() {
  const t = [
    ...sellCategories.map((sellCategory) => ({
      key: sellCategory.key,
      label: sellCategory.label,
      tile: sellCategory.tile,
      image: sellCategory.image,
      icon: sellCategory.icon,
      to: sellCategoryPath(sellCategory.key),
    })),
    ...vehicleTypes.map((vehicleType) => ({
      key: vehicleType.key,
      label: vehicleType.label,
      tile: `Sell ${vehicleType.tile}`,
      image: vehicleType.tileImage || vehicleType.image,
      icon: vehicleType.icon,
      to: vehicleBasePath(vehicleType.key),
    })),
  ];
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Sell with InstaCashMart
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Which device would you like to sell?
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose a category to browse brands and models and get your exact value.
          </p>
        </div>
        <div
          className="reveal-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6"
          aria-label="Devices available to sell"
        >
          {t.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition hover:border-brand-500 hover:bg-brand-50/30 hover:shadow-md"
            >
              <img
                src={item.image}
                alt=""
                className="h-20 w-20 object-contain transition group-hover:scale-110"
              />
              <span className="mt-3 text-sm font-bold text-slate-900 transition group-hover:text-brand-700">
                {item.tile}
              </span>
              <span className="mt-1 text-xs text-slate-500">{item.label}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                {"Choose device "}
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
