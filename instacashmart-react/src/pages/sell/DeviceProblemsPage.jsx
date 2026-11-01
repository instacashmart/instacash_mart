import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SimpleHeader, headerButtonClass } from "../../components/layout/SimpleHeader";
import { SELL_STEPS } from "../../data/deviceChecks";

const deviceProblems = {
  phone: [
    "Front Camera Not Working",
    "Back Camera Not Working",
    "Volume Button Not Working",
    "Power Button Not Working",
    "Silent Switch Not Working",
    "Finger Touch Not Working",
    "Face ID / Face Sensor Not Working",
    "Proximity Sensor Not Working",
    "Wi-Fi Not Working",
    "Bluetooth Not Working",
    "Battery Faulty",
    "Charging Port Not Working",
    "Speaker Not Working",
    "Audio Receiver (Earpiece) Not Working",
    "Microphone Not Working",
    "Vibrator Not Working",
    "Camera Glass Broken",
  ],
  tablet: [
    "Front Camera Not Working",
    "Back Camera Not Working",
    "Volume Button Not Working",
    "Power Button Not Working",
    "Fingerprint / Face ID Not Working",
    "SIM / Cellular Not Working",
    "Wi-Fi Not Working",
    "Bluetooth Not Working",
    "Battery Faulty",
    "Charging Port Not Working",
    "Speaker Not Working",
    "Microphone Not Working",
    "Camera Glass Broken",
  ],
  laptop: [
    "Keyboard Keys Not Working",
    "Trackpad Not Working",
    "Webcam Not Working",
    "Speaker Not Working",
    "Microphone Not Working",
    "Wi-Fi Not Working",
    "Bluetooth Not Working",
    "Battery Faulty",
    "Charging Port / Adapter Not Working",
    "USB Ports Not Working",
    "Hinge Broken / Loose",
    "Fingerprint Reader Not Working",
    "Overheating / Fan Noise",
  ],
  smartwatch: [
    "Touch Not Working",
    "Heart Rate Sensor Not Working",
    "GPS Not Working",
    "Bluetooth Not Working",
    "Battery Faulty",
    "Charging Not Working",
    "Buttons / Crown Not Working",
    "Speaker Not Working",
    "Microphone Not Working",
    "Vibration Not Working",
    "Strap Broken",
  ],
  earbuds: [
    "Left Earbud No Sound",
    "Right Earbud No Sound",
    "Microphone Not Working",
    "Noise Cancellation Not Working",
    "Bluetooth Pairing Problem",
    "Touch Controls Not Working",
    "Case Not Charging",
    "Case Lid / Hinge Broken",
    "Battery Drains Fast",
  ],
  console: [
    "Controller Drift",
    "Controller Buttons Not Working",
    "Disc Drive Not Working",
    "HDMI Port Not Working",
    "USB Ports Not Working",
    "Wi-Fi Not Working",
    "Bluetooth Not Working",
    "Storage / Update Error",
    "Overheating / Fan Noise",
    "Power Supply Faulty",
  ],
  camera: [
    "Autofocus Not Working",
    "Shutter Not Working",
    "Lens Scratched / Fungus",
    "LCD Screen Not Working",
    "Viewfinder Not Working",
    "Buttons / Dials Not Working",
    "Flash Not Working",
    "Memory Card Slot Not Working",
    "Wi-Fi / Bluetooth Not Working",
    "Sensor Dust / Spots",
    "Battery Faulty",
    "Battery Door Broken",
  ],
};

const problemsFor = (t) => deviceProblems[t] || deviceProblems.phone;

export function DeviceProblemsPage() {
  const [t] = useSearchParams();
  const navigate = useNavigate();
  const s = problemsFor(t.get("cat"));
  const [state, setState] = useState(() =>
    (t.get("problems") || "").split(", ").filter((item) => s.includes(item)),
  );
  useEffect(() => {
    document.title = "Functional or Physical Problems | InstaCashMart";
  }, []);
  const handleClick = () => {
    const o = new URLSearchParams(t);
    o.set("problems", state.join(", "));
    navigate(`/pickup?${o}`);
  };
  return (
    <>
      <SimpleHeader
        action={
          <Link
            to={`/device-check?${t}`}
            onClick={(evt) => {
              if (window.history.length > 1) {
                evt.preventDefault();
                navigate(-1);
              }
            }}
            className={headerButtonClass}
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Back</span>
          </Link>
        }
      />
      <main className="max-w-3xl mx-3 sm:mx-4 md:mx-auto mt-4 mb-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {"Step 3 of "}
            {SELL_STEPS}
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 mt-2">
            Functional or Physical Problems
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.get("model") ? `${t.get("model")} • ` : ""}
            {"Please select all applicable issues to receive an accurate quote."}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
            {s.map((item) => {
              const l = state.includes(item);
              return (
                <label
                  key={item}
                  className={`cursor-pointer flex flex-col gap-3 min-h-[84px] p-3 rounded-xl border text-xs font-semibold leading-snug transition ${l ? "border-brand-600 bg-brand-50/40 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-brand-500"}`}
                >
                  <input
                    type="checkbox"
                    checked={l}
                    onChange={() =>
                      setState((c) => (l ? c.filter((item2) => item2 !== item) : [...c, item]))
                    }
                    className="rounded border-slate-300 accent-brand-600"
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            No problems? Leave everything unticked and continue.
          </p>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-slate-400 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
            >
              {"Continue "}
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
