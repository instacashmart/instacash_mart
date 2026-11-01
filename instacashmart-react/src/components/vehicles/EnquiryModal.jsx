import { useState } from "react";
import { DetailRows } from "../ui/DetailRows";
import { CloseButton, Modal } from "../ui/Modal";
import { OptionTiles } from "../ui/OptionTiles";
import { VehicleImage } from "./VehicleImage";
import { useApp } from "../../context/AppContext";
import { isUsedVehicle, sellerTypeOf, vehicleTitle } from "../../data/vehicles";
import { formatDate, formatPrice, formatPriceCompact, todayIso } from "../../lib/format";
import { store } from "../../lib/store";

const enquiryInputClass =
  "w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500";

export function EnquiryModal({ vehicle, onClose }) {
  const { showToast } = useApp();
  const label = vehicle.type === "car" ? "Test drive" : "Test ride";
  const r = [
    {
      value: "callback",
      label: "Call back",
      icon: "fa-phone",
    },
    {
      value: "test",
      label,
      icon: "fa-key",
    },
    {
      value: "offer",
      label: "Make offer",
      icon: "fa-indian-rupee-sign",
    },
  ];
  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "callback",
    date: "",
    offer: "",
    message: "",
  });
  const [textValue, setTextValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const h = (f) => (evt) =>
    setForm((y) => ({
      ...y,
      [f]: evt.target.value,
    }));
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const S = store.newId("CNL");
    setErrorMessage("");
    try {
      await store.addAndWait("vehicleLeads", {
        id: S,
        createdAt: new Date().toISOString(),
        vehicleId: vehicle.id,
        vehicle: `${vehicleTitle(vehicle)}${vehicle.variant ? ` ${vehicle.variant}` : ""}`,
        type: vehicle.type,
        price: vehicle.price,
        city: vehicle.city,
        seller: vehicle.sellerName,
        sellerPhone: vehicle.phone || "",
        name: form.name.trim(),
        phone: form.phone.trim(),
        purpose: r.find((item) => item.value === form.purpose).label,
        date: form.purpose === "test" ? form.date : "",
        offer: form.purpose === "offer" ? Number(form.offer) : "",
        message: form.message.trim(),
        status: "New",
      });
    } catch (error) {
      setErrorMessage(error.message);
      return;
    }
    setTextValue(S);
    showToast("Request sent! The seller will call you soon.");
  };
  return (
    <Modal open onClose={onClose} className="max-w-xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {sellerTypeOf(vehicle).label}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Contact Seller</h3>
        </div>
        <CloseButton onClick={onClose} />
      </div>
      <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
        <span className="shrink-0">
          <VehicleImage vehicle={vehicle} boxClass="w-16 h-16 rounded-xl border border-slate-200" />
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-slate-900 block truncate">
            {vehicleTitle(vehicle)}
          </span>
          <span className="text-[10px] text-slate-500 block truncate">
            {[vehicle.variant, vehicle.city].filter(Boolean).join(" • ")}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
            Price
          </span>
          <span className="text-base font-extrabold text-brand-600">
            {formatPriceCompact(vehicle.price)}
          </span>
        </div>
      </div>
      {textValue ? (
        <div className="text-center pt-8 pb-2">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
            <i className="fa-solid fa-check" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Request Sent!</h3>
          <p className="text-xs text-slate-500 mt-2">
            {"Reference:"}{" "}
            <strong className="text-brand-700 font-mono font-bold">{textValue}</strong>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {vehicle.sellerName}
            {" will call you on"}{" "}
            <span className="font-bold">
              {"+91 "}
              {form.phone}
            </span>
            {" within 24 hours"}
            {form.purpose === "test" && form.date && (
              <>
                {" "}
                {"to confirm your "}
                {label.toLowerCase()}
                {" on"} <span className="font-bold">{formatDate(form.date)}</span>
              </>
            )}
            {"."}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Keep Browsing
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {errorMessage && (
            <p role="alert" className="text-xs font-semibold text-red-700">
              {errorMessage}
            </p>
          )}
          <details className="group rounded-2xl border border-slate-200 px-3.5 py-3">
            <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-900">
              <span>
                <i className="fa-solid fa-circle-info text-slate-400 mr-1" /> {"Vehicle details"}
              </span>
              <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 transition group-open:rotate-180" />
            </summary>
            <DetailRows
              className="mt-3 space-y-2 text-xs text-slate-600"
              rows={[
                ["Brand", vehicle.brand],
                ["Model", vehicle.model],
                ["Condition", isUsedVehicle(vehicle) ? "Used" : "Brand new"],
                ["Year", vehicle.year ? String(vehicle.year) : ""],
                ...(isUsedVehicle(vehicle)
                  ? [
                      ["Kms driven", vehicle.km ? `${vehicle.km.toLocaleString("en-IN")} km` : ""],
                      ["Owners", vehicle.owners ? `${vehicle.owners} owner` : ""],
                    ]
                  : []),
                ["Fuel", vehicle.fuel],
                ["Transmission", vehicle.transmission],
                ["City", vehicle.city],
                ["Seller", vehicle.sellerName],
                ...(vehicle.description ? [["About", vehicle.description]] : []),
              ]}
            />
          </details>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="leadName" className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                id="leadName"
                type="text"
                required
                value={form.name}
                onChange={h("name")}
                placeholder="e.g. Rahul Verma"
                className={enquiryInputClass}
              />
            </div>
            <div>
              <label htmlFor="leadPhone" className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                id="leadPhone"
                type="tel"
                required
                value={form.phone}
                onChange={h("phone")}
                placeholder="10-digit number"
                pattern="[0-9]{10}"
                maxLength={10}
                className={enquiryInputClass}
              />
            </div>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-1">I want to *</span>
            <OptionTiles
              name="leadPurpose"
              value={form.purpose}
              onChange={(f) =>
                setForm((S) => ({
                  ...S,
                  purpose: f,
                }))
              }
              options={r.map((item) => ({
                value: item.value,
                content: (
                  <>
                    <i className={`fa-solid ${item.icon} block text-brand-600 mb-1`} />
                    {item.label}
                  </>
                ),
              }))}
            />
          </div>
          {form.purpose === "test" && (
            <div>
              <label htmlFor="leadDate" className="block text-xs font-bold text-slate-700 mb-1">
                {"Preferred "}
                {label.toLowerCase()}
                {" date *"}
              </label>
              <input
                id="leadDate"
                type="date"
                required
                min={todayIso()}
                value={form.date}
                onChange={h("date")}
                className={enquiryInputClass}
              />
            </div>
          )}
          {form.purpose === "offer" && (
            <div>
              <label htmlFor="leadOffer" className="block text-xs font-bold text-slate-700 mb-1">
                Your offer (₹) *
              </label>
              <input
                id="leadOffer"
                type="number"
                required
                min={1}
                step={500}
                value={form.offer}
                onChange={h("offer")}
                placeholder={`Asking ${formatPrice(vehicle.price)}`}
                className={enquiryInputClass}
              />
            </div>
          )}
          <div>
            <label htmlFor="leadMessage" className="block text-xs font-bold text-slate-700 mb-1">
              Message
            </label>
            <textarea
              id="leadMessage"
              rows={2}
              value={form.message}
              onChange={h("message")}
              placeholder="Best time to call, questions about service history..."
              className={enquiryInputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            <span>Send Request</span>
            <i className="fa-solid fa-paper-plane" />
          </button>
          <p className="text-[10px] text-center text-slate-400">
            Your number is shared only with this seller. Always inspect the vehicle and its papers
            before paying.
          </p>
        </form>
      )}
    </Modal>
  );
}
