import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.webp";

const INTRO_SEEN_KEY = "cn-intro-seen";

const INTRO_PLAY_MS = 5000;

const INTRO_EXIT_MS = 1000;

const introDust = Array.from(
  {
    length: 16,
  },
  (t, e) => {
    const s = e >= 12;
    return {
      left: 34 + ((e * 23) % 33),
      top: 18 + ((e * 41) % 62),
      size: s ? 6 + (e % 3) * 2 : 1.5 + (e % 3),
      blur: s ? 3 : 0,
      delay: 1.2 + ((e * 7) % 10) / 10,
      float: 6 + ((e * 11) % 5),
      drift: ((e * 13) % 24) - 12,
    };
  },
);

function shouldPlayIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  try {
    return !sessionStorage.getItem(INTRO_SEEN_KEY);
  } catch {
    return true;
  }
}

export function Intro() {
  const [state, setState] = useState(() => (shouldPlayIntro() ? "play" : "done"));
  const s = state === "done";
  useEffect(() => {
    if (s) {
      return;
    }
    const documentElement = document.documentElement;
    documentElement.classList.add("intro-playing");
    document.body.classList.add("overflow-hidden");
    return () => {
      documentElement.classList.remove("intro-playing");
      document.body.classList.remove("overflow-hidden");
    };
  }, [s]);
  useEffect(() => {
    if (state === "play") {
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {}
      const n = setTimeout(() => setState("exit"), INTRO_PLAY_MS);
      return () => clearTimeout(n);
    }
    if (state === "exit") {
      const n = setTimeout(() => setState("done"), INTRO_EXIT_MS);
      return () => clearTimeout(n);
    }
  }, [state]);
  useEffect(() => {
    if (state !== "play") {
      return;
    }
    const n = (a) => ["Escape", "Enter", " "].includes(a.key) && setState("exit");
    document.addEventListener("keydown", n);
    return () => document.removeEventListener("keydown", n);
  }, [state]);
  if (s) {
    return null;
  } else {
    return (
      <div
        className={`intro ${state === "exit" ? "intro-exit" : ""}`}
        role="presentation"
        onClick={() => setState("exit")}
      >
        <div className="intro-stage">
          <span className="intro-haze" aria-hidden="true" />
          <span className="intro-beam" aria-hidden="true">
            <span />
          </span>
          <span className="intro-pool" aria-hidden="true" />
          <span className="intro-streak" aria-hidden="true" />
          <div className="intro-dust" aria-hidden="true">
            {introDust.map((item, index) => (
              <span
                key={index}
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  width: item.size,
                  height: item.size,
                  filter: item.blur ? `blur(${item.blur}px)` : undefined,
                  "--drift": `${item.drift}px`,
                  animationDelay: `${item.delay}s, ${item.delay}s`,
                  animationDuration: `1.2s, ${item.float}s`,
                }}
              />
            ))}
          </div>
          <div className="intro-lockup">
            <div className="intro-mark-wrap">
              <span className="intro-mark intro-logo">
                <img src={logo} alt="InstaCashMart" />
              </span>
              <span className="intro-mark-shadow" aria-hidden="true" />
            </div>
            <p className="intro-sub">Instant Re-Commerce</p>
          </div>
        </div>
      </div>
    );
  }
}
