import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SimpleHeader, headerButtonClass } from "../../components/layout/SimpleHeader";
import { SELL_STEPS, questionsFor } from "../../data/deviceChecks";

export function DeviceCheckPage() {
  const [t] = useSearchParams();
  const navigate = useNavigate();
  const s = questionsFor(t.get("cat"));
  const [state, setState] = useState(() =>
    Object.fromEntries(s.map(({ key }) => [key, t.get(key) || ""])),
  );
  useEffect(() => {
    document.title = "Tell us more about your device | InstaCashMart";
  }, []);
  const r = s.every(({ key }) => state[key]);
  const handleClick = () => {
    const c = new URLSearchParams(t);
    for (const { key } of s) {
      c.set(key, state[key]);
    }
    navigate(`/device-problems?${c}`);
  };
  const l = `/sell?cat=${encodeURIComponent(t.get("cat") || "phone")}`;
  return (
    <>
      <SimpleHeader
        action={
          <Link
            to={l}
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
      <main className="max-w-3xl mx-3 sm:mx-4 md:mx-auto mt-4 mb-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {"Step 2 of "}
            {SELL_STEPS}
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 mt-2">
            Tell us more about your device
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.get("model") ? `${t.get("model")} • ` : ""}
            {"These answers help us prepare an accurate inspection quote."}
          </p>
          <div className="mt-5 divide-y divide-slate-100">
            {s.map(({ key, question, hint }) => (
              <fieldset key={key} className="py-4 first:pt-0">
                <legend className="text-sm font-bold text-slate-900">{question}</legend>
                <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
                <div className="flex gap-2 mt-2.5">
                  {["Yes", "No"].map((item) => {
                    const h = state[key] === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={h}
                        onClick={() =>
                          setState((_) => ({
                            ..._,
                            [key]: item,
                          }))
                        }
                        className={`min-w-[72px] px-5 py-2.5 rounded-xl border text-sm transition ${h ? "border-brand-600 bg-brand-50/40 font-bold text-slate-900" : "border-slate-200 text-slate-700 hover:border-slate-400"}`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
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
              disabled={!r}
              onClick={handleClick}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold transition"
            >
              {"Continue "}
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>
          {!r && (
            <p className="text-[11px] text-slate-400 mt-2">
              {"Answer all "}
              {s.length}
              {" questions to continue."}
            </p>
          )}
        </section>
      </main>
    </>
  );
}
