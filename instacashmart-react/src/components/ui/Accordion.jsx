import { useState } from "react";
import { faqs } from "../../data/site";

export function Accordion({ buttonClass = "gap-4 px-5 py-4", className = "space-y-3" }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className={`reveal-group ${className}`}>
      {faqs.map((faq, index) => (
        <div key={faq.q} className="border border-slate-200 rounded-2xl overflow-hidden transition">
          <button
            type="button"
            onClick={() => setSelected(selected === index ? null : index)}
            aria-expanded={selected === index}
            className={`w-full flex items-center justify-between text-left bg-slate-50/50 hover:bg-slate-50 font-bold text-sm text-slate-900 ${buttonClass}`}
          >
            <span>{faq.q}</span>
            <i
              className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform ${selected === index ? "rotate-180" : ""}`}
            />
          </button>
          {selected === index && (
            <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
