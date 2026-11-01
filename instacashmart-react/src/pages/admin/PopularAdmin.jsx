import { useRef, useState } from "react";
import { productCategories } from "../../data/accessories";
import { formatPrice } from "../../lib/format";
import { resizeImage } from "../../lib/resizeImage";
import { store } from "../../lib/store";
import { EmptyNote, adminInputClass } from "./shared";

const emptyPopular = {
  id: "",
  name: "",
  category: productCategories[0].key,
  price: "",
  mrp: "",
  image: "",
};

export function PopularAdmin({ popular, showToast }) {
  const [form, setForm] = useState(emptyPopular);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const o = !!form.id;
  const l = (y) => (evt) =>
    setForm((B) => ({
      ...B,
      [y]: evt.target.value,
    }));
  const handleClick = () => {
    setForm(emptyPopular);
    if (ref.current) {
      ref.current.value = "";
    }
  };
  const handleChange = async (evt) => {
    const b = evt.target.files && evt.target.files[0];
    if (b) {
      try {
        const image = await resizeImage(b);
        setForm((E) => ({
          ...E,
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
    setForm((y) => ({
      ...y,
      image: "",
    }));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const b = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      image: form.image.trim(),
    };
    if (
      !(o
        ? store.update("popular", form.id, b)
        : store.add("popular", {
            id: store.newId("PA"),
            createdAt: new Date().toISOString(),
            ...b,
          }))
    ) {
      showToast("Could not save: browser storage is full or blocked. Try a smaller photo.");
      return;
    }
    showToast(o ? "Popular accessory updated" : "Added to Popular Accessories");
    handleClick();
  };
  const h = (y) => {
    var b;
    setForm({
      id: y.id,
      name: y.name,
      category: y.category,
      price: y.price,
      mrp: y.mrp || "",
      image: y.image || "",
    });
    if (ref.current) {
      ref.current.value = "";
    }
    if ((b = ref2.current) != null) {
      b.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const _ = (y) => {
    if (window.confirm(`Remove "${y.name}" from Popular Accessories?`)) {
      store.remove("popular", y.id);
      if (form.id === y.id) {
        handleClick();
      }
      showToast("Removed from Popular Accessories");
    }
  };
  const handleClick3 = () => {
    if (
      window.confirm(
        "Restore the default top-rated accessories? This will replace your current list.",
      )
    ) {
      store.resetPopular();
      handleClick();
      showToast("Restored default popular accessories");
    }
  };
  const S = productCategories.find((productCategory) => productCategory.key === form.category);
  return (
    <section className="space-y-4">
      <form
        ref={ref2}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {o ? "Edit Popular Accessory" : "Add Popular Accessory"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Shown in the Popular accessories rail on the homepage. Customers can buy it from
              there.
            </p>
          </div>
          {o && (
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
            <label htmlFor="popularName" className="block text-xs font-bold text-slate-700 mb-1">
              Product name *
            </label>
            <input
              id="popularName"
              required
              value={form.name}
              onChange={l("name")}
              placeholder="e.g. Apple AirPods Pro (2nd Gen)"
              className={adminInputClass}
            />
          </div>
          <div>
            <label
              htmlFor="popularCategory"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Category *
            </label>
            <select
              id="popularCategory"
              required
              value={form.category}
              onChange={l("category")}
              className={adminInputClass}
            >
              {productCategories.map((productCategory) => (
                <option key={productCategory.key} value={productCategory.key}>
                  {productCategory.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="popularPrice" className="block text-xs font-bold text-slate-700 mb-1">
              Product price (₹) *
            </label>
            <input
              id="popularPrice"
              type="number"
              min="1"
              required
              value={form.price}
              onChange={l("price")}
              placeholder="e.g. 20999"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="popularMrp" className="block text-xs font-bold text-slate-700 mb-1">
              {"MRP (₹)"}{" "}
              <span className="text-[11px] text-slate-400 font-normal">
                (optional, shows % off)
              </span>
            </label>
            <input
              id="popularMrp"
              type="number"
              min="1"
              value={form.mrp}
              onChange={l("mrp")}
              placeholder="e.g. 24900"
              className={adminInputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="popularImage" className="block text-xs font-bold text-slate-700 mb-1">
            Product image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden text-slate-400">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className={`fa-solid ${S ? S.icon : "fa-image"} text-2xl`} />
              )}
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <input
                ref={ref}
                id="popularImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block max-w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-bold"
              />
              <input
                type="text"
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={l("image")}
                aria-label="Image URL"
                placeholder="Or paste direct image URL (e.g. https://...)"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleClick2}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
              >
                Remove photo
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 rounded-xl transition"
        >
          {o ? "Save Changes" : "Add to Popular Accessories"}
        </button>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Current Popular Accessories</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Shown on the homepage in this order. Use the arrows to reorder.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClick3}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 transition"
          >
            <i className="fa-solid fa-rotate-left text-[11px]" />
            {"Restore Defaults"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popular.length ? (
            popular.map((item, index) => {
              const B = productCategories.find(
                (productCategory) => productCategory.key === item.category,
              );
              return (
                <article
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
                >
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => store.move("popular", item.id, -1)}
                      aria-label="Move up"
                      className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-chevron-up text-[10px]" />
                    </button>
                    <button
                      type="button"
                      disabled={index === popular.length - 1}
                      onClick={() => store.move("popular", item.id, 1)}
                      aria-label="Move down"
                      className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <i className="fa-solid fa-chevron-down text-[10px]" />
                    </button>
                  </div>
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <i className={`fa-solid ${B ? B.icon : "fa-box"} text-xl text-slate-500`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {B ? B.label : item.category}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {formatPrice(item.price)}{" "}
                      {item.mrp && Number(item.mrp) > Number(item.price) && (
                        <span className="text-[11px] font-medium text-slate-400 line-through">
                          {formatPrice(item.mrp)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => h(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => _(item)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-red-600 hover:border-red-300"
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
                No popular accessories. The homepage rail is hidden until you add one or restore the
                defaults.
              </EmptyNote>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
