import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { productCategories } from "../data/accessories";

export const isVehiclePath = (t) => /^\/(bikes-cars|bikes|cars)(\/|$)/.test(t);

const swipeTabs = [
  {
    key: "home",
    label: "Home",
    to: "/",
  },
  {
    key: "tablet",
    label: "Tablet",
    to: "/sell-tablet",
  },
  {
    key: "vehicles",
    label: "Bikes & Cars",
    to: "/bikes-cars",
  },
  ...productCategories.map((productCategory) => ({
    key: productCategory.key,
    label: productCategory.label,
    to: `/accessories?cat=${encodeURIComponent(productCategory.key)}`,
  })),
];

function swipeTabIndex(t, e) {
  if (t === "/") {
    return 0;
  }
  if (t.startsWith("/sell-tablet")) {
    return 1;
  }
  if (isVehiclePath(t)) {
    return 2;
  }
  if (t === "/accessories") {
    const s = new URLSearchParams(e).get("cat");
    const n = swipeTabs.findIndex((swipeTab) => swipeTab.key === s);
    if (n > 0) {
      return n;
    } else {
      return 0;
    }
  }
  return -1;
}

function blocksSwipe(t) {
  let e;
  for (; t && t !== document.body; t = t.parentElement) {
    if (
      (e = t.closest) != null &&
      e.call(t, 'input, textarea, select, [role="dialog"], [data-no-swipe]')
    ) {
      return true;
    }
    const overflowX = getComputedStyle(t).overflowX;
    if ((overflowX === "auto" || overflowX === "scroll") && t.scrollWidth > t.clientWidth + 2) {
      return true;
    }
  }
  return false;
}

export function useSwipeNavigation(t) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { modal } = useApp();
  const [selected, setSelected] = useState(null);
  const ref = useRef({
    index: -1,
    active: false,
  });
  ref.current = {
    index: swipeTabIndex(pathname, search),
    active: t && !modal,
  };
  useEffect(() => {
    let c;
    const u = (b) => {
      const { index, active } = ref.current;
      if (!active || index < 0) {
        return;
      }
      const R = swipeTabs[index + b];
      if (R) {
        navigate(R.to);
        window.scrollTo({
          top: 0,
        });
        setSelected({
          label: R.label,
          dir: b,
          at: Date.now(),
        });
        clearTimeout(c);
        c = setTimeout(() => setSelected(null), 900);
      }
    };
    let m = null;
    const p = (evt) => {
      if (evt.touches.length !== 1 || blocksSwipe(evt.target)) {
        m = null;
        return;
      }
      const B = evt.touches[0];
      m = {
        x: B.clientX,
        y: B.clientY,
        at: Date.now(),
      };
    };
    const h = (b) => {
      if (!m) {
        return;
      }
      const B = b.changedTouches[0];
      const E = B.clientX - m.x;
      const R = B.clientY - m.y;
      const D = Date.now() - m.at < 700;
      m = null;
      if (D && Math.abs(E) > 70 && Math.abs(E) > Math.abs(R) * 1.8) {
        u(E < 0 ? 1 : -1);
      }
    };
    let _ = 0;
    let f;
    let S = false;
    const y = (evt) => {
      if (!(Math.abs(evt.deltaX) <= Math.abs(evt.deltaY)) && !blocksSwipe(evt.target)) {
        clearTimeout(f);
        f = setTimeout(() => {
          _ = 0;
          S = false;
        }, 350);
        if (!S) {
          _ += evt.deltaX;
          if (Math.abs(_) > 160) {
            S = true;
            u(_ > 0 ? 1 : -1);
          }
        }
      }
    };
    window.addEventListener("touchstart", p, {
      passive: true,
    });
    window.addEventListener("touchend", h, {
      passive: true,
    });
    window.addEventListener("wheel", y, {
      passive: true,
    });
    return () => {
      window.removeEventListener("touchstart", p);
      window.removeEventListener("touchend", h);
      window.removeEventListener("wheel", y);
      clearTimeout(c);
      clearTimeout(f);
    };
  }, [navigate]);
  return selected;
}
