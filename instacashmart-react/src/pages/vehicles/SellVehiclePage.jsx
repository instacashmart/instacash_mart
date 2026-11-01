import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BackToHome } from "../../components/ui/BackToHome";
import { OptionTiles } from "../../components/ui/OptionTiles";
import { useApp } from "../../context/AppContext";
import {
  estimateResale,
  fuelTypes,
  getVehicleType,
  ownerOptions,
  transmissionTypes,
  vehicleModels,
  vehicleTypes,
} from "../../data/vehicles";
import { formatPrice, formatPriceCompact } from "../../lib/format";
import { resizeImage } from "../../lib/resizeImage";
import { store } from "../../lib/store";

const CUSTOM_OPTION = "__other";

const sellVehicleInputClass =
  "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";

const sellVehicleLabelClass = "block text-xs font-bold text-slate-700 mb-1";

const yearOptions = Array.from(
  {
    length: 16,
  },
  (t, e) => new Date().getFullYear() - e,
);

const emptyListing = (t) => ({
  type: "bike",
  brand: "",
  customBrand: "",
  model: "",
  customModel: "",
  variant: "",
  year: "",
  km: "",
  fuel: "Petrol",
  transmission: "Manual",
  owners: "1st",
  city: t,
  price: "",
  description: "",
  name: "",
  phone: "",
  image: "",
});

function prefillFromParams(t) {
  if (!t.get("type") && !t.get("brand")) {
    return {};
  }
  const type = t.get("type") === "car" ? "car" : "bike";
  const customBrand = t.get("brand") || "";
  const customModel = t.get("model") || "";
  const brand = Object.keys(vehicleModels[type]).find(
    (item) => item.toLowerCase() === customBrand.toLowerCase(),
  );
  if (!customBrand) {
    return {
      type,
    };
  }
  if (!brand) {
    return {
      type,
      brand: CUSTOM_OPTION,
      customBrand,
      customModel,
    };
  }
  const r = Object.keys(vehicleModels[type][brand]).find(
    (item) => item.toLowerCase() === customModel.toLowerCase(),
  );
  return {
    type,
    brand,
    model: r || (customModel ? CUSTOM_OPTION : ""),
    customModel: r ? "" : customModel,
  };
}

const sellVehiclePerks = [
  ["fa-indian-rupee-sign", "Free listing", "No fee to post, no commission when it sells."],
  ["fa-users", "Real buyers", "Buyers send call-back, test ride and offer requests."],
  ["fa-shield-halved", "Number kept private", "Only buyers who send a request get to talk to you."],
];

