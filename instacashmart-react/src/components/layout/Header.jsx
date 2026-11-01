import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryBar } from "./CategoryBar";
import { SearchSuggestions } from "./SearchSuggestions";
import { LogoLink } from "./SimpleHeader";
import { useApp } from "../../context/AppContext";
import { accessoryCategories } from "../../data/accessories";

export function Header({ onToggleDrawer, drawerOpen }) {
  const { market, setMarketCategory, setMarketQuery, goToStore } = useApp();
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (evt) => {
      if (ref.current && !ref.current.contains(evt.target)) {
        setFlag(false);
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  const handleSubmit = (evt) => {
    var _;
    evt.preventDefault();
    setFlag(false);
    if ((_ = document.activeElement) != null) {
      _.blur();
    }
    goToStore({
      category: "all",
    });
  };
  return (
    <header className="sticky top-0 z-40 bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          <div className="flex items-center gap-6">
            <LogoLink />
          </div>
          <form
            ref={ref}
            className="hidden lg:flex flex-1 max-w-2xl relative"
            onSubmit={handleSubmit}
            role="search"
          >
            <div className="flex w-full items-stretch rounded-full border-2 border-transparent focus-within:border-brand-500 bg-white overflow-hidden transition">
              <select
                value={market.category}
                onChange={(evt) => setMarketCategory(evt.target.value)}
                aria-label="Search category"
                className="shrink-0 max-w-[9.5rem] bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-900 pl-4 pr-2 border-r border-slate-300 focus:outline-none cursor-pointer"
              >
                {accessoryCategories.map((accessoryCategory) => (
                  <option key={accessoryCategory.key} value={accessoryCategory.key}>
                    {accessoryCategory.label}
                  </option>
                ))}
              </select>
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  autoComplete="off"
                  value={market.query}
                  onChange={(evt) => {
                    setMarketQuery(evt.target.value);
                    setFlag(true);
                  }}
                  onFocus={() => setFlag(true)}
                  placeholder="Search phones, chargers, cases, earbuds..."
                  aria-label="Search"
                  className="w-full h-full pl-4 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                {market.query && (
                  <button
                    type="button"
                    onClick={() => setMarketQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <i className="fa-solid fa-circle-xmark" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                aria-label="Search"
                className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white px-5 transition"
              >
                <i className="fa-solid fa-magnifying-glass" />
              </button>
            </div>
            {flag && (
              <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 space-y-1">
                <SearchSuggestions query={market.query} onDone={() => setFlag(false)} />
              </div>
            )}
          </form>
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-xs sm:text-sm font-bold text-white px-3 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2"
            >
              <i className="fa-regular fa-user text-slate-300" />
              <span>Profile</span>
            </button>
            <Link
              to="/sell"
              className="hidden md:inline-flex items-center border border-white/40 text-white hover:bg-white/10 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full transition"
            >
              Sell Your Item
            </Link>
            <button
              type="button"
              onClick={onToggleDrawer}
              aria-label="Menu"
              aria-expanded={drawerOpen}
              className="xl:hidden p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none"
            >
              <i className={`fa-solid ${drawerOpen ? "fa-xmark" : "fa-bars"} text-xl`} />
            </button>
          </div>
        </div>
      </div>
      <form className="lg:hidden px-4 pb-3" onSubmit={handleSubmit} role="search">
        <div className="flex items-stretch rounded-full border-2 border-transparent focus-within:border-brand-500 bg-white overflow-hidden transition">
          <input
            type="search"
            autoComplete="off"
            value={market.query}
            onChange={(evt) => setMarketQuery(evt.target.value)}
            placeholder="Search phones, chargers, cases..."
            aria-label="Search"
            className="flex-1 min-w-0 pl-4 pr-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white px-4 transition"
          >
            <i className="fa-solid fa-magnifying-glass text-sm" />
          </button>
        </div>
      </form>
      <div className="bg-dark-800 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6">
          <CategoryBar
            active={market.category}
            onPick={(h) =>
              goToStore({
                category: h,
              })
            }
          />
          <nav className="hidden xl:flex shrink-0 items-center gap-5 text-sm font-semibold text-slate-300 pl-6 border-l border-white/15">
            <Link to="/sell" className="hover:text-white transition">
              Sell
            </Link>
            <Link to="/bikes-cars" className="hover:text-white transition">
              {"Bikes & Cars"}
            </Link>
            <Link to="/how-it-works" className="hover:text-white transition">
              How it Works
            </Link>
            <Link to="/faqs" className="hover:text-white transition">
              FAQs
            </Link>
            <Link to="/reviews" className="hover:text-white transition">
              Reviews
            </Link>
            <Link to="/feedback" className="hover:text-white transition">
              Feedback
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
