import { Link } from "react-router-dom";
import { BackToHome } from "../components/ui/BackToHome";
import { howItWorksSteps } from "../data/site";

export function HowItWorksPage() {
  return (
    <main>
      <BackToHome />
      <section
        id="how-it-works"
        className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white py-8 lg:py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Super Simple Process
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-2">
              Sell Your Gadget in Just 4 Easy Steps
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              From valuation to cash in your bank account in as little as 2 hours!
            </p>
          </div>
          <div className="reveal-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorksSteps.map((howItWorksStep, index) => (
              <div
                key={howItWorksStep.title}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-brand-500 transition relative group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${howItWorksStep.iconClass} flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition`}
                >
                  <i className={`fa-solid ${howItWorksStep.icon}`} />
                </div>
                <span className="absolute top-5 right-5 text-3xl font-extrabold text-slate-100 group-hover:text-brand-100 transition">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-base font-bold text-slate-900 mb-1">{howItWorksStep.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{howItWorksStep.text}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-shield-cat" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Worried about personal data on your old device?
                </h2>
                <p className="text-xs text-slate-500">
                  Every single purchased gadget undergoes DoD 5220.22-M certified military standard
                  data wipe with a digital certificate.
                </p>
              </div>
            </div>
            <Link
              to="/sell"
              className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              Sell Gadget Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
