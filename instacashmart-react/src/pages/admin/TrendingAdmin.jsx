import { useRef, useState } from "react";
import { categoryImages, deviceCategories } from "../../data/site";
import { formatPrice } from "../../lib/format";
import { resizeImage } from "../../lib/resizeImage";
import { store } from "../../lib/store";
import { EmptyNote, adminInputClass } from "./shared";

const emptyTrending = {
  id: "",
  name: "",
  category: "phone",
  brand: "",
  model: "",
  specs: "",
  price: "",
  badge: "🔥 Hot Selling",
  image: "",
};

const trendingBrands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Redmi",
  "POCO",
  "Vivo",
  "Oppo",
  "Realme",
  "Motorola",
  "Nothing",
  "Google",
  "Sony",
  "PlayStation",
  "Nintendo",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "MSI",
  "Bose",
  "JBL",
  "boAt",
  "Nikon",
  "Canon",
  "Fujifilm",
];

const trendingBadges = [
  {
    label: "🔥 Hot Selling",
    badgeClass: "text-amber-700 bg-amber-50",
  },
  {
    label: "💎 High Value",
    badgeClass: "text-brand-700 bg-brand-50",
  },
  {
    label: "⚡ Top Resale",
    badgeClass: "text-emerald-700 bg-emerald-50",
  },
  {
    label: "💻 Top Laptop",
    badgeClass: "text-slate-900 bg-slate-100",
  },
  {
    label: "🎮 Gaming",
    badgeClass: "text-purple-700 bg-purple-50",
  },
  {
    label: "⭐ Best Seller",
    badgeClass: "text-blue-700 bg-blue-50",
  },
];

