import { useRef, useState } from "react";
import { productCategories } from "../../data/accessories";
import { formatPrice } from "../../lib/format";
import { resizeImage } from "../../lib/resizeImage";
import { store } from "../../lib/store";
import { EmptyNote, adminInputClass } from "./shared";

const emptyProduct = {
  id: "",
  name: "",
  category: productCategories[0].key,
  brand: "",
  specs: "",
  price: "",
  mrp: "",
  image: "",
};

export function ProductsAdmin({ products, showToast }) {
  const [form, setForm] = useState(emptyProduct);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const o = !!form.id;
  const l = (f) => (evt) =>
    setForm((y) => ({
      ...y,
      [f]: evt.target.value,
    }));
  const handleClick = () => {
    setForm(emptyProduct);
    if (ref.current) {
      ref.current.value = "";
    }
  };
  const handleChange = async (evt) => {
    const S = evt.target.files && evt.target.files[0];
    if (S) {
      try {
        const image = await resizeImage(S);
        setForm((b) => ({
          ...b,
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
    setForm((f) => ({
      ...f,
      image: "",
    }));
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const S = {
      name: form.name.trim(),
      category: form.category,
      brand: form.brand.trim(),
      specs: form.specs.trim(),
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      image: form.image,
    };
    if (
      !(o
        ? store.update("products", form.id, S)
        : store.add("products", {
            id: store.newId("P"),
            createdAt: new Date().toISOString(),
            ...S,
          }))
    ) {
      showToast("Could not save: browser storage is full or blocked. Try a smaller photo.");
      return;
    }
    showToast(o ? "Product updated" : "Product added to Buy Accessories");
    handleClick();
  };
  const h = (f) => {
    var S;
    setForm({
      id: f.id,
      name: f.name,
      category: f.category,
      brand: f.brand,
      specs: f.specs || "",
      price: f.price,
      mrp: f.mrp || "",
      image: f.image || "",
    });
    if (ref.current) {
      ref.current.value = "";
    }
    if ((S = ref2.current) != null) {
      S.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const _ = (f) => {
    if (window.confirm(`Delete "${f.name}"?`)) {
      store.remove("products", f.id);
      if (form.id === f.id) {
        handleClick();
      }
      showToast("Product deleted");
    }
  };
  return (
    <section className="space-y-4">
      <form
        ref={ref2}
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">
            {o ? "Edit Product" : "Add Product"}
          </h2>
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
          <div>
            <label htmlFor="productName" className="block text-xs font-bold text-slate-700 mb-1">
              Product name *
            </label>
            <input
              id="productName"
              required
              value={form.name}
              onChange={l("name")}
              placeholder="e.g. Anker 65W GaN Charger"
              className={adminInputClass}
            />
          </div>
          <div>
            <label
              htmlFor="productCategory"
              className="block text-xs font-bold text-slate-700 mb-1"
            >
              Category *
            </label>
            <select
              id="productCategory"
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
            <label htmlFor="productBrand" className="block text-xs font-bold text-slate-700 mb-1">
              Brand *
            </label>
            <input
              id="productBrand"
              required
              value={form.brand}
              onChange={l("brand")}
              placeholder="e.g. Anker"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="productSpecs" className="block text-xs font-bold text-slate-700 mb-1">
              Short specs
            </label>
            <input
              id="productSpecs"
              value={form.specs}
              onChange={l("specs")}
              placeholder="e.g. 65 W • USB-C • GaN"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="productPrice" className="block text-xs font-bold text-slate-700 mb-1">
              Selling price (₹) *
            </label>
            <input
              id="productPrice"
              type="number"
              min="1"
              required
              value={form.price}
              onChange={l("price")}
              placeholder="e.g. 2499"
              className={adminInputClass}
            />
          </div>
          <div>
            <label htmlFor="productMrp" className="block text-xs font-bold text-slate-700 mb-1">
              MRP (₹)
            </label>
            <input
              id="productMrp"
              type="number"
              min="1"
              value={form.mrp}
              onChange={l("mrp")}
              placeholder="e.g. 3999"
              className={adminInputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="productImage" className="block text-xs font-bold text-slate-700 mb-1">
            Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden text-slate-400">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className="fa-regular fa-image text-2xl" />
              )}
            </div>
            <div className="space-y-1.5 min-w-0">
              <input
                ref={ref}
                id="productImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block max-w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-xs file:font-bold"
              />
              <button
                type="button"
                onClick={handleClick2}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
              >
                Remove photo
              </button>
              <p className="text-[11px] text-slate-400">
                Without a photo, the category icon is shown.
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 rounded-xl transition"
        >
          {o ? "Save Changes" : "Add Product"}
        </button>
      </form>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">Added Products</h2>
        <p className="text-xs text-slate-500 mt-0.5">These appear in Buy Accessories.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.length ? (
            products.map((product) => {
              const S = productCategories.find(
                (productCategory) => productCategory.key === product.category,
              );
              return (
                <article
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"
                >
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <i className={`fa-solid ${S ? S.icon : "fa-box"} text-xl text-slate-500`} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{product.name}</h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {product.brand}
                      {" • "}
                      {S ? S.label : product.category}
                      {product.specs ? ` • ${product.specs}` : ""}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {formatPrice(product.price)}{" "}
                      {product.mrp && Number(product.mrp) > Number(product.price) && (
                        <span className="text-[11px] font-medium text-slate-400 line-through">
                          {formatPrice(product.mrp)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => h(product)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => _(product)}
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
              <EmptyNote>No products added yet. Use the form above.</EmptyNote>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
