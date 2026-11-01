import { Link } from "react-router-dom";

export function BackToHome() {
  return (
    <div className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs transition"
      >
        <i className="fa-solid fa-arrow-left text-xs" />
        {" Back to Home"}
      </Link>
    </div>
  );
}
