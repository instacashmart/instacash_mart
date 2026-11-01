import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isGoogleUser, signInWithGoogle, signOutUser, useFirebaseUser } from "../lib/auth";
import { store, useStoreList } from "../lib/store";

const emptyProfile = {
  name: "",
  phone: "",
  address: "",
};

function OrderRow({ item, type }) {
  const s =
    type === "sell"
      ? [item.model, item.storage].filter(Boolean).join(" • ") || "Sell pickup"
      : item.product || "Shop order";
  return (
    <Link
      to={`/track?id=${encodeURIComponent(item.id)}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-900">{s}</span>
        <span className="mt-1 block text-xs text-slate-500">
          {type === "sell" ? "Sell pickup" : "Shop order"}
          {" · "}
          {item.id}
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
        {item.status || "New"}
      </span>
    </Link>
  );
}

function OrderHistory({ id, title, orders }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-3 text-lg font-extrabold text-slate-900">{title}</h2>
      {orders.length ? (
        <div className="space-y-2">
          {orders.map(({ item, type }) => (
            <OrderRow key={`${type}-${item.id}`} item={item} type={type} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
          {"No "}
          {title.toLowerCase()}
          {" yet."}
        </p>
      )}
    </section>
  );
}

export function ProfilePage() {
  const { showToast } = useApp();
  const { user, authReady } = useFirebaseUser();
  const sellList = useStoreList("sell");
  const buyList = useStoreList("buy");
  const [form, setForm] = useState(emptyProfile);
  const [flag, setFlag] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const y = useMemo(
    () =>
      [
        ...sellList.map((item) => ({
          item,
          type: "sell",
        })),
        ...buyList.map((item) => ({
          item,
          type: "buy",
        })),
      ].sort((O, C) =>
        String(C.item.createdAt || "").localeCompare(String(O.item.createdAt || "")),
      ),
    [sellList, buyList],
  );
  const b = y.filter(({ item }) => item.status === "Cancelled");
  const B = y.filter(({ item }) => item.status === "Paid" || item.status === "Delivered");
  useEffect(() => {
    try {
      const O = localStorage.getItem("instacashmart.profile");
      const C = O ? JSON.parse(O) : {};
      const v = store.list("sell").find((item) => item.phone || item.address);
      setForm({
        name: C.name || "",
        phone: C.phone || v?.phone || "",
        address: C.address || v?.address || "",
      });
    } catch (error) {
      console.error("Unable to load saved profile details.", error);
      showToast("Unable to load saved profile details.");
    }
  }, [showToast, user?.uid, user?.displayName]);
  const handleGoogleSignIn = async () => {
    setAuthBusy(true);
    setAuthError("");
    try {
      const signedInUser = await signInWithGoogle();
      setForm((current) => ({
        ...current,
        name: current.name || signedInUser.displayName || "",
      }));
      showToast("Signed in with Google.");
    } catch (error) {
      setAuthError(error.message || "Unable to sign in with Google.");
    } finally {
      setAuthBusy(false);
    }
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(
        "instacashmart.profile",
        JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        }),
      );
      setForm((C) => ({
        name: C.name.trim(),
        phone: C.phone.trim(),
        address: C.address.trim(),
      }));
      setFlag(false);
      showToast("Profile details saved on this device.");
    } catch (error) {
      console.error("Unable to save profile details.", error);
      showToast("Unable to save profile details. Check your browser storage.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="mx-auto my-6 max-w-5xl space-y-6 px-4 pb-10 sm:my-10">
      <section className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">
          {(form.name || "U").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Your Profile</h1>
          <p className="truncate text-sm text-slate-500">Your saved details and account orders.</p>
        </div>
      </section>
      <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="h-10 w-10 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <i className={`fa-brands ${user ? "fa-google" : "fa-user"}`} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {user
              ? user.displayName || (isGoogleUser(user) ? "Google account connected" : "Signed in")
              : "Sign in to your account"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {user?.email || "Use Google to securely save and view your pickup orders."}
          </p>
        </div>
        {user && isGoogleUser(user) ? (
          <button
            type="button"
            onClick={() => signOutUser().catch((error) => setAuthError(error.message))}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!authReady || authBusy}
            className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {authBusy ? "Opening Google…" : "Continue with Google"}
          </button>
        )}
        {user && !isGoogleUser(user) && (
          <button
            type="button"
            onClick={() => signOutUser().catch((error) => setAuthError(error.message))}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        )}
        {authError && <p role="alert" className="basis-full text-xs text-red-700">{authError}</p>}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
              {"Contact & Pickup Details"}
            </p>
            {!flag && (
              <>
                <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                  {form.name || "Add your contact name"}
                </h2>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>{form.phone || "Phone number not added"}</p>
                  <p className="whitespace-pre-wrap">
                    {form.address || "Pickup address not added"}
                  </p>
                </div>
              </>
            )}
          </div>
          {!flag && (
            <button
              type="button"
              onClick={() => setFlag(true)}
              className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
            >
              Edit Profile
            </button>
          )}
        </div>
        {flag && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              {"Contact name"}
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(evt) =>
                  setForm((C) => ({
                    ...C,
                    name: evt.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              {"Phone number"}
              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(evt) =>
                  setForm((C) => ({
                    ...C,
                    phone: evt.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              {"Pickup address"}
              <textarea
                autoComplete="street-address"
                rows={3}
                value={form.address}
                onChange={(evt) =>
                  setForm((C) => ({
                    ...C,
                    address: evt.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={() => setFlag(false)}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Contact and pickup details are saved in this browser.
            </p>
          </form>
        )}
      </section>
      <section className="grid gap-3 sm:grid-cols-2">
        <a
          href="#cancelled-history"
          className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-300"
        >
          <span className="block text-sm font-bold text-slate-900">
            {"Cancelled History ("}
            {b.length}
            {")"}
          </span>
          <span className="mt-1 block text-xs font-semibold text-brand-700">
            {"View cancelled orders "}
            <i className="fa-solid fa-arrow-right ml-1" />
          </span>
        </a>
        <a
          href="#successful-history"
          className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-300"
        >
          <span className="block text-sm font-bold text-slate-900">
            {"Successful History ("}
            {B.length}
            {")"}
          </span>
          <span className="mt-1 block text-xs font-semibold text-brand-700">
            {"View completed orders "}
            <i className="fa-solid fa-arrow-right ml-1" />
          </span>
        </a>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-extrabold text-slate-900">
          {"Sell Requests & Shop Orders"}
        </h2>
        {y.length ? (
          <div className="space-y-2">
            {y.map(({ item, type }) => (
              <OrderRow key={`${type}-${item.id}`} item={item} type={type} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <p className="text-sm font-bold text-slate-800">No requests or orders yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Your sell pickups and shop orders will appear here.
            </p>
            <Link
              to="/devices"
              className="mt-4 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Explore devices
            </Link>
          </div>
        )}
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <OrderHistory
          id="cancelled-history"
          title="Cancelled History"
          orders={b.map(({ item, type }) => ({
            item,
            type,
          }))}
        />
        <OrderHistory
          id="successful-history"
          title="Successful History"
          orders={B.map(({ item, type }) => ({
            item,
            type,
          }))}
        />
      </div>
    </main>
  );
}
