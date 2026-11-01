import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SimpleHeader, headerButtonClass } from "../../components/layout/SimpleHeader";
import { allQuestions } from "../../data/deviceChecks";
import { useSellModels } from "../../data/sellModels";
import { auth, adminUid } from "../../lib/firebase";
import { formatDate, formatPrice } from "../../lib/format";
import { useStoreList } from "../../lib/store";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FeedbackAdmin } from "./FeedbackAdmin";
import { PopularAdmin } from "./PopularAdmin";
import { ProductsAdmin } from "./ProductsAdmin";
import { ReviewsAdmin } from "./ReviewsAdmin";
import { SellModelsAdmin } from "./SellModelsAdmin";
import { TrendingAdmin } from "./TrendingAdmin";
import { VehicleLeadsAdmin, VehicleListingsAdmin } from "./VehicleRecordsAdmin";
import { VehiclesAdmin } from "./VehiclesAdmin";
import { EmptyNote, OrderCard } from "./shared";

const paymentLabels = {
  upi: "UPI",
  card: "Card",
  cod: "Cash on delivery",
};

const adminTabs = [
  {
    key: "sell",
    label: "Sell Details",
    icon: "fa-hand-holding-dollar",
    hint: "pickups booked",
  },
  {
    key: "buy",
    label: "Buy Details",
    icon: "fa-bag-shopping",
    hint: "accessory orders",
  },
  {
    key: "products",
    label: "Products",
    icon: "fa-box-open",
    hint: "buy accessories",
  },
  {
    key: "models",
    label: "Sell Models",
    icon: "fa-mobile-screen-button",
    hint: "added / edited models",
  },
  {
    key: "popular",
    label: "Popular Accessories",
    icon: "fa-star",
    hint: "homepage rail",
  },
  {
    key: "trending",
    label: "Trending Devices",
    icon: "fa-fire",
    hint: "homepage resale",
  },
  {
    key: "feedback",
    label: "Feedback",
    icon: "fa-comment-dots",
    hint: "from customers",
  },
  {
    key: "reviews",
    label: "Product Reviews",
    icon: "fa-star-half-stroke",
    hint: "from buyers",
  },
  {
    key: "bikes",
    label: "Bikes",
    icon: "fa-motorcycle",
    hint: "added for sale",
  },
  {
    key: "cars",
    label: "Cars",
    icon: "fa-car-side",
    hint: "added for sale",
  },
  {
    key: "vehicles",
    label: "Bike & Car Listings",
    icon: "fa-car-side",
    hint: "posted by sellers",
  },
  {
    key: "vehicleLeads",
    label: "Bike & Car Enquiries",
    icon: "fa-phone-volume",
    hint: "from buyers",
  },
];

function initialAdminTab() {
  try {
    const t = sessionStorage.getItem("adminTab");
    if (adminTabs.some((adminTab) => adminTab.key === t)) {
      return t;
    } else {
      return "sell";
    }
  } catch {
    return "sell";
  }
}