export function TrendingAdmin({ trending, showToast }) {
  const [form, setForm] = useState(emptyTrending);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const o = !!form.id;
  const l = (B) => (evt) =>
    setForm((R) => ({
      ...R,
      [B]: evt.target.value,
    }));
  const handleClick = () => {
    setForm(emptyTrending);
    if (ref.current) {
      ref.current.value = "";
    }
  };
  const handleChange = async (evt) => {
    const E = evt.target.files && evt.target.files[0];
    if (E) {
      try {
        const image = await resizeImage(E, 600);
        setForm((D) => ({
          ...D,
          image,
        }));
      } catch {
        showToast("Could not read that image.");
      }
    }
  };
  const handleClick2 = () => {
    if (ref.current) {
      ref.current.value = "";
    }
    setForm((B) => ({
      ...B,
      image: "",
    }));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name2 = form.name.trim();
    if (!name2) {
      showToast("Please enter a product name");
      return;
    }
    const cat = form.category || "phone";
    const brand = form.brand.trim() || "Other";
    const model = form.model.trim() || name2;
    const price = Number(form.price);
    if (!price || price <= 0) {
      showToast("Please enter a valid price");
      return;
    }
    const v = trendingBadges.find((trendingBadge) => trendingBadge.label === form.badge.trim());
    const badgeClass = v ? v.badgeClass : "text-amber-700 bg-amber-50";
    const I = deviceCategories.find((deviceCategory) => deviceCategory.key === cat);
    const icon = I?.icon || "fa-mobile-screen";
    const F = {
      name: name2,
      cat,
      category: cat,
      brand,
      model,
      specs: form.specs.trim(),
      price,
      badge: form.badge.trim(),
      badgeClass,
      image: form.image.trim(),
      icon,
    };
    if (
      !(o
        ? store.update("trending", form.id, F)
        : store.add("trending", {
            id: store.newId("TD"),
            createdAt: new Date().toISOString(),
            ...F,
          }))
    ) {
      showToast("Could not save: browser storage is full or blocked. Try a smaller photo.");
      return;
    }
    showToast(o ? "Trending device updated" : "Device added to Trending Devices");
    handleClick();
  };
  const h = (B) => {
    var E;
    setForm({
      id: B.id || "",
      name: B.name || "",
      category: B.cat || B.category || "phone",
      brand: B.brand || "",
      model: B.model || "",
      specs: B.specs || "",
      price: B.price || "",
      badge: B.badge || "🔥 Hot Selling",
      image: B.image || "",
    });
    if (ref.current) {
      ref.current.value = "";
    }
    if ((E = ref2.current) != null) {
      E.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const _ = (B) => {
    if (window.confirm(`Delete "${B.name}" from Trending Devices?`)) {
      store.remove("trending", B.id);
      if (form.id === B.id) {
        handleClick();
      }
      showToast("Device removed from Trending");
    }
  };
  const handleClick3 = () => {
    if (
      window.confirm("Restore default 4 trending devices? This will replace your current list.")
    ) {
      store.resetTrending();
      handleClick();
      showToast("Restored default trending devices");
    }
  };
  const S = deviceCategories.find(
    (deviceCategory) => deviceCategory.key === (form.category || "phone"),
  );
  const y = categoryImages[form.category || "phone"];
  const b = form.image || y;
  return (
    <section className="space-y-4">
      <form
        ref={ref2}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {o ? "Edit Trending Device" : "Add Trending Device"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              High-demand models shown on the homepage with highest resale quote values.
            </p>
          </div>
          {o && (
            <button
              type="button"
              onClick={handleClick}
              className="self-start sm:self-auto text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition"
            >
              Cancel edit
            </button>
          )}
        </div>
        <datalist id="brand-suggestions">
          {trendingBrands.map((trendingBrand) => (
            <option key={trendingBrand} value={trendingBrand} />
          ))}
        </datalist>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="trendingName" className="block text-xs font-bold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              id="trendingName"
              required
              value={form.name}
              onChange={l("name")}
              placeholder="e.g. Apple iPhone 16 Pro Max, Samsung Galaxy S24 Ultra"
              className={adminInputClass}
            />
          </div>
          <div>
            <label
              htmlFor="trendingCategory"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Device Category *
            </label>
            <select
              id="trendingCategory"
              required
              value={form.category}
              onChange={l("category")}
              className={adminInputClass}
            >
              {deviceCategories.map((deviceCategory) => (
                <option key={deviceCategory.key} value={deviceCategory.key}>
                  {deviceCategory.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="trendingBrand" className="block text-xs font-bold text-slate-700 mb-1">
              Brand *
            </label>
            <input
              id="trendingBrand"
              required
              list="brand-suggestions"
              value={form.brand}
              onChange={l("brand")}
              placeholder="e.g. Apple, Samsung, Sony, OnePlus"
              className={adminInputClass}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="trendingPrice" className="block text-xs font-bold text-slate-700">
                Resale Price (₹) *
              </label>
              {form.price && Number(form.price) > 0 && (
                <span className="text-xs font-bold text-brand-600">
                  {"Preview: Get Up To "}
                  {formatPrice(form.price)}
                </span>
              )}
            </div>
            <input
              id="trendingPrice"
              type="number"
              min="1"
              required
              value={form.price}
              onChange={l("price")}
              placeholder="e.g. 84500"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="trendingSpecs" className="block text-xs font-bold text-slate-700 mb-1">
              Short Specs
            </label>
            <input
              id="trendingSpecs"
              value={form.specs}
              onChange={l("specs")}
              placeholder="e.g. 256 GB / 512 GB / 1 TB or 16GB RAM • 512GB"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="trendingModel" className="block text-xs font-bold text-slate-700 mb-1">
              {"Model Identifier"}{" "}
              <span className="text-[11px] text-slate-400 font-normal">
                (for calculator link, optional)
              </span>
            </label>
            <input
              id="trendingModel"
              value={form.model}
              onChange={l("model")}
              placeholder="e.g. iPhone 16 Pro Max (defaults to product name)"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="trendingBadge" className="block text-xs font-bold text-slate-700 mb-1">
              Highlight Badge
            </label>
            <input
              id="trendingBadge"
              value={form.badge}
              onChange={l("badge")}
              placeholder="e.g. 🔥 Hot Selling, High Value"
              className={adminInputClass}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {trendingBadges.map((trendingBadge) => (
                <button
                  key={trendingBadge.label}
                  type="button"
                  onClick={() =>
                    setForm((E) => ({
                      ...E,
                      badge: trendingBadge.label,
                    }))
                  }
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${form.badge === trendingBadge.label ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}
                >
                  {trendingBadge.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-2">Product Image</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden p-2">
              {b ? (
                <img src={b} alt="Product preview" className="w-full h-full object-contain" />
              ) : (
                <i className={`fa-solid ${S?.icon || "fa-image"} text-3xl text-slate-400`} />
              )}
            </div>
            <div className="space-y-2 flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <input
                  ref={ref}
                  id="trendingPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="block max-w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-bold hover:file:bg-slate-800 cursor-pointer"
                />
                {form.image && (
                  <button
                    type="button"
                    onClick={handleClick2}
                    className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 rounded-lg border border-red-200 bg-red-50"
                  >
                    Remove custom photo
                  </button>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={form.image}
                  onChange={l("image")}
                  placeholder="Or paste direct image URL (e.g. https://...)"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {
                  "Upload a transparent or white background product photo for best presentation on the homepage. If left empty, the"
                }{" "}
                {S?.label || "device"}
                {" category image will be displayed."}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
          >
            {o ? "Save Changes" : "Add Trending Device"}
          </button>
          {o && (
            <button
              type="button"
              onClick={handleClick}
              className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Current Trending Devices</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                {trending.length}
                {" live"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              These devices are featured on the homepage in high-demand resale value section.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClick3}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 transition"
          >
            <i className="fa-solid fa-rotate-left text-[11px]" />
            {"Restore Default Devices"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trending.length ? (
            trending.map((item) => {
              const E = deviceCategories.find(
                (deviceCategory) => deviceCategory.key === (item.cat || item.category),
              );
              const R = categoryImages[item.cat || item.category];
              const D = item.image || R;
              return (
                <article
                  key={item.id || item.name}
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-200 p-3.5 hover:border-brand-300 transition bg-white"
                >
                  <div className="w-20 h-20 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1.5">
                    {D ? (
                      <img src={D} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <i
                        className={`fa-solid ${item.icon || "fa-mobile-screen"} text-2xl text-slate-400`}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.brand}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                        {E?.label || item.cat || item.category}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeClass || "text-amber-700 bg-amber-50"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.specs || `${item.brand} • ${item.model || item.name}`}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[11px] text-slate-400">Get Up To</span>
                      <span className="text-sm font-extrabold text-brand-600">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => h(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => _(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-red-600 hover:border-red-300 hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="md:col-span-2">
              <EmptyNote>
                No trending devices configured. Add one with the form above or click "Restore
                Default Devices".
              </EmptyNote>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
