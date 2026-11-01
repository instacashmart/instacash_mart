import { Link } from "react-router-dom";

export const Breadcrumbs = ({ items }) => (
  <nav
    aria-label="Breadcrumb"
    className="flex items-center gap-2 text-xs font-semibold text-slate-500"
  >
    {items.map(([e, s], index) => (
      <span key={e} className="flex items-center gap-2">
        {index > 0 && <i className="fa-solid fa-chevron-right text-[9px] text-slate-400" />}
        {s ? (
          <Link to={s} className="hover:text-brand-700">
            {e}
          </Link>
        ) : (
          <span className="text-slate-900">{e}</span>
        )}
      </span>
    ))}
  </nav>
);
