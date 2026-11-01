import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import "./lib/firebase";
import "./styles/vendor.css";
import "./styles/app.css";

// The router works on hash URLs, so a typed /admin is pointed at /#/admin before it starts.
const adminPath = /\/admin\/?$/;
if (adminPath.test(window.location.pathname)) {
  const home = window.location.pathname.replace(adminPath, "/");
  window.history.replaceState(null, "", `${home}#/admin`);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </HashRouter>
  </StrictMode>,
);
