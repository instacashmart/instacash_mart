import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";
import { Modals } from "../modals/Modals";
import { useSwipeNavigation } from "../../hooks/useSwipeNavigation";

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const routeLocation = useLocation();
  useEffect(
    () => setIsOpen(false),
    [routeLocation.pathname, routeLocation.search, routeLocation.hash],
  );
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    if (!isOpen) {
      return;
    }
    const a = (r) => r.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", a);
    return () => document.removeEventListener("keydown", a);
  }, [isOpen]);
  const n = useSwipeNavigation(!isOpen);
  return (
    <>
      <Header onToggleDrawer={() => setIsOpen((a) => !a)} drawerOpen={isOpen} />
      <MobileDrawer open={isOpen} onClose={() => setIsOpen(false)} />
      <Outlet />
      <Footer />
      <BottomNav />
      <Modals />
      {n && (
        <div
          key={n.at}
          role="status"
          className="swipe-hint fixed left-1/2 top-1/2 z-[90] -translate-x-1/2 -translate-y-1/2 pointer-events-none px-5 py-2.5 rounded-full bg-slate-900/90 text-white text-sm font-bold shadow-xl flex items-center gap-2"
        >
          {n.dir < 0 && <i className="fa-solid fa-chevron-left text-xs" />}
          {n.label}
          {n.dir > 0 && <i className="fa-solid fa-chevron-right text-xs" />}
        </div>
      )}
    </>
  );
}
