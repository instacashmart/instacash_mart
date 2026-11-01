import { useRef, useState } from "react";
import {
  fuelTypes,
  getVehicleType,
  ownerOptions,
  transmissionTypes,
  vehicleBrands,
  vehicleModels,
} from "../../data/vehicles";
import { formatPriceCompact } from "../../lib/format";
import { resizeImage } from "../../lib/resizeImage";
import { store } from "../../lib/store";
import { EmptyNote, adminInputClass } from "./shared";

const emptyVehicle = (t) => ({
  id: "",
  type: t,
  name: "",
  brand: "",
  model: "",
  price: "",
  image: "",
  condition: "Used",
  year: "",
  km: "",
  fuel: "Petrol",
  transmission: "Manual",
  owners: "1st",
  city: "",
  description: "",
});

const adminYearOptions = Array.from(
  {
    length: 16,
  },
  (t, e) => new Date().getFullYear() - e,
);

export function VehiclesAdmin({ type, items, showToast }) {
  const n = getVehicleType(type);
  const [state, setState] = useState(() => emptyVehicle(type));
  const ref = useRef(null);
  const ref2 = useRef(null);
  const c = !!state.id;
  const u = state.condition === "Used";
  const m = (D) => (evt) =>
    setState((C) => ({
      ...C,
      [D]: evt.target.value,
    }));
  const p = vehicleBrands[type].find(
    (item) => item.key.toLowerCase() === state.brand.trim().toLowerCase(),
  )?.key;
  const h = Object.keys(vehicleModels[type][p] || {});
  const handleClick = () => {
    setState(emptyVehicle(type));
    if (ref.current) {
      ref.current.value = "";
    }
  };
  const handleChange = async (evt) => {
    const O = evt.target.files && evt.target.files[0];
    if (O) {
      try {
        const image = await resizeImage(O, 800);
        setState((v) => ({
          ...v,
          image,
        }));
      } catch {
        showToast("Could not read that image.");
      }
    }
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const O = {
      type,
      name: state.name.trim(),
      brand: p || state.brand.trim(),
      model: state.model.trim(),
      price: Number(state.price),
      image: state.image,
      condition: state.condition,
      year: state.year ? Number(state.year) : "",
      km: u && state.km ? Number(state.km) : "",
      fuel: state.fuel,
      transmission: state.transmission,
      owners: u ? state.owners : "",
      city: state.city.trim(),
      description: state.description.trim(),
    };
    if (
      !(c
        ? store.update("vehicleProducts", state.id, O)
        : store.add("vehicleProducts", {
            id: store.newId(type === "car" ? "CAR" : "BIKE"),
            createdAt: new Date().toISOString(),
            ...O,
          }))
    ) {
      showToast("Could not save: browser storage is full or blocked. Try a smaller photo.");
      return;
    }
    showToast(c ? `${n.short} updated` : `${n.short} added to Buy Bikes & Cars`);
    handleClick();
  };
  const y = (D) => {
    var O;
    setState({
      ...emptyVehicle(type),
      ...D,
      year: D.year || "",
      km: D.km || "",
      owners: D.owners || "1st",
    });
    if (ref.current) {
      ref.current.value = "";
    }
    if ((O = ref2.current) != null) {
      O.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const b = (D) => {
    if (window.confirm(`Delete "${D.name}"?`)) {
      store.remove("vehicleProducts", D.id);
      if (state.id === D.id) {
        handleClick();
      }
      showToast(`${n.short} deleted`);
    }
  };
  const B = (D) => {
    store.update("vehicleProducts", D.id, {
      hidden: !D.hidden,
    });
    showToast(D.hidden ? "Shown on Buy Bikes & Cars" : "Hidden from Buy Bikes & Cars");
  };
  const E = "block text-xs font-bold text-slate-700 mb-1";
  return (
    <section className="space-y-4">
      <form
        ref={ref2}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <img src={n.image} alt="" className="w-10 h-7 object-contain" />
            {c ? `Edit ${n.short}` : `Add ${n.short}`}
          </h2>
          {c && (
            <button
              type="button"
              onClick={handleClick}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor={`${type}Name`} className={E}>
              {n.short}
              {" name *"}
            </label>
            <input
              id={`${type}Name`}
              required
              value={state.name}
              onChange={m("name")}
              placeholder={type === "car" ? "e.g. Swift ZXi Plus" : "e.g. Classic 350 Signals"}
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor={`${type}Brand`} className={E}>
              Brand *
            </label>
            <input
              id={`${type}Brand`}
              list={`${type}BrandList`}
              required
              value={state.brand}
              onChange={m("brand")}
              placeholder="Pick or type a brand"
              className={adminInputClass}
            />
            <datalist id={`${type}BrandList`}>
              {vehicleBrands[type].map((item) => (
                <option key={item.key} value={item.key} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor={`${type}Price`} className={E}>
              Price (₹) *
            </label>
            <input
              id={`${type}Price`}
              type="number"
              min="1"
              required
              value={state.price}
              onChange={m("price")}
              placeholder={type === "car" ? "e.g. 565000" : "e.g. 145000"}
              className={adminInputClass}
            />
            {state.price > 0 && (
              <p className="text-[11px] text-slate-500 mt-1">
                {"Shown as"}{" "}
                <span className="font-bold text-slate-900">{formatPriceCompact(state.price)}</span>
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${type}Image`} className={E}>
              {n.short}
              {" image"}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 shrink-0 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                <img
                  src={state.image || n.image}
                  alt=""
                  className={
                    state.image
                      ? "w-full h-full object-cover"
                      : "w-4/5 h-4/5 object-contain opacity-60"
                  }
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <input
                  ref={ref}
                  id={`${type}Image`}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="block max-w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-bold"
                />
                {state.image && (
                  <button
                    type="button"
                    onClick={() => {
                      if (ref.current) {
                        ref.current.value = "";
                      }
                      setState((D) => ({
                        ...D,
                        image: "",
                      }));
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
                  >
                    Remove image
                  </button>
                )}
                <p className="text-[11px] text-slate-400">
                  {"Without an image, a "}
                  {n.short.toLowerCase()}
                  {" illustration is shown."}
                </p>
              </div>
            </div>
          </div>
        </div>
        <details
          className="group rounded-xl border border-slate-200 px-4 py-3"
          open={c || undefined}
        >
          <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-slate-900">
            <span>
              {"More details"}{" "}
              <span className="font-medium text-slate-400">
                (optional: model, condition, year, kms, fuel, city...)
              </span>
            </span>
            <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 transition group-open:rotate-180" />
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label htmlFor={`${type}Model`} className={E}>
                Model
              </label>
              <input
                id={`${type}Model`}
                list={`${type}ModelList`}
                value={state.model}
                onChange={m("model")}
                placeholder={
                  h.length
                    ? "Pick or type a model"
                    : `e.g. ${type === "car" ? "Creta" : "Pulsar 150"}`
                }
                className={adminInputClass}
              />
              <datalist id={`${type}ModelList`}>
                {h.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor={`${type}Condition`} className={E}>
                Condition
              </label>
              <select
                id={`${type}Condition`}
                value={state.condition}
                onChange={m("condition")}
                className={adminInputClass}
              >
                <option value="Used">Used</option>
                <option value="New">Brand new</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${type}Year`} className={E}>
                Year
              </label>
              <select
                id={`${type}Year`}
                value={state.year}
                onChange={m("year")}
                className={adminInputClass}
              >
                <option value="">Not set</option>
                {adminYearOptions.map((adminYearOption) => (
                  <option key={adminYearOption} value={adminYearOption}>
                    {adminYearOption}
                  </option>
                ))}
              </select>
            </div>
            {u && (
              <div>
                <label htmlFor={`${type}Km`} className={E}>
                  Kms driven
                </label>
                <input
                  id={`${type}Km`}
                  type="number"
                  min="0"
                  value={state.km}
                  onChange={m("km")}
                  placeholder="e.g. 18000"
                  className={adminInputClass}
                />
              </div>
            )}
            {u && (
              <div>
                <label htmlFor={`${type}Owners`} className={E}>
                  Owners
                </label>
                <select
                  id={`${type}Owners`}
                  value={state.owners}
                  onChange={m("owners")}
                  className={adminInputClass}
                >
                  {ownerOptions.map((ownerOption) => (
                    <option key={ownerOption} value={ownerOption}>
                      {ownerOption}
                      {" owner"}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor={`${type}Fuel`} className={E}>
                Fuel
              </label>
              <select
                id={`${type}Fuel`}
                value={state.fuel}
                onChange={m("fuel")}
                className={adminInputClass}
              >
                {fuelTypes.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${type}Gear`} className={E}>
                {type === "car" ? "Transmission" : "Gears"}
              </label>
              <select
                id={`${type}Gear`}
                value={state.transmission}
                onChange={m("transmission")}
                className={adminInputClass}
              >
                {transmissionTypes.map((transmissionType) => (
                  <option key={transmissionType} value={transmissionType}>
                    {type === "car"
                      ? transmissionType
                      : transmissionType === "Manual"
                        ? "Geared"
                        : "Gearless"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${type}City`} className={E}>
                City
              </label>
              <input
                id={`${type}City`}
                value={state.city}
                onChange={m("city")}
                placeholder="e.g. Bengaluru"
                className={adminInputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-3">
              <label htmlFor={`${type}Desc`} className={E}>
                Details
              </label>
              <textarea
                id={`${type}Desc`}
                rows={2}
                value={state.description}
                onChange={m("description")}
                placeholder="Service history, insurance, warranty, accessories..."
                className={adminInputClass}
              />
            </div>
          </div>
        </details>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 rounded-xl transition"
        >
          {c ? "Save Changes" : `Add ${n.short}`}
        </button>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">
          {"Added "}
          {n.tile}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {
            "Shown first on Buy Bikes & Cars as InstaCashMart Assured, and under their brand on the home page."
          }
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.length ? (
            items.map((item) => (
              <article
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl border border-slate-200 p-3 ${item.hidden ? "opacity-60" : ""}`}
              >
                <div className="w-20 h-16 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image || n.image}
                    alt=""
                    className={
                      item.image ? "w-full h-full object-cover" : "w-4/5 h-4/5 object-contain"
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 truncate">
                    {[
                      item.brand,
                      item.model,
                      item.condition === "New" ? "Brand new" : item.year,
                      item.city,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {formatPriceCompact(item.price)}{" "}
                    {item.hidden && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded-full align-middle">
                        Hidden
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => y(item)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => B(item)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900"
                  >
                    {item.hidden ? "Show" : "Hide"}
                  </button>
                  <button
                    type="button"
                    onClick={() => b(item)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-red-600 hover:border-red-300"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="md:col-span-2">
              <EmptyNote>
                {"No "}
                {n.tile.toLowerCase()}
                {" added yet. Use the form above."}
              </EmptyNote>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
