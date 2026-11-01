import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SimpleHeader, headerButtonClass } from "../../components/layout/SimpleHeader";
import { DetailRows } from "../../components/ui/DetailRows";
import { SELL_STEPS, questionsFor } from "../../data/deviceChecks";
import { getSellCategory } from "../../data/sellCatalog";
import { deviceImage } from "../../data/sellModels";
import { formatDate, formatPrice, todayIso } from "../../lib/format";
import { isGoogleUser, signInWithGoogle, useFirebaseUser } from "../../lib/auth";
import { store } from "../../lib/store";

const screenIssues = [
  "Broken/scratch on device screen",
  "Dead spot/visible line and discoloration on screen",
  "Scratch/dent on device body",
  "Device panel missing/broken",
];

export function PickupPage() {
  const [t] = useSearchParams();
  const navigate = useNavigate();
  const { user, authReady } = useFirebaseUser();
  const s = (P) => (t.get(P) || "").trim();
  const [addressInput, setAddressInput] = useState("");
  const [expectedPriceInput, setExpectedPriceInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [date, setDate] = useState(todayIso);
  const [selected, setSelected] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("instacashmart.profile") || "{}");
      setAddressInput((current) => current || savedProfile.address || "");
      setPhoneInput((current) =>
        current || String(savedProfile.phone || "").replace(/\D/g, "").slice(0, 10),
      );
    } catch (error) {
      console.error("Unable to load saved pickup details.", error);
    }
  }, []);
  const category = s("cat");
  const C = getSellCategory(category);
  const v = [s("storage"), s("ram") && `${s("ram")} RAM`].filter(Boolean).join(" • ");
  const T = [s("model"), v && `(${v})`].filter(Boolean).join(" ") || "Your device";
  const rows = [
    ["Model", s("model")],
    ["Storage", s("storage")],
    ["RAM", s("ram")],
    ["Variant / Colour", s("variant")],
    ["Condition", s("condition")],
    ["Accessories", s("accessories") || "None"],
    ...questionsFor(category).map((item) => [item.label, s(item.key)]),
    ["Functional problems", s("problems") || "None"],
  ].filter(([P, te]) => te || P === "Variant / Colour");
  const A = `/sell${category ? `?cat=${encodeURIComponent(category)}` : ""}`;
  const handleGoogleSignIn = async () => {
    setAuthBusy(true);
    setErrorMessage("");
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign in with Google.");
    } finally {
      setAuthBusy(false);
    }
  };
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (saving) {
      return;
    }
    setErrorMessage("");
    setSaving(true);
    const orderId = store.newId("CN");
    try {
      const customer = isGoogleUser(user) ? user : await signInWithGoogle();
      const savedProfile = JSON.parse(localStorage.getItem("instacashmart.profile") || "{}");
      await store.addAndWait("sell", {
        id: orderId,
        userId: customer.uid,
        name: customer.displayName || savedProfile.name || "",
        email: customer.email || "",
        createdAt: new Date().toISOString(),
        category,
        model: s("model"),
        storage: s("storage"),
        ram: s("ram"),
        variant: s("variant"),
        condition: s("condition"),
        screenBodyIssues: items.join(", ") || "None",
        functionalProblems: s("problems") || "None",
        ...Object.fromEntries(questionsFor(category).map((item) => [item.key, s(item.key)])),
        accessories: s("accessories"),
        quote: Number(s("price")) || 0,
        expectedPrice: Number(expectedPriceInput),
        address: addressInput.trim(),
        phone: phoneInput,
        date,
        status: "New",
      });
    } catch (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }
    setSaving(false);
    setSelected({
      id: orderId,
      date,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <SimpleHeader
        action={
          <Link
            to={A}
            onClick={(evt) => {
              if (window.history.length > 1) {
                evt.preventDefault();
                navigate(-1);
              }
            }}
            className={headerButtonClass}
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Edit Details</span>
          </Link>
        }
      />
      <main className="max-w-3xl mx-3 sm:mx-4 md:mx-auto mt-4 mb-10 space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {"Step "}
            {SELL_STEPS}
            {" of "}
            {SELL_STEPS}
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 mt-2">
            Review Your Item
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 text-3xl overflow-hidden">
              {deviceImage(category, s("model"), s("brand")) || (C != null && C.image) ? (
                <img
                  src={deviceImage(category, s("model"), s("brand")) || C.image}
                  alt={s("model")}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                <i className={`fa-solid ${C?.icon || "fa-mobile-screen"}`} />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 break-words">{T}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{s("condition")}</p>
            </div>
          </div>
          <DetailRows
            rows={rows}
            className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-600"
          />
        </section>
        {selected ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fa-solid fa-check" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Pickup Confirmed!</h2>
            <p className="text-sm text-slate-500 mt-2">
              {"Order reference:"}{" "}
              <strong className="text-brand-700 font-mono font-bold">{selected.id}</strong>
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {"We'll come to pick up your item on"}{" "}
              <strong className="text-slate-900">
                {formatDate(selected.date, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
              {"."}
            </p>
            <p className="text-xs text-slate-500 mt-3">
              {"Save your order reference to track the pickup anytime from"}{" "}
              <strong>Track Pickup</strong>
              {" on the home page."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/"
                className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
              >
                Back to Home
              </Link>
              <Link
                to={`/track?id=${encodeURIComponent(selected.id)}`}
                className="inline-block px-5 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold rounded-xl hover:bg-brand-100 transition"
              >
                Track this order
              </Link>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4"
          >
            <fieldset className="rounded-2xl border border-slate-200 p-4 sm:p-5">
              <legend className="sr-only">{"Screen & body condition"}</legend>
              <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                Quick condition check
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-3">
                {"Screen & body condition"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select every visible issue that applies. This helps us prepare a fair pickup quote.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                {screenIssues.map((screenIssue) => {
                  const te = items.includes(screenIssue);
                  return (
                    <label
                      key={screenIssue}
                      className={`cursor-pointer flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition ${te ? "border-brand-600 bg-brand-50/40 text-slate-900" : "border-slate-200 bg-white text-slate-700 hover:border-brand-500"}`}
                    >
                      <input
                        type="checkbox"
                        checked={te}
                        onChange={() =>
                          setItems((De) =>
                            te ? De.filter((item) => item !== screenIssue) : [...De, screenIssue],
                          )
                        }
                        className="shrink-0 rounded border-slate-300 accent-brand-600"
                      />
                      <span>{screenIssue}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <h2 className="text-base font-bold text-slate-900">
              {"Pickup Address & Availability"}
            </h2>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isGoogleUser(user)
                    ? `Signed in as ${user.displayName || user.email}`
                    : "Google sign-in required"}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Sign in to confirm and securely view this pickup in your profile.
                </p>
              </div>
              {!isGoogleUser(user) && (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={!authReady || authBusy || saving}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 disabled:opacity-60"
                >
                  {authBusy ? "Opening Google…" : "Sign in with Google"}
                </button>
              )}
            </div>
            <div>
              <label htmlFor="addressInput" className="block text-xs font-bold text-slate-700 mb-1">
                Address *
              </label>
              <textarea
                id="addressInput"
                required
                rows={3}
                value={addressInput}
                onChange={(evt) => setAddressInput(evt.target.value)}
                placeholder="House/Flat No, Building, Street, Area, Landmark, City, Pincode"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div>
              <label
                htmlFor="expectedPriceInput"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Expected Price (₹) *
              </label>
              <input
                id="expectedPriceInput"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                value={expectedPriceInput}
                onChange={(evt) => setExpectedPriceInput(evt.target.value)}
                placeholder="Enter the price you expect"
                className="w-full sm:w-64 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {"Your expected amount:"}{" "}
                {expectedPriceInput ? formatPrice(Number(expectedPriceInput)) : "—"}
              </p>
            </div>
            <div>
              <label htmlFor="phoneInput" className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="flex w-full sm:w-64 rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-brand-500 overflow-hidden">
                <span className="px-3 flex items-center bg-slate-50 border-r border-slate-300 text-sm font-semibold text-slate-600">
                  +91
                </span>
                <input
                  id="phoneInput"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  required
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a 10-digit mobile number starting with 6, 7, 8 or 9"
                  value={phoneInput}
                  onChange={(evt) =>
                    setPhoneInput(evt.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="98765 43210"
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Our pickup executive will call this number before arriving.
              </p>
            </div>
            <div>
              <label htmlFor="dateInput" className="block text-xs font-bold text-slate-700 mb-1">
                Date of Availability *
              </label>
              <input
                id="dateInput"
                type="date"
                required
                min={todayIso()}
                value={date}
                onChange={(evt) => setDate(evt.target.value)}
                className="w-full sm:w-64 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Pick the day you'll be available for the doorstep pickup.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving || authBusy || !authReady}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              <span>
                {saving
                  ? "Saving…"
                  : isGoogleUser(user)
                    ? "Confirm"
                    : "Sign in with Google & Confirm"}
              </span>
              <i className="fa-solid fa-circle-check" />
            </button>
            {errorMessage && (
              <p role="alert" className="text-xs font-semibold text-red-700">
                {errorMessage}
              </p>
            )}
          </form>
        )}
      </main>
    </>
  );
}
