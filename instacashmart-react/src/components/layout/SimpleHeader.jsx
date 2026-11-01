import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

export function Logo({ className = "h-10 lg:h-12" }) {
  return <img src={logo} alt="InstaCashMart" className={`${className} w-auto block`} />;
}

export function LogoLink({ subtitle, className }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <span className="group-hover:scale-[1.03] transition-transform">
        <Logo className={className} />
      </span>
      {subtitle && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {subtitle}
        </span>
      )}
    </Link>
  );
}

export function SimpleHeader({ subtitle, action }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <LogoLink subtitle={subtitle} className="h-10" />
          {action}
        </div>
      </div>
    </header>
  );
}

export const headerButtonClass =
  "inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition";
