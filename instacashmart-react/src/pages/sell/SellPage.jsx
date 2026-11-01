import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SimpleHeader, headerButtonClass } from "../../components/layout/SimpleHeader";
import { ModelSearch } from "../../components/sell/ModelSearch";
import { OptionTiles } from "../../components/ui/OptionTiles";
import { useApp } from "../../context/AppContext";
import { OTHER, brandName } from "../../data/sellBrands";
import {
  accessoryBonuses,
  calculateQuote,
  conditionOptions,
  deviceCatalog,
  findModel,
  variantMultiplier,
  variantOptions,
} from "../../data/sellCatalog";
import { deviceImage, useSellModels } from "../../data/sellModels";

export const fieldClass =
  "w-full bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 transition";

const FieldLabel = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
  >
    {children}
  </label>
);

const defaultVariant = (t) => {
  return {
    storage: variantOptions[t]?.storage?.def ?? null,
    ram: variantOptions[t]?.ram?.def ?? null,
  };
};

const initialSelection = (t, e, s = null) => ({
  category: t,
  brand: e || deviceCatalog[t].brands[0],
  modelIndex: s,
  ...defaultVariant(t),
});

function variantFromParams(t, e) {
  const s = {};
  for (const r of ["storage", "ram"]) {
    const o = variantOptions[e]?.[r]?.opts.indexOf(t.get(r));
    if (o >= 0) {
      s[r] = o;
    }
  }
  return s;
}

function selectionFromParams(t) {
  const e = deviceCatalog[t.get("cat")] ? t.get("cat") : "phone";
  const s = t.get("brand");
  const quickModel = t.get("model");
  if (s === OTHER) {
    return {
      ...initialSelection(e, OTHER),
      ...variantFromParams(t, e),
      otherBrand: t.get("otherBrand") || "",
      otherModel: t.get("otherModel") || "",
    };
  }
  if (s && quickModel) {
    const a = findModel(s, quickModel, t.get("cat"));
    if (a) {
      return {
        ...initialSelection(a.category, a.brand, a.index),
        ...variantFromParams(t, a.category),
        quickModel,
      };
    }
  }
  return initialSelection(e, deviceCatalog[e].brands.includes(s) ? s : null);
}

