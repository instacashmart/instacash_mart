import { useSearchParams } from "react-router-dom";
import { MyOrders } from "../components/track/MyOrders";
import { TrackForm } from "../components/track/TrackForm";
import { BackToHome } from "../components/ui/BackToHome";

export function TrackPage() {
  const [t, e] = useSearchParams();
  const initialId = t.get("id") || "";
  const handleSelect = (a) => {
    var r;
    e({
      id: a,
    });
    if ((r = document.getElementById("trackingInput")) != null) {
      r.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <main>
      <BackToHome />
      <section
        id="track"
        className="max-w-3xl mx-3 sm:mx-4 md:mx-auto mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
      >
        <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
          Track Your Order
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Sell pickups (CN-…) and accessory orders (CNB-…)
        </p>
        <TrackForm
          initialId={initialId}
          large
          emptyText="Enter the order ID from your confirmation, or pick one from My Orders below."
        />
      </section>
      <MyOrders onSelect={handleSelect} className="mt-4 p-4 sm:p-6" />
    </main>
  );
}