export function AdminPage() {
  const [user, setUser] = useState(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const vehicleProductsList = useStoreList("vehicleProducts");
  const e = {
    sell: useStoreList("sell"),
    buy: useStoreList("buy"),
    products: useStoreList("products"),
    popular: useStoreList("popular"),
    trending: useStoreList("trending"),
    feedback: useStoreList("feedback"),
    reviews: useStoreList("reviews"),
    bikes: vehicleProductsList.filter((item) => item.type === "bike"),
    cars: vehicleProductsList.filter((item) => item.type === "car"),
    vehicles: useStoreList("vehicles"),
    vehicleLeads: useStoreList("vehicleLeads"),
    models: useSellModels(),
  };
  const [form, setForm] = useState(initialAdminTab);
  const [textValue, setTextValue] = useState("");
  const ref = useRef(null);
  useEffect(
    () =>
      onAuthStateChanged(auth, async (currentUser) => {
        setAuthReady(true);
        if (currentUser && currentUser.uid !== adminUid) {
          setUser(null);
          setAuthError("This account is not authorized to access the admin panel.");
          await signOut(auth);
          return;
        }
        setUser(currentUser);
        setAuthError("");
      }),
    [],
  );
  useEffect(() => {
    document.title = "InstaCashMart Admin";
    try {
      sessionStorage.setItem("adminTab", form);
    } catch {}
  }, [form]);
  const showToast = (D) => {
    setTextValue(D);
    clearTimeout(ref.current);
    ref.current = setTimeout(() => setTextValue(""), 2500);
  };
  const handleSignIn = async (event) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (credential.user.uid !== adminUid) {
        await signOut(auth);
        throw new Error("This account is not authorized to access the admin panel.");
      }
    } catch (error) {
      setAuthError(error.message || "Unable to sign in.");
    } finally {
      setAuthBusy(false);
    }
  };
  if (!authReady) {
    return (
      <main className="max-w-md mx-auto mt-12 p-6 text-center text-sm text-slate-600">
        Checking admin sign-in…
      </main>
    );
  }
  if (!adminUid) {
    return (
      <main className="max-w-md mx-4 sm:mx-auto mt-12 rounded-2xl border border-red-200 bg-white p-6">
        <h1 className="text-lg font-bold text-slate-900">Admin sign-in is not configured</h1>
        <p className="mt-2 text-sm text-slate-600">
          Set VITE_FIREBASE_ADMIN_UID in the project .env file and restart the app.
        </p>
      </main>
    );
  }
  if (!user) {
    return (
      <main className="max-w-md mx-4 sm:mx-auto mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-xl font-extrabold text-slate-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in with the authorized admin account.</p>
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              required
            />
          </label>
          {authError && <p role="alert" className="text-sm text-red-700">{authError}</p>}
          <button
            type="submit"
            disabled={authBusy}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {authBusy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }
  return (
    <>
      <SimpleHeader
        subtitle="Admin Panel"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => signOut(auth)}
              className={headerButtonClass}
            >
              <i className="fa-solid fa-right-from-bracket text-xs" />
              <span>Sign out</span>
            </button>
            <Link to="/" className={headerButtonClass}>
              <i className="fa-solid fa-arrow-left text-xs" />
              <span>Back to Site</span>
            </Link>
          </div>
        }
      />
      <main className="max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 mb-10 space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">Admin</h1>
          <p className="text-xs text-slate-500 mt-1">
            {
              "Sell pickups, accessory orders, products catalog, homepage popular accessories, trending devices, customer feedback, product reviews, and bikes and cars for sale, bike & car listings and enquiries."
            }
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {adminTabs.map((adminTab) => {
              return (
                <button
                  key={adminTab.key}
                  type="button"
                  onClick={() => setForm(adminTab.key)}
                  aria-pressed={form === adminTab.key}
                  className={`text-left p-4 rounded-2xl border transition ${form === adminTab.key ? "border-brand-500 bg-brand-50/50 shadow-xs" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <i className={`fa-solid ${adminTab.icon}`} /> {adminTab.label}
                  </span>
                  <span className="block text-2xl font-extrabold text-slate-900 mt-1">
                    {e[adminTab.key]?.length || 0}
                  </span>
                  <span className="block text-[11px] text-slate-500">{adminTab.hint}</span>
                </button>
              );
            })}
          </div>
        </section>
        <>
          {form === "sell" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-bold text-slate-900">Sell Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pickups confirmed by customers on the sell pages.
              </p>
              <div className="mt-4 space-y-3">
                {e.sell.length ? (
                  e.sell.map((item) => (
                    <OrderCard
                      key={item.id}
                      type="sell"
                      item={item}
                      showToast={showToast}
                      rows={[
                        ["Pickup date", formatDate(item.date)],
                        ["Address", item.address],
                        ["Mobile", item.phone ? `+91 ${item.phone}` : ""],
                        ["Condition", item.condition],
                        [
                          "Customer expected price",
                          item.expectedPrice ? formatPrice(item.expectedPrice) : "",
                        ],
                        ["Variant / Colour", item.variant],
                        ["Accessories", item.accessories || "None"],
                        ["Screen & body issues", item.screenBodyIssues],
                        ["Functional problems", item.functionalProblems],
                        ...allQuestions
                          .filter((allQuestion) => item[allQuestion.key])
                          .map((item2) => [item2.label, item[item2.key]]),
                        ["Extra details", item.extra],
                      ]}
                    />
                  ))
                ) : (
                  <EmptyNote>
                    No pickups yet. They appear here when a customer presses Confirm on the pickup
                    page.
                  </EmptyNote>
                )}
              </div>
            </section>
          )}
          {form === "buy" && (
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-bold text-slate-900">Buy Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Orders placed with Buy Now in Buy Accessories.
              </p>
              <div className="mt-4 space-y-3">
                {e.buy.length ? (
                  e.buy.map((item) => (
                    <OrderCard
                      key={item.id}
                      type="buy"
                      item={item}
                      showToast={showToast}
                      rows={[
                        ["Price", formatPrice(item.price)],
                        ["Customer", item.name],
                        ["Phone", item.phone],
                        ["Payment", paymentLabels[item.payment] || item.payment],
                        ["Address", [item.address, item.pincode].filter(Boolean).join(" – ")],
                        ["Category", item.category],
                        ["Seller", item.seller],
                      ]}
                    />
                  ))
                ) : (
                  <EmptyNote>
                    No orders yet. They appear here when a customer places an order with Buy Now.
                  </EmptyNote>
                )}
              </div>
            </section>
          )}
          {form === "products" && <ProductsAdmin products={e.products} showToast={showToast} />}
          {form === "popular" && <PopularAdmin popular={e.popular} showToast={showToast} />}
          {form === "trending" && <TrendingAdmin trending={e.trending} showToast={showToast} />}
          {form === "feedback" && <FeedbackAdmin feedback={e.feedback} showToast={showToast} />}
          {form === "reviews" && <ReviewsAdmin reviews={e.reviews} showToast={showToast} />}
          {form === "models" && <SellModelsAdmin adminModels={e.models} showToast={showToast} />}
          {(form === "bikes" || form === "cars") && (
            <VehiclesAdmin
              key={form}
              type={form === "cars" ? "car" : "bike"}
              items={e[form]}
              showToast={showToast}
            />
          )}
          {form === "vehicles" && (
            <VehicleListingsAdmin listings={e.vehicles} showToast={showToast} />
          )}
          {form === "vehicleLeads" && (
            <VehicleLeadsAdmin leads={e.vehicleLeads} showToast={showToast} />
          )}
        </>
      </main>
      {textValue && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl"
        >
          {textValue}
        </div>
      )}
    </>
  );
}
