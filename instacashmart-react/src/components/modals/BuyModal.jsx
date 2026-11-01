import { useEffect, useState } from "react";
import { ReviewForm, ReviewsPanel, ReviewsSummary } from "../reviews/ProductReviews";
import { CloseButton, Modal } from "../ui/Modal";
import { OptionTiles } from "../ui/OptionTiles";
import { ProductImage } from "../ui/ProductImage";
import { useApp } from "../../context/AppContext";
import { categoryLabel, sellerOf } from "../../data/accessories";
import { formatPrice } from "../../lib/format";
import { store } from "../../lib/store";

const paymentOptions = [
  {
    value: "cod",
    content: (
      <>
        <i className="fa-solid fa-money-bill-1-wave text-brand-600 mr-1" />
        {" Cash on Delivery"}
      </>
    ),
  },
];

const emptyOrder = {
  name: "",
  phone: "",
  address: "",
  pincode: "",
  payment: "cod",
};

const buyInputClass =
  "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500";

export function BuyModal() {
  const { modal, closeModal, buyProduct, showToast, openTrack } = useApp();
  const [form, setForm] = useState(emptyOrder);
  const [orderId, setOrderId] = useState("");
  const [flag, setFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const S = modal === "buy" && !!buyProduct;
  useEffect(() => {
    if (S) {
      setOrderId("");
      setFlag(false);
    }
  }, [S, buyProduct]);
  if (!S) {
    return null;
  }
  const y = (B) => (evt) =>
    setForm((R) => ({
      ...R,
      [B]: evt.target.value,
    }));
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const E = store.newId("CNB");
    setSaving(true);
    setErrorMessage("");
    try {
      await store.addAndWait("buy", {
        id: E,
        createdAt: new Date().toISOString(),
        product: buyProduct.name,
        category: categoryLabel(buyProduct.category),
        price: buyProduct.price,
        seller: sellerOf(buyProduct).name,
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        pincode: form.pincode.trim(),
        payment: form.payment,
        status: "New",
      });
    } catch (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setOrderId(E);
    showToast("Order placed! Delivery in 2-4 business days.");
  };
  return (
    <>
      <Modal open onClose={closeModal} className="max-w-xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              Secure Checkout
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Complete Your Order</h3>
          </div>
          <CloseButton onClick={closeModal} />
        </div>
        {orderId ? (
          <div className="text-center pt-8 pb-2">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
              <i className="fa-solid fa-check" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
              {"Order reference:"}{" "}
              <strong className="text-brand-700 font-mono font-bold">{orderId}</strong>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {"Your "}
              <span className="font-bold">{buyProduct.name}</span>
              {" will be delivered in 2-4 business days."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => openTrack(orderId)}
                className="px-5 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold rounded-xl hover:bg-brand-100 transition"
              >
                Track Order
              </button>
            </div>
            <div className="mt-6">
              <ReviewForm product={buyProduct} orderId={orderId} defaultName={form.name.trim()} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            {errorMessage && (
              <p role="alert" className="text-xs font-semibold text-red-700">
                {errorMessage}
              </p>
            )}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="shrink-0">
                <ProductImage
                  product={buyProduct}
                  boxClass="w-16 h-16 rounded-xl border border-slate-200"
                  iconClass="text-2xl"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {buyProduct.name}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {buyProduct.specs}
                  {" • "}
                  {buyProduct.grade}
                  {" condition"}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  You Pay
                </span>
                <span className="text-base font-extrabold text-brand-600">
                  {formatPrice(buyProduct.price)}
                </span>
              </div>
            </div>
            <details className="group rounded-2xl border border-slate-200 px-3.5 py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-900">
                <span>
                  <i className="fa-solid fa-star text-amber-400 mr-1" /> {"Customer reviews"}
                </span>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="mt-3">
                <ReviewsSummary product={buyProduct} onSeeAll={() => setFlag(true)} />
              </div>
            </details>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="buyName" className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="buyName"
                  type="text"
                  required
                  value={form.name}
                  onChange={y("name")}
                  placeholder="e.g. Rahul Verma"
                  className={buyInputClass}
                />
              </div>
              <div>
                <label htmlFor="buyPhone" className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  id="buyPhone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={y("phone")}
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  className={buyInputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label htmlFor="buyAddress" className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  id="buyAddress"
                  type="text"
                  required
                  value={form.address}
                  onChange={y("address")}
                  placeholder="House/Flat No, Street, Area..."
                  className={buyInputClass}
                />
              </div>
              <div>
                <label htmlFor="buyPincode" className="block text-xs font-bold text-slate-700 mb-1">
                  Pincode *
                </label>
                <input
                  id="buyPincode"
                  type="text"
                  required
                  value={form.pincode}
                  onChange={y("pincode")}
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className={buyInputClass}
                />
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</span>
              <OptionTiles
                name="buyPaymentMethod"
                options={paymentOptions}
                value={form.payment}
                onChange={(B) =>
                  setForm((E) => ({
                    ...E,
                    payment: B,
                  }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              <span>{saving ? "Saving…" : "Place Order"}</span>
              <i className="fa-solid fa-circle-check" />
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Free delivery • 6-month warranty • 15-day replacement guarantee.
            </p>
          </form>
        )}
      </Modal>
      {flag && <ReviewsPanel product={buyProduct} onClose={() => setFlag(false)} />}
    </>
  );
}
