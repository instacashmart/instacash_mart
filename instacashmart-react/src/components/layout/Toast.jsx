import { useApp } from "../../context/AppContext";

export function Toast() {
  const { toast } = useApp();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 right-5 z-[80] transform transition-all duration-300 bg-dark-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs ${toast.visible ? "translate-y-0 opacity-100" : "translate-y-[-100px] opacity-0 pointer-events-none"}`}
    >
      <i className="fa-solid fa-circle-check text-brand-400 text-base" />
      <span>{toast.message}</span>
    </div>
  );
}
