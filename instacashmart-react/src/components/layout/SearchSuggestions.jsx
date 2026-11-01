import { useNavigate } from "react-router-dom";
import { ProductImage } from "../ui/ProductImage";
import { useApp } from "../../context/AppContext";
import { categoryLabel, matchesSearch, searchTokens } from "../../data/accessories";
import { searchModels } from "../../data/sellCatalog";
import { getVehicleType, useVehicles, vehicleMatches, vehicleTitle } from "../../data/vehicles";
import { formatPrice, formatPriceCompact } from "../../lib/format";

const popularTerms = ["Charger", "iPhone case", "Earbuds", "Power bank", "Screen guard", "Cable"];

const popularDevices = [
  {
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    label: "iPhone 15 Pro Max",
    price: 84000,
    icon: "fa-brands fa-apple",
  },
  {
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    label: "Samsung Galaxy S24 Ultra",
    price: 78500,
    icon: "fa-solid fa-mobile-screen",
  },
  {
    brand: "Apple",
    model: 'MacBook Air M2 13"',
    label: 'MacBook Air M2 13"',
    price: 59000,
    icon: "fa-solid fa-laptop",
  },
];

const SuggestionHeading = ({ children }) => (
  <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
    {children}
  </div>
);

function useSearchPicks(t) {
  const { goToStore } = useApp();
  const navigate = useNavigate();
  return {
    pickProduct: (n) => {
      t();
      goToStore({
        category: "all",
        query: n.name,
      });
    },
    pickTerm: (n) => {
      t();
      goToStore({
        category: "all",
        query: n,
      });
    },
    pickDevice: (n) => {
      t();
      goToStore({
        category: "all",
        query: n,
      });
    },
    pickVehicle: (n) => {
      t();
      navigate(
        `/bikes-cars?${new URLSearchParams({
          ...(n.type === "car" && {
            type: "car",
          }),
          q: `${n.brand} ${n.model}`,
        })}#listings`,
      );
    },
  };
}

export function SearchSuggestions({ query, onDone }) {
  const { catalog } = useApp();
  const n = useVehicles();
  const { pickProduct, pickTerm, pickDevice, pickVehicle } = useSearchPicks(onDone);
  const c = query.trim();
  if (!c) {
    return (
      <>
        <SuggestionHeading>Popular in store</SuggestionHeading>
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          {popularTerms.map((popularTerm) => (
            <button
              key={popularTerm}
              type="button"
              onClick={() => pickTerm(popularTerm)}
              className="px-3 py-1.5 rounded-full border border-slate-300 hover:border-slate-900 text-xs font-semibold text-slate-800 transition"
            >
              {popularTerm}
            </button>
          ))}
        </div>
        <SuggestionHeading>Sell yours</SuggestionHeading>
        {popularDevices.map((popularDevice) => (
          <button
            key={popularDevice.label}
            type="button"
            onClick={() => pickDevice(`${popularDevice.brand} ${popularDevice.model}`)}
            className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl text-left text-xs transition"
          >
            <span className="font-medium text-slate-800">
              <i className={`${popularDevice.icon} text-slate-400 mr-2`} />
              {popularDevice.label}
            </span>
            <span className="text-brand-600 font-bold">
              {"Up to "}
              {formatPrice(popularDevice.price)}
            </span>
          </button>
        ))}
      </>
    );
  }
  const u = searchTokens(c.toLowerCase());
  const m = catalog.filter((item) => matchesSearch(item, u));
  const p = searchModels(c);
  const h = n.filter((item) => vehicleMatches(item, c));
  if (!m.length && !p.length && !h.length) {
    return (
      <div className="p-3 text-xs text-slate-400 text-center">
        No match found. Try "charger", "case", "iPhone", "earbuds"...
      </div>
    );
  } else {
    return (
      <>
        {m.length > 0 && (
          <>
            <SuggestionHeading>
              {"Shop • "}
              {m.length} {m.length === 1 ? "product" : "products"}
            </SuggestionHeading>
            {m.slice(0, 5).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pickProduct(item)}
                className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl text-left text-xs transition"
              >
                <ProductImage
                  product={item}
                  boxClass="w-9 h-9 shrink-0 rounded-lg"
                  iconClass="text-sm"
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-slate-900 truncate">{item.name}</span>
                  <span className="block text-slate-400">
                    {"in "}
                    {categoryLabel(item.category)}
                  </span>
                </span>
                <span className="shrink-0 font-bold text-slate-900">{formatPrice(item.price)}</span>
              </button>
            ))}
          </>
        )}
        {h.length > 0 && (
          <>
            <SuggestionHeading>
              {"Bikes & cars • "}
              {h.length} {h.length === 1 ? "listing" : "listings"}
            </SuggestionHeading>
            {h.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pickVehicle(item)}
                className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl text-left text-xs transition"
              >
                <img
                  src={item.image || getVehicleType(item.type).image}
                  alt=""
                  className={`w-9 h-9 shrink-0 rounded-lg bg-slate-50 ${item.image ? "object-cover" : "object-contain p-0.5"}`}
                />
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-slate-900 truncate">
                    {vehicleTitle(item)}
                  </span>
                  <span className="block text-slate-400">
                    {[item.brand, item.km > 0 && `${item.km.toLocaleString("en-IN")} km`, item.city]
                      .filter(Boolean)
                      .join(" • ")}
                  </span>
                </span>
                <span className="shrink-0 font-bold text-slate-900">
                  {formatPriceCompact(item.price)}
                </span>
              </button>
            ))}
          </>
        )}
        {p.length > 0 && (
          <>
            <SuggestionHeading>Devices</SuggestionHeading>
            {p.slice(0, 3).map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => pickDevice(item.name)}
                className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl text-left text-xs transition"
              >
                <span className="font-medium text-slate-800">
                  <i className="fa-solid fa-bolt text-brand-500 mr-2 text-[10px]" />
                  {item.name}
                </span>
                <span className="text-brand-600 font-bold">
                  {"Up to "}
                  {formatPrice(item.price)}
                </span>
              </button>
            ))}
          </>
        )}
      </>
    );
  }
}