export function SellVehiclePage() {
  const { city, showToast } = useApp();
  const [n] = useSearchParams();
  const [state, setState] = useState(() => ({
    ...emptyListing(city),
    phone: "",
    ...prefillFromParams(n),
  }));
  const [selected, setSelected] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const _ = (v) => (evt) =>
    setState((I) => ({
      ...I,
      [v]: evt.target.value,
    }));
  const f = (v) => (T) =>
    setState((I) => ({
      ...I,
      [v]: T,
    }));
  const S = Object.keys(vehicleModels[state.type]);
  const y =
    state.brand && state.brand !== CUSTOM_OPTION
      ? Object.keys(vehicleModels[state.type][state.brand])
      : [];
  const brand = state.brand === CUSTOM_OPTION ? state.customBrand.trim() : state.brand;
  const model =
    state.model === CUSTOM_OPTION || state.brand === CUSTOM_OPTION
      ? state.customModel.trim()
      : state.model;
  const E = estimateResale({
    type: state.type,
    brand,
    model,
    year: state.year,
    km: state.km,
    owners: state.owners,
  });
  const R = getVehicleType(state.type);
  const handleChange = (v) =>
    setState((T) => ({
      ...T,
      type: v,
      brand: "",
      model: "",
      customBrand: "",
      customModel: "",
      transmission: "Manual",
    }));
  const handleChange2 = async (evt) => {
    const T = evt.target.files[0];
    if (T) {
      try {
        const image = await resizeImage(T, 800);
        setState((A) => ({
          ...A,
          image,
        }));
      } catch {
        showToast("Could not read that photo. Try a JPG or PNG.");
      }
    }
  };
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!brand || !model) {
      showToast("Please choose the brand and model");
      return;
    }
    const T = {
      id: store.newId("CNV"),
      createdAt: new Date().toISOString(),
      status: "Pending",
      type: state.type,
      brand,
      model,
      variant: state.variant.trim(),
      year: Number(state.year),
      km: Number(state.km),
      fuel: state.fuel,
      transmission: state.transmission,
      owners: state.owners,
      city: state.city.trim(),
      price: Number(state.price),
      estimate: E?.mid || "",
      description: state.description.trim(),
      image: state.image,
      sellerType: "owner",
      sellerName: state.name.trim(),
      phone: state.phone.trim(),
    };
    setSaving(true);
    setErrorMessage("");
    try {
      await store.addAndWait("vehicles", T);
    } catch (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setSelected(T);
    window.scrollTo({
      top: 0,
    });
    showToast("Your listing was submitted for review.");
  };
  if (selected) {
    return (
      <main>
        <BackToHome />
        <section className="max-w-2xl mx-3 sm:mx-4 md:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fa-solid fa-check" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            {"Your "}
            {getVehicleType(selected.type).short.toLowerCase()}
            {" listing was submitted!"}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            <span className="font-bold">
              {selected.year} {selected.brand} {selected.model}
            </span>{" "}
            {"for "}
            <span className="font-bold">{formatPriceCompact(selected.price)}</span> {"in "}
            {selected.city}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {"Listing ID:"} <strong className="text-brand-700 font-mono">{selected.id}</strong>
            {" • We will review it before it appears publicly."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to={selected.type === "car" ? "/bikes-cars?type=car" : "/bikes-cars"}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Browse Listings
            </Link>
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setState({
                  ...emptyListing(city),
                  phone: state.phone,
                  name: state.name,
                });
              }}
              className="px-5 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold rounded-xl hover:bg-brand-100 transition"
            >
              Post another
            </button>
          </div>
        </section>
      </main>
    );
  } else {
    return (
      <main>
        <BackToHome />
        <div className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 grid lg:grid-cols-3 gap-4 items-start">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 space-y-5"
          >
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Sell Your Bike or Car
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Get an instant price estimate and submit your listing for review
              </p>
            </div>
            <div>
              <span className={sellVehicleLabelClass}>What are you selling? *</span>
              <OptionTiles
                name="vehicleType"
                columns="grid-cols-2"
                value={state.type}
                onChange={handleChange}
                tileClass="p-3 border border-slate-200 rounded-xl text-center text-sm font-bold text-slate-800"
                options={vehicleTypes.map((vehicleType) => ({
                  value: vehicleType.key,
                  content: (
                    <>
                      <i
                        className={`fa-solid ${vehicleType.icon} text-xl text-brand-600 block mb-1`}
                      />
                      {vehicleType.label}
                    </>
                  ),
                }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="vBrand" className={sellVehicleLabelClass}>
                  Brand *
                </label>
                <select
                  id="vBrand"
                  required
                  value={state.brand}
                  onChange={(evt) =>
                    setState((T) => ({
                      ...T,
                      brand: evt.target.value,
                      model: "",
                    }))
                  }
                  className={sellVehicleInputClass}
                >
                  <option value="">Select brand</option>
                  {S.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                  <option value={CUSTOM_OPTION}>Other brand</option>
                </select>
                {state.brand === CUSTOM_OPTION && (
                  <input
                    type="text"
                    required
                    value={state.customBrand}
                    onChange={_("customBrand")}
                    placeholder="Brand name"
                    aria-label="Brand name"
                    className={`${sellVehicleInputClass} mt-2`}
                  />
                )}
              </div>
              <div>
                <label htmlFor="vModel" className={sellVehicleLabelClass}>
                  Model *
                </label>
                {state.brand === CUSTOM_OPTION ? (
                  <input
                    id="vModel"
                    type="text"
                    required
                    value={state.customModel}
                    onChange={_("customModel")}
                    placeholder="Model name"
                    className={sellVehicleInputClass}
                  />
                ) : (
                  <>
                    <select
                      id="vModel"
                      required
                      value={state.model}
                      onChange={_("model")}
                      disabled={!state.brand}
                      className={`${sellVehicleInputClass} disabled:bg-slate-50 disabled:text-slate-400`}
                    >
                      <option value="">
                        {state.brand ? "Select model" : "Pick a brand first"}
                      </option>
                      {y.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      {state.brand && <option value={CUSTOM_OPTION}>Other model</option>}
                    </select>
                    {state.model === CUSTOM_OPTION && (
                      <input
                        type="text"
                        required
                        value={state.customModel}
                        onChange={_("customModel")}
                        placeholder="Model name"
                        aria-label="Model name"
                        className={`${sellVehicleInputClass} mt-2`}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="vVariant" className={sellVehicleLabelClass}>
                  Variant
                </label>
                <input
                  id="vVariant"
                  type="text"
                  value={state.variant}
                  onChange={_("variant")}
                  placeholder={state.type === "car" ? "e.g. ZXi, SX (O)" : "e.g. Signals, DLX"}
                  className={sellVehicleInputClass}
                />
              </div>
              <div>
                <label htmlFor="vYear" className={sellVehicleLabelClass}>
                  Year *
                </label>
                <select
                  id="vYear"
                  required
                  value={state.year}
                  onChange={_("year")}
                  className={sellVehicleInputClass}
                >
                  <option value="">Year</option>
                  {yearOptions.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vKm" className={sellVehicleLabelClass}>
                  Kms driven *
                </label>
                <input
                  id="vKm"
                  type="number"
                  required
                  min={0}
                  max={999999}
                  value={state.km}
                  onChange={_("km")}
                  placeholder="e.g. 25000"
                  className={sellVehicleInputClass}
                />
              </div>
            </div>
            <div>
              <span className={sellVehicleLabelClass}>Fuel *</span>
              <OptionTiles
                name="vFuel"
                columns="grid-cols-4"
                value={state.fuel}
                onChange={f("fuel")}
                options={fuelTypes.map((fuelType) => ({
                  value: fuelType,
                  content: fuelType,
                }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className={sellVehicleLabelClass}>
                  {state.type === "car" ? "Transmission *" : "Gears *"}
                </span>
                <OptionTiles
                  name="vTransmission"
                  columns="grid-cols-2"
                  value={state.transmission}
                  onChange={f("transmission")}
                  options={transmissionTypes.map((transmissionType) => ({
                    value: transmissionType,
                    content:
                      state.type === "bike" && transmissionType === "Automatic"
                        ? "Gearless"
                        : state.type === "bike"
                          ? "Geared"
                          : transmissionType,
                  }))}
                />
              </div>
              <div>
                <span className={sellVehicleLabelClass}>Ownership *</span>
                <OptionTiles
                  name="vOwners"
                  value={state.owners}
                  onChange={f("owners")}
                  options={ownerOptions.map((ownerOption) => ({
                    value: ownerOption,
                    content: `${ownerOption} owner`,
                  }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="vCity" className={sellVehicleLabelClass}>
                  City *
                </label>
                <input
                  id="vCity"
                  type="text"
                  required
                  value={state.city}
                  onChange={_("city")}
                  placeholder="e.g. Bengaluru"
                  className={sellVehicleInputClass}
                />
              </div>
              <div>
                <label htmlFor="vPrice" className={sellVehicleLabelClass}>
                  Your asking price (₹) *
                </label>
                <input
                  id="vPrice"
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={state.price}
                  onChange={_("price")}
                  placeholder={E ? `Suggested ${formatPrice(E.mid)}` : "e.g. 75000"}
                  className={sellVehicleInputClass}
                />
                {state.price > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    {"Shown to buyers as"}{" "}
                    <span className="font-bold text-slate-900">
                      {formatPriceCompact(state.price)}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="vDesc" className={sellVehicleLabelClass}>
                Description
              </label>
              <textarea
                id="vDesc"
                rows={3}
                value={state.description}
                onChange={_("description")}
                placeholder="Service history, insurance validity, new tyres, any scratches..."
                className={sellVehicleInputClass}
              />
            </div>
            <div>
              <span className={sellVehicleLabelClass}>Photo</span>
              <div className="flex items-center gap-3">
                {state.image ? (
                  <img
                    src={state.image}
                    alt="Your vehicle"
                    className="w-20 h-16 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <span className="w-20 h-16 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                    <i className={`fa-solid ${R.icon} text-2xl`} />
                  </span>
                )}
                <input
                  ref={ref}
                  type="file"
                  accept="image/*"
                  onChange={handleChange2}
                  className="sr-only"
                  id="vPhoto"
                />
                <label
                  htmlFor="vPhoto"
                  className="cursor-pointer px-4 py-2 rounded-full border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-900 transition"
                >
                  {state.image ? "Change photo" : "Add photo"}
                </label>
                {state.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setState((v) => ({
                        ...v,
                        image: "",
                      }));
                      ref.current.value = "";
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="vName" className={sellVehicleLabelClass}>
                  Your name *
                </label>
                <input
                  id="vName"
                  type="text"
                  required
                  value={state.name}
                  onChange={_("name")}
                  placeholder="e.g. Rahul Verma"
                  className={sellVehicleInputClass}
                />
              </div>
              <div>
                <label htmlFor="vPhone" className={sellVehicleLabelClass}>
                  Mobile number *
                </label>
                <input
                  id="vPhone"
                  type="tel"
                  required
                  value={state.phone}
                  onChange={_("phone")}
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className={sellVehicleInputClass}
                />
              </div>
            </div>
            {errorMessage && (
              <p role="alert" className="text-xs font-semibold text-red-700">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              <span>{saving ? "Saving…" : "Post Listing"}</span>
              <i className="fa-solid fa-arrow-right" />
            </button>
          </form>
          <aside className="lg:sticky lg:top-44 space-y-4">
            <div className="rounded-2xl bg-dark-900 text-white p-5 sm:p-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Instant estimate
              </span>
              {E ? (
                <>
                  <p className="text-2xl font-extrabold tracking-tight mt-2">
                    {formatPriceCompact(E.low)}
                    {" – "}
                    {formatPriceCompact(E.high)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {"Typical resale for a "}
                    {state.year} {brand} {model}
                    {state.km ? ` with ${Number(state.km).toLocaleString("en-IN")} km` : ""}
                    {", "}
                    {state.owners}
                    {" owner."}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setState((v) => ({
                        ...v,
                        price: String(E.mid),
                      }))
                    }
                    className="mt-4 w-full py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
                  >
                    {"Ask "}
                    {formatPrice(E.mid)}
                  </button>
                </>
              ) : (
                <p className="text-sm text-slate-300 mt-2">
                  {"Pick the brand, model and year to see what your"} {R.short.toLowerCase()}
                  {" is worth."}
                </p>
              )}
            </div>
            <ul className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              {sellVehiclePerks.map(([v, T, I]) => (
                <li key={T} className="flex gap-3">
                  <span className="w-9 h-9 shrink-0 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-sm">
                    <i className={`fa-solid ${v}`} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{T}</span>
                    <span className="block text-xs text-slate-500">{I}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to={state.type === "car" ? "/bikes-cars?type=car" : "/bikes-cars"}
              className="block text-center text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              {"Looking to buy instead? Browse "}
              {R.label.toLowerCase()} <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </aside>
        </div>
      </main>
    );
  }
}
