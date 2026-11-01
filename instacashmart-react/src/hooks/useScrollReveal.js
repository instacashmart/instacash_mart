import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal:not(.revealed), .reveal-group > :not(.revealed)";

const REVEAL_STAGGER_MS = 90;

const REVEAL_MAX_STAGGER = 6;

export function useScrollReveal() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      const n = () =>
        document
          .querySelectorAll(REVEAL_SELECTOR)
          .forEach((item) => item.classList.add("revealed"));
      n();
      const a = new MutationObserver(n);
      a.observe(document.body, {
        childList: true,
        subtree: true,
      });
      return () => a.disconnect();
    }
    const t = new IntersectionObserver(
      (n) => {
        n.filter((item) => item.isIntersecting).forEach((evt, index) => {
          evt.target.style.setProperty(
            "--reveal-delay",
            `${Math.min(index, REVEAL_MAX_STAGGER) * REVEAL_STAGGER_MS}ms`,
          );
          evt.target.classList.add("revealed");
          t.unobserve(evt.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
      },
    );
    const e = () => document.querySelectorAll(REVEAL_SELECTOR).forEach((item) => t.observe(item));
    e();
    const s = new MutationObserver(e);
    s.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => {
      s.disconnect();
      t.disconnect();
    };
  }, []);
}
