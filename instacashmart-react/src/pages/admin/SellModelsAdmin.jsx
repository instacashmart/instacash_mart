import { useRef, useState } from "react";
import { brandName } from "../../data/sellBrands";
import { deviceCatalog, sellCategories } from "../../data/sellCatalog";
import { baseModelsFor, deviceImage } from "../../data/sellModels";
import { formatPrice } from "../../lib/format";
import { resizeImage } from "../../lib/resizeImage";
import { store } from "../../lib/store";
import { EmptyNote, adminInputClass } from "./shared";

const emptySellModel = {
  id: "",
  name: "",
  series: "",
  base: "",
  image: "",
};

export function SellModelsAdmin({ adminModels: adminModels2, showToast }) {
  const [smCategory, setSmCategory] = useState("phone");
  const [smBrand, setSmBrand] = useState(deviceCatalog.phone.brands[0]);
  const [form, setForm] = useState(emptySellModel);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const m = (A) => (evt) =>
    setForm((P) => ({
      ...P,
      [A]: evt.target.value,
    }));
  const brands = deviceCatalog[smCategory].brands;
  const h = deviceCatalog[smCategory].models[smBrand] || [];
  const _ = baseModelsFor(smCategory, smBrand);
  const f = [
    ...new Set(
      adminModels2
        .filter((item) => item.category === smCategory && item.brand === smBrand)
        .map((item) => {
          var F;
          if ((F = item.series) == null) {
            return undefined;
          } else {
            return F.trim();
          }
        })
        .filter(Boolean),
    ),
  ];
  const S = (A) => _.some((item) => item.name.toLowerCase() === String(A).trim().toLowerCase());
  const y = (A) =>
    adminModels2.find(
      (item) =>
        item.category === smCategory &&
        item.brand === smBrand &&
        item.name.toLowerCase() === String(A).trim().toLowerCase(),
    );
  const handleClick = () => {
    setForm(emptySellModel);
    if (ref.current) {
      ref.current.value = "";
    }
  };
  const B = (A) => {
    setSmCategory(A);
    setSmBrand(deviceCatalog[A].brands[0]);
    handleClick();
  };
  const handleChange = async (evt) => {
    const F = evt.target.files && evt.target.files[0];
    if (F) {
      try {
        const image = await resizeImage(F, 400);
        setForm((te) => ({
          ...te,
          image,
        }));
      } catch {
        showToast("Could not read that image.");
      }
    }
  };
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const name2 = form.name.trim();
    const base = Number(form.base);
    if (!name2 || !base) {
      return;
    }
    const te = {
      category: smCategory,
      brand: smBrand,
      name: name2,
      series: form.series.trim(),
      base,
      image: form.image.trim(),
    };
    const De = form.id ? adminModels2.find((item) => item.id === form.id) : y(name2);
    try {
      if (De) {
        await store.updateAndWait("sellModels", De.id, te);
      } else {
        await store.addAndWait("sellModels", {
          id: store.newId("SM"),
          createdAt: new Date().toISOString(),
          ...te,
        });
      }
    } catch (error) {
      showToast(`Could not save: ${error.message}`);
      return;
    }
    showToast(
      S(name2) ? `${name2} updated` : `${name2} added to ${brandName(smCategory, smBrand)}`,
    );
    handleClick();
  };
  const D = (A) => {
    var P;
    const F = A.adminId ? adminModels2.find((item) => item.id === A.adminId) : null;
    setForm({
      id: F?.id || "",
      name: A.name,
      series: A.series || "",
      base: A.base,
      image: F?.image || "",
    });
    if (ref.current) {
      ref.current.value = "";
    }
    if ((P = ref2.current) != null) {
      P.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const O = (A) => {
    const F = S(A.name);
    if (
      window.confirm(
        F
          ? `Undo your changes to ${A.name}? It goes back to its original price and photo.`
          : `Remove ${A.name} from the sell pages?`,
      )
    ) {
      store.remove("sellModels", A.adminId);
      if (form.id === A.adminId) {
        handleClick();
      }
      showToast(F ? `${A.name} restored` : `${A.name} removed`);
    }
  };
  const C = form.image || (form.name.trim() ? deviceImage(smCategory, form.name, smBrand) : "");
  const v = form.name.trim() && (form.id || S(form.name));
  return (
    <section className="space-y-4">
      <form
        ref={ref2}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {v ? "Edit Sell Model" : "Add Sell Model"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Shows on the brand page, in the Sell calculator and in search. Using an existing
              model's name updates its price and photo.
            </p>
          </div>
          {form.name && (
            <button
              type="button"
              onClick={handleClick}
              className="shrink-0 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="smCategory" className="block text-xs font-bold text-slate-700 mb-1">
              Device type *
            </label>
            <select
              id="smCategory"
              value={smCategory}
              onChange={(evt) => B(evt.target.value)}
              className={adminInputClass}
            >
              {sellCategories
                .filter((sellCategory) => deviceCatalog[sellCategory.key])
                .map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.short}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="smBrand" className="block text-xs font-bold text-slate-700 mb-1">
              Brand *
            </label>
            <select
              id="smBrand"
              value={smBrand}
              onChange={(evt) => {
                setSmBrand(evt.target.value);
                handleClick();
              }}
              className={adminInputClass}
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brandName(smCategory, brand)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="smName" className="block text-xs font-bold text-slate-700 mb-1">
              Model name *
            </label>
            <input
              id="smName"
              required
              list="smExisting"
              value={form.name}
              onChange={m("name")}
              placeholder={`e.g. ${h[0]?.name || "Model name"}`}
              className={adminInputClass}
            />
            <datalist id="smExisting">
              {_.map((item) => (
                <option key={item.name} value={item.name} />
              ))}
            </datalist>
            {form.name.trim() && (
              <p
                className={`text-[11px] mt-1 ${S(form.name) ? "text-amber-700" : "text-brand-700"}`}
              >
                {S(form.name)
                  ? "Existing model: saving changes its price and photo."
                  : "New model: it will be added to this brand."}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="smSeries" className="block text-xs font-bold text-slate-700 mb-1">
              Series
            </label>
            <input
              id="smSeries"
              list="smExistingSeries"
              value={form.series}
              onChange={m("series")}
              placeholder="e.g. iPhone Pro, Galaxy S"
              className={adminInputClass}
            />
            <datalist id="smExistingSeries">
              {f.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <p className="text-[11px] text-slate-400 mt-1">
              Optional. Models with this label appear under its series for this brand.
            </p>
          </div>
          <div>
            <label htmlFor="smBase" className="block text-xs font-bold text-slate-700 mb-1">
              Max buyback price (₹) *
            </label>
            <input
              id="smBase"
              type="number"
              min="1"
              required
              value={form.base}
              onChange={m("base")}
              placeholder="e.g. 45000"
              className={adminInputClass}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Shown as "Get up to" for a flawless device; the calculator adjusts for condition.
            </p>
          </div>
        </div>
        <div>
          <label htmlFor="smImage" className="block text-xs font-bold text-slate-700 mb-1">
            Model photo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 shrink-0 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden p-1.5 text-slate-400">
              {C ? (
                <img src={C} alt="" className="w-full h-full object-contain" />
              ) : (
                <i className="fa-regular fa-image text-2xl" />
              )}
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <input
                ref={ref}
                id="smImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block max-w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-bold"
              />
              <input
                type="text"
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={m("image")}
                aria-label="Image URL"
                placeholder="Or paste an image link (https://...)"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400">
                {form.image ? (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((A) => ({
                        ...A,
                        image: "",
                      }));
                      if (ref.current) {
                        ref.current.value = "";
                      }
                    }}
                    className="font-bold text-slate-500 hover:text-slate-900"
                  >
                    Remove uploaded photo
                  </button>
                ) : (
                  "Without an upload, the current photo (or the device-type photo) is used."
                )}
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 rounded-xl transition"
        >
          {v ? "Save Changes" : "Add Model"}
        </button>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">
          {brandName(smCategory, smBrand)}{" "}
          {sellCategories
            .find((sellCategory) => sellCategory.key === smCategory)
            ?.short.toLowerCase()}
          {" models"} <span className="text-xs font-semibold text-slate-400">{h.length}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          In the order customers see them. Tap Edit to change a price or photo.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {h.length ? (
            h.map((item) => (
              <article
                key={item.name}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
              >
                <span className="w-14 h-14 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1">
                  <img
                    src={deviceImage(smCategory, item.name, smBrand)}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {"Up to"}{" "}
                    <span className="font-extrabold text-brand-700">{formatPrice(item.base)}</span>
                  </p>
                  {item.series && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {"Series: "}
                      {item.series}
                    </p>
                  )}
                  {item.adminId && (
                    <span
                      className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${S(item.name) ? "bg-amber-50 text-amber-700" : "bg-brand-50 text-brand-700"}`}
                    >
                      {S(item.name) ? "Edited" : "Added by you"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => D(item)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900"
                  >
                    Edit
                  </button>
                  {item.adminId && (
                    <button
                      type="button"
                      onClick={() => O(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-red-600 hover:border-red-300"
                    >
                      {S(item.name) ? "Undo" : "Delete"}
                    </button>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="md:col-span-2">
              <EmptyNote>No models for this brand yet. Add one with the form above.</EmptyNote>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
