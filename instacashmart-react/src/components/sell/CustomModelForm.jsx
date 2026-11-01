import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  customBrandUrl,
  customModelUrl,
  findSellBrand,
  getSellConfig,
  sellBrandUrl,
} from "../../data/sellBrands";

const customInputClass =
  "w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500";

export function CustomModelForm({
  category,
  brand,
  initialBrand = "",
  initialModel = "",
  onClose,
}) {
  const r = getSellConfig(category);
  const o = brand?.name || "";
  const navigate = useNavigate();
  const [otherBrand, setOtherBrand] = useState(o || initialBrand);
  const [otherModel, setOtherModel] = useState(initialModel);
  const [errorMessage, setErrorMessage] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    var y;
    var b;
    if ((y = ref.current) != null) {
      y.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if ((b = ref.current) != null) {
      b.focus({
        preventScroll: true,
      });
    }
  }, []);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (o ? !otherModel.trim() : !otherBrand.trim()) {
      setErrorMessage(o ? "Enter your model name." : "Enter your brand name.");
      return;
    }
    if (brand) {
      navigate(customModelUrl(category, brand, otherModel));
      return;
    }
    const b = findSellBrand(category, otherBrand);
    navigate(b ? sellBrandUrl(category, b) : customBrandUrl(category, otherBrand));
  };
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-5 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            {o ? `Other ${o} model` : `Other ${r.noun} brand`}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Type it in and we'll confirm the best price after a quick check at pickup.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 shrink-0 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center text-xs transition"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 mt-4">
        {!o && (
          <div>
            <label
              htmlFor="otherBrand"
              className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1"
            >
              Brand name
            </label>
            <input
              id="otherBrand"
              ref={ref}
              type="text"
              value={otherBrand}
              onChange={(evt) => {
                setOtherBrand(evt.target.value);
                setErrorMessage("");
              }}
              placeholder="e.g. Lava, Micromax, Gigabyte"
              autoComplete="off"
              className={customInputClass}
            />
          </div>
        )}
        {o && (
          <div>
            <label
              htmlFor="otherModel"
              className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1"
            >
              Model name
            </label>
            <input
              id="otherModel"
              ref={ref}
              type="text"
              value={otherModel}
              onChange={(evt) => {
                setOtherModel(evt.target.value);
                setErrorMessage("");
              }}
              placeholder="As written on the box or in Settings → About"
              autoComplete="off"
              className={customInputClass}
            />
          </div>
        )}
      </div>
      {errorMessage && (
        <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
      >
        {"Continue "}
        <i className="fa-solid fa-arrow-right text-xs" />
      </button>
    </form>
  );
}
