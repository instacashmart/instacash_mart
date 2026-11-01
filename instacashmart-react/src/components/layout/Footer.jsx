import { Link } from "react-router-dom";
import { Logo } from "./SimpleHeader";
import { sellCategoryPath } from "../../data/sellBrands";

const footerSellLinks = [
  ["phone", "Sell Old Phone"],
  ["laptop", "Sell Old Laptop"],
  ["tablet", "Sell Old Tablet"],
  ["smartwatch", "Sell Smartwatch"],
  ["earbuds", "Sell Earbuds"],
  ["console", "Sell Gaming Console"],
];

const footerCompanyLinks = [
  ["/how-it-works", "How it Works"],
  ["/#why-us", "Why InstaCashMart"],
  ["/faqs", "FAQs & Help"],
  ["/reviews", "Customer Reviews"],
  ["/feedback", "Feedback"],
  ["/admin", "Admin Panel"],
  ["/", "Become a Pickup Rider"],
  ["/", "Corporate Bulk Buyback"],
];

const footerSocialIcons = ["fa-x-twitter", "fa-facebook-f", "fa-instagram", "fa-linkedin-in"];

const footerLegalLinks = [
  "Terms of Service",
  "Privacy Policy",
  "Buyback Policy",
  "E-Waste Compliance",
];

export function Footer() {
  return (
    <footer className="mt-6 bg-dark-900 text-slate-300 pt-16 pb-24 xl:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal-group grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex">
              <Logo className="h-12" />
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              InstaCashMart is India's premier instant electronics trade-in and re-commerce network.
              Enabling consumers to monetize old tech safely while championing circular electronics
              recycling.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {footerSocialIcons.map((footerSocialIcon) => (
                <a
                  key={footerSocialIcon}
                  href="#"
                  aria-label={footerSocialIcon.replace("fa-", "")}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white flex items-center justify-center transition text-xs"
                >
                  <i className={`fa-brands ${footerSocialIcon}`} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Sell Gadgets
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {footerSellLinks.map(([t, e]) => (
                <li key={t}>
                  <Link to={sellCategoryPath(t)} className="hover:text-brand-400 transition">
                    {e}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/bikes-cars/sell" className="hover:text-brand-400 transition">
                  Sell Bike or Car
                </Link>
              </li>
              <li>
                <Link to="/bikes-cars" className="hover:text-brand-400 transition">
                  {"Buy Used Bikes & Cars"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {footerCompanyLinks.map(([t, e]) => (
                <li key={e}>
                  <Link to={t} className="hover:text-brand-400 transition">
                    {e}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 InstaCashMart Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
            {footerLegalLinks.map((footerLegalLink) => (
              <Link key={footerLegalLink} to="/" className="hover:text-slate-300 transition">
                {footerLegalLink}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center">
          <a
            href="https://asteroic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-semibold text-slate-300 hover:text-brand-400 transition"
          >
            Powered by Asteroic
          </a>
        </p>
      </div>
    </footer>
  );
}