export function SellPage() {
  const [t] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  useSellModels();
  const [state, setState] = useState(() => selectionFromParams(t));
  const [variantInput, setVariantInput] = useState("");
  const [deviceCondition, setDeviceCondition] = useState("flawless");
  const [form, setForm] = useState({
    box: true,
    charger: true,
    bill: true,
  });
  useEffect(() => {
    const C = selectionFromParams(t);
    setState(C);
    if (C.quickModel) {
      showToast(`Selected ${C.quickModel}. Ready for booking!`);
    }
  }, [t, showToast]);
  const { category, brand, modelIndex } = state;
  const f = deviceCatalog[category];
  const S = brand === OTHER;
  const y = !!t.get("brand") && t.get("cat") === category;
  const b = (C) => (y ? C - 1 : C);
  const models = f.models[brand] || [];
  const selected = S || modelIndex == null ? null : models[modelIndex] || null;
  const R = variantOptions[category] || {
    storage: null,
    ram: null,
  };
  const D = useMemo(() => {
    const C = conditionOptions.find((conditionOption) => conditionOption.value === deviceCondition);
    if (!selected) {
      return {
        condition: C.label,
        price: "",
      };
    }
    const v = accessoryBonuses.reduce(
      (total, item) => total + (form[item.key] ? item.bonus : 0),
      0,
    );
    return {
      condition: C.label,
      price: calculateQuote(
        selected.base,
        variantMultiplier(category, state.storage, state.ram),
        C.multiplier,
        v,
      ),
    };
  }, [selected, category, state.storage, state.ram, deviceCondition, form]);
  const handleClick = () => {
    var T;
    var I;
    let model = selected?.name;
    if (!S && !selected) {
      showToast("Type your model and pick it from the list to continue");
      if ((T = document.getElementById("modelSearch")) != null) {
        T.focus();
      }
      return;
    }
    if (S) {
      const A = (state.otherBrand || "").trim();
      const F = (state.otherModel || "").trim();
      if (!A || !F) {
        showToast("Enter your device's brand and model to continue");
        if ((I = document.getElementById(A ? "otherModelInput" : "otherBrandInput")) != null) {
          I.focus();
        }
        return;
      }
      model = F.toLowerCase().startsWith(A.toLowerCase()) ? F : `${A} ${F}`;
    }
    const v = new URLSearchParams({
      cat: category,
      ...(!S && {
        brand,
      }),
      model,
      storage: R.storage ? R.storage.opts[state.storage] : "",
      ram: R.ram ? R.ram.opts[state.ram] : "",
      variant: variantInput.trim(),
      condition: D.condition,
      accessories: accessoryBonuses
        .filter((accessoryBonus) => form[accessoryBonus.key])
        .map((item) => item.label)
        .join(", "),
      price: D.price,
    });
    navigate(`/device-check?${v}`);
  };
  return (
    <>
      <SimpleHeader
        action={
          <Link to="/" className={headerButtonClass}>
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Back to Home</span>
          </Link>
        }
      />
      <section
        id="calculator"
        className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 mb-10 rounded-2xl border border-slate-200 bg-white py-6 lg:py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6">
            {!y && (
              <div>
                <FieldLabel>1. Select Brand</FieldLabel>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {f.brands.map((brand2) => (
                    <button
                      key={brand2}
                      type="button"
                      onClick={() =>
                        setState((v) => ({
                          ...v,
                          brand: brand2,
                          modelIndex: null,
                        }))
                      }
                      aria-pressed={brand2 === brand}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${brand2 === brand ? "border-brand-600 bg-brand-50/80 text-brand-700 shadow-2xs" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
                    >
                      {brandName(category, brand2)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setState((C) => ({
                        ...C,
                        brand: OTHER,
                        otherBrand: C.otherBrand || "",
                        otherModel: C.otherModel || "",
                      }))
                    }
                    aria-pressed={S}
                    className={`p-2.5 rounded-xl border border-dashed text-xs font-bold transition text-center ${S ? "border-brand-600 bg-brand-50/80 text-brand-700 shadow-2xs" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}`}
                  >
                    <i className="fa-solid fa-pen-to-square mr-1" />
                    {"Other"}
                  </button>
                </div>
              </div>
            )}
            <div>
              {S ? (
                <>
                  <FieldLabel htmlFor="otherBrandInput">
                    {b(2)}
                    {". Enter Brand & Model"}
                  </FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label
                        htmlFor="otherBrandInput"
                        className="block text-[11px] font-semibold text-slate-500 mb-1"
                      >
                        Brand name *
                      </label>
                      <input
                        id="otherBrandInput"
                        type="text"
                        required
                        value={state.otherBrand}
                        onChange={(evt) =>
                          setState((v) => ({
                            ...v,
                            otherBrand: evt.target.value,
                          }))
                        }
                        placeholder="e.g. Lava, Micromax, Gigabyte"
                        autoComplete="off"
                        className={`${fieldClass} px-3 py-2.5 font-semibold`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="otherModelInput"
                        className="block text-[11px] font-semibold text-slate-500 mb-1"
                      >
                        Model name *
                      </label>
                      <input
                        id="otherModelInput"
                        type="text"
                        required
                        value={state.otherModel}
                        onChange={(evt) =>
                          setState((v) => ({
                            ...v,
                            otherModel: evt.target.value,
                          }))
                        }
                        placeholder="As written on the box or in Settings → About"
                        autoComplete="off"
                        className={`${fieldClass} px-3 py-2.5 font-semibold`}
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    <i className="fa-solid fa-circle-info text-brand-600 mr-1" />
                    {"We'll confirm the best price for this device after a quick check at pickup."}
                  </p>
                </>
              ) : (
                <>
                  <FieldLabel htmlFor="modelSearch">
                    {b(2)}
                    {". Type Your Model"}
                  </FieldLabel>
                  <ModelSearch
                    models={models}
                    selected={selected}
                    onSelect={(C) =>
                      setState((v) => ({
                        ...v,
                        modelIndex: C,
                      }))
                    }
                    onCustom={(C) =>
                      setState((v) => ({
                        ...v,
                        brand: OTHER,
                        otherBrand: brandName(category, v.brand),
                        otherModel: C,
                      }))
                    }
                  />
                  {selected && (
                    <div className="mt-3 flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-200">
                      <span className="w-20 h-20 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1.5">
                        <img
                          src={deviceImage(category, selected.name, brand)}
                          alt={selected.name}
                          className="w-full h-full object-contain"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {brandName(category, brand)}
                        </p>
                        <p className="text-sm font-extrabold text-slate-900 leading-snug">
                          {selected.name}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <FieldLabel>
                {b(3)}
                {". Storage, RAM & Variant"}
              </FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {["storage", "ram"].map(
                  (item) =>
                    R[item] && (
                      <div key={item}>
                        <label
                          htmlFor={`${item}Select`}
                          className="block text-[11px] font-semibold text-slate-500 mb-1"
                        >
                          {item === "ram" ? "RAM" : "Storage"}
                        </label>
                        <select
                          id={`${item}Select`}
                          value={state[item]}
                          onChange={(evt) =>
                            setState((T) => ({
                              ...T,
                              [item]: Number(evt.target.value),
                            }))
                          }
                          className={`${fieldClass} px-3 py-2.5 font-semibold`}
                        >
                          {R[item].opts.map((opt, index) => (
                            <option key={opt} value={index}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    ),
                )}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="variantInput"
                    className="block text-[11px] font-semibold text-slate-500 mb-1"
                  >
                    Variant / Colour
                  </label>
                  <input
                    id="variantInput"
                    type="text"
                    value={variantInput}
                    onChange={(evt) => setVariantInput(evt.target.value)}
                    placeholder="e.g. Natural Titanium, 5G, Dual SIM"
                    className={`${fieldClass} px-3 py-2.5`}
                  />
                </div>
              </div>
            </div>
            <div>
              <FieldLabel>
                {b(4)}
                {". Device Physical Condition"}
              </FieldLabel>
              <OptionTiles
                name="deviceCondition"
                columns="grid-cols-2 sm:grid-cols-3"
                tileClass="p-3 bg-white border border-slate-200 rounded-xl text-center"
                value={deviceCondition}
                onChange={setDeviceCondition}
                options={conditionOptions.map((conditionOption) => ({
                  value: conditionOption.value,
                  content: (
                    <>
                      <span className="block text-xs font-bold text-slate-900">
                        {conditionOption.title}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        {conditionOption.hint}
                      </span>
                    </>
                  ),
                }))}
              />
            </div>
            <div>
              <FieldLabel>
                {b(5)}
                {". Accessories Available with You (Bonus Value)"}
              </FieldLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {accessoryBonuses.map((accessoryBonus) => (
                  <label
                    key={accessoryBonus.key}
                    className="cursor-pointer flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-brand-500 transition"
                  >
                    <input
                      type="checkbox"
                      checked={form[accessoryBonus.key]}
                      onChange={(evt) =>
                        setForm((T) => ({
                          ...T,
                          [accessoryBonus.key]: evt.target.checked,
                        }))
                      }
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 accent-brand-600"
                    />
                    <span>{accessoryBonus.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
