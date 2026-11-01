import { useEffect, useState } from "react";
import { CloseButton, Modal } from "../ui/Modal";
import { useApp } from "../../context/AppContext";
import { serviceCities } from "../../data/site";

export function CityModal() {
  const { modal, closeModal, setCity } = useApp();
  const [textValue, setTextValue] = useState("");
  useEffect(() => {
    if (modal === "city") {
      setTextValue("");
    }
  }, [modal]);
  const r = textValue.trim();
  const o = serviceCities.filter((serviceCity) =>
    serviceCity.name.toLowerCase().includes(r.toLowerCase()),
  );
  return (
    <Modal
      open={modal === "city"}
      onClose={closeModal}
      className="max-w-lg p-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Select Your Pickup City</h3>
          <p className="text-xs text-slate-500">
            Pick your city for free same-day doorstep inspection
          </p>
        </div>
        <CloseButton onClick={closeModal} />
      </div>
      <div className="mt-4 relative">
        <input
          type="text"
          value={textValue}
          onChange={(evt) => setTextValue(evt.target.value)}
          autoFocus
          placeholder="Search your city or pin code..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        />
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs" />
      </div>
      <div className="mt-5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Popular Metros
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {o.length ? (
            o.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setCity(item.name)}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 text-center transition flex flex-col items-center text-xs font-semibold text-slate-800"
              >
                <i className={`fa-solid ${item.icon} text-brand-600 text-sm mb-1`} />
                <span>{item.name}</span>
              </button>
            ))
          ) : (
            <div className="col-span-full p-4 text-xs text-slate-400 text-center">
              {"Service is available in all pincodes!"}{" "}
              <button
                type="button"
                onClick={() => setCity(r)}
                className="font-bold text-brand-600 hover:underline"
              >
                {"Proceed with “"}
                {r}
                {"”"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
