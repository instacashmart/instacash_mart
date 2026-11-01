import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { accessoryCategories } from "../../data/accessories";
import { isVehiclePath } from "../../hooks/useSwipeNavigation";

const extraTabs = [
  {
    key: "tablet",
    label: "Tablet",
    to: "/sell-tablet",
    after: "all",
  },
  {
    key: "vehicles",
    label: "Bikes & Cars",
    to: "/bikes-cars",
    after: "all",
  },
];

export function CategoryBar({ active, onPick }) {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [form, setForm] = useState({
    left: false,
    right: false,
  });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const c = accessoryCategories.flatMap((accessoryCategory) => [
    accessoryCategory,
    ...extraTabs.filter((extraTab) => extraTab.after === accessoryCategory.key),
  ]);
  const u = (b) => (b.key === "vehicles" ? isVehiclePath(pathname) : pathname.startsWith(b.to));
  const m = (b) => (b.to ? u(b) : !extraTabs.some(u) && active === b.key);
  const handlePointerDown = (evt) => {
    if (evt.pointerType === "mouse" && evt.button === 0) {
      ref2.current = {
        x: evt.clientX,
        left: ref.current.scrollLeft,
        moved: false,
      };
    }
  };
  const handlePointerMove = (evt) => {
    const current = ref2.current;
    if (!current) {
      return;
    }
    const E = evt.clientX - current.x;
    if (!current.moved && Math.abs(E) > 5) {
      current.moved = true;
      try {
        ref.current.setPointerCapture(evt.pointerId);
      } catch {}
      ref.current.style.scrollBehavior = "auto";
    }
    if (current.moved) {
      ref.current.scrollLeft = current.left - E;
    }
  };
  const handlePointerUp = () => {
    var b;
    if ((b = ref2.current) != null && b.moved) {
      ref.current.style.scrollBehavior = "";
    }
    setTimeout(() => {
      ref2.current = null;
    }, 0);
  };
  const handleClickCapture = (evt) => {
    var B;
    if ((B = ref2.current) != null && B.moved) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  };
  useEffect(() => {
    const current = ref.current;
    const B = (evt) => {
      if (
        Math.abs(evt.deltaY) <= Math.abs(evt.deltaX) ||
        current.scrollWidth <= current.clientWidth
      ) {
        return;
      }
      const R = current.scrollLeft <= 0 && evt.deltaY < 0;
      const D =
        current.scrollLeft + current.clientWidth >= current.scrollWidth - 1 && evt.deltaY > 0;
      if (!R && !D) {
        evt.preventDefault();
        current.scrollBy({
          left: evt.deltaY,
          behavior: "auto",
        });
      }
    };
    current.addEventListener("wheel", B, {
      passive: false,
    });
    return () => current.removeEventListener("wheel", B);
  }, []);
  useEffect(() => {
    var R;
    const current = ref.current;
    const B = () =>
      setForm({
        left: current.scrollLeft > 4,
        right: current.scrollLeft + current.clientWidth < current.scrollWidth - 4,
      });
    B();
    current.addEventListener("scroll", B, {
      passive: true,
    });
    const E = new ResizeObserver(B);
    E.observe(current);
    [...current.children].forEach((item) => E.observe(item));
    if ((R = document.fonts) != null) {
      R.ready.then(B);
    }
    return () => {
      current.removeEventListener("scroll", B);
      E.disconnect();
    };
  }, []);
  useEffect(() => {
    var B;
    const b = (E) => {
      const current = ref.current;
      const D = current?.querySelector('[aria-current="true"]');
      if (D) {
        current.scrollTo({
          left: D.offsetLeft - (current.clientWidth - D.offsetWidth) / 2,
          behavior: E,
        });
      }
    };
    b("smooth");
    if ((B = document.fonts) != null) {
      B.ready.then(() => b("auto"));
    }
  }, [active, pathname]);
  const S = (b) =>
    ref.current.scrollBy({
      left: b * ref.current.clientWidth * 0.7,
      behavior: "smooth",
    });
  const y =
    "absolute top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-[11px] transition";
  return (
    <div className="relative flex-1 min-w-0 -mx-2">
      <nav
        ref={ref}
        aria-label="Shop by category"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        onDragStart={(evt) => evt.preventDefault()}
        className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth select-none cursor-grab active:cursor-grabbing"
      >
        {c.map((item) => {
          const B = m(item);
          return (
            <button
              key={item.key}
              type="button"
              aria-current={B ? "true" : undefined}
              onClick={() => (item.to ? navigate(item.to) : onPick(item.key))}
              className={`shrink-0 px-3 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition ${B ? "border-brand-400 text-white" : "border-transparent text-slate-300 hover:text-white"}`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      {form.left && (
        <>
          <span
            className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-dark-800 via-dark-800/80 to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => S(-1)}
            aria-label="Scroll categories left"
            className={`${y} left-0`}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
        </>
      )}
      {form.right && (
        <>
          <span
            className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-dark-800 via-dark-800/80 to-transparent"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => S(1)}
            aria-label="Scroll categories right"
            className={`${y} right-0`}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </>
      )}
    </div>
  );
}
