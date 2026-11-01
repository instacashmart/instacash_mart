import { useEffect } from "react";

const openModals = [];

export function Modal({ open, onClose, className = "max-w-md", children }) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const a = {};
    openModals.push(a);
    const r = (o) => o.key === "Escape" && openModals[openModals.length - 1] === a && onClose();
    document.addEventListener("keydown", r);
    return () => {
      document.removeEventListener("keydown", r);
      openModals.splice(openModals.indexOf(a), 1);
    };
  }, [open, onClose]);
  if (open) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
        onClick={(evt) => evt.target === evt.currentTarget && onClose()}
      >
        <div
          className={`bg-white rounded-3xl w-full shadow-2xl border border-slate-100 ${className}`}
        >
          {children}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export function CloseButton({ onClick, label = "Close", small = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${small ? "w-7 h-7" : "w-8 h-8"} rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition`}
    >
      <i className="fa-solid fa-xmark" />
    </button>
  );
}
