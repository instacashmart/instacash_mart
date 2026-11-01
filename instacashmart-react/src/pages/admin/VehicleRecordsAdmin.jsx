import { getVehicleType } from "../../data/vehicles";
import { formatDate, formatDateTimeYear, formatPrice, formatPriceCompact } from "../../lib/format";
import { store } from "../../lib/store";
import { EmptyNote, phoneLink } from "./shared";

const listingStatuses = ["Pending", "Live", "Sold", "Hidden"];

const leadStatuses = ["New", "Contacted", "Closed"];

function VehicleRecordCard({ type, item, title, statuses, rows, media, showToast }) {
  const l = (u) => {
    store.update(type, item.id, {
      status: u,
    });
    showToast(`${item.id}: ${u}`);
  };
  const handleClick = () => {
    if (window.confirm(`Delete ${item.id}? This cannot be undone.`)) {
      store.remove(type, item.id);
      showToast(`${item.id} deleted`);
    }
  };
  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {media}
          <div className="min-w-0">
            <p className="text-[11px] font-mono font-bold text-brand-700">{item.id}</p>
            <h3 className="text-sm font-bold text-slate-900 break-words">{title}</h3>
            <p className="text-[11px] text-slate-400">{formatDateTimeYear(item.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {statuses.map((status2) => (
              <button
                key={status2}
                type="button"
                onClick={() => l(status2)}
                aria-pressed={item.status === status2}
                className={`px-2.5 h-8 text-[11px] font-bold transition ${item.status === status2 ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {status2}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleClick}
            aria-label="Delete"
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300 transition"
          >
            <i className="fa-solid fa-trash-can text-xs" />
          </button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
        {rows
          .filter(([, u]) => u)
          .map(([u, m]) => (
            <div key={u} className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-slate-500">{u}</span>
              <span className="text-right font-semibold text-slate-900 break-words">{m}</span>
            </div>
          ))}
      </div>
    </article>
  );
}

export function VehicleListingsAdmin({ listings, showToast }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-base font-bold text-slate-900">{"Bike & Car Listings"}</h2>
      <p className="text-xs text-slate-500 mt-0.5">
        {
          "Posted on Sell Bike or Car. Only Live listings show on Buy Bikes & Cars; mark Sold or Hidden to take one down."
        }
      </p>
      <div className="mt-4 space-y-3">
        {listings.length ? (
          listings.map((listing) => (
            <VehicleRecordCard
              key={listing.id}
              type="vehicles"
              item={listing}
              statuses={listingStatuses}
              showToast={showToast}
              title={`${listing.year} ${listing.brand} ${listing.model}${listing.variant ? ` ${listing.variant}` : ""}`}
              media={
                listing.image ? (
                  <img
                    src={listing.image}
                    alt=""
                    className="w-14 h-14 shrink-0 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <span className="w-14 h-14 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
                    <i
                      className={`fa-solid ${getVehicleType(listing.type).icon} text-xl text-slate-500`}
                    />
                  </span>
                )
              }
              rows={[
                ["Asking price", formatPriceCompact(listing.price)],
                [
                  "Our estimate",
                  listing.estimate ? formatPriceCompact(listing.estimate) : "No estimate",
                ],
                ["Type", getVehicleType(listing.type).label],
                ["Kms driven", `${Number(listing.km).toLocaleString("en-IN")} km`],
                ["Fuel / gears", `${listing.fuel} • ${listing.transmission}`],
                ["Owners", listing.owners],
                ["City", listing.city],
                ["Seller", listing.sellerName],
                ["Mobile", phoneLink(listing.phone)],
                ["Description", listing.description],
              ]}
            />
          ))
        ) : (
          <EmptyNote>
            No listings yet. They appear here when someone posts a bike or car on the Sell Bike or
            Car page.
          </EmptyNote>
        )}
      </div>
    </section>
  );
}

export function VehicleLeadsAdmin({ leads, showToast }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-base font-bold text-slate-900">{"Bike & Car Enquiries"}</h2>
      <p className="text-xs text-slate-500 mt-0.5">
        Call-back, test ride/drive and offer requests sent with Contact Seller.
      </p>
      <div className="mt-4 space-y-3">
        {leads.length ? (
          leads.map((lead) => (
            <VehicleRecordCard
              key={lead.id}
              type="vehicleLeads"
              item={lead}
              statuses={leadStatuses}
              showToast={showToast}
              title={`${lead.purpose}: ${lead.vehicle}`}
              rows={[
                ["Buyer", lead.name],
                ["Buyer mobile", phoneLink(lead.phone)],
                ["Listed price", formatPriceCompact(lead.price)],
                ["Offer", lead.offer ? formatPrice(lead.offer) : ""],
                ["Test date", formatDate(lead.date)],
                ["City", lead.city],
                ["Seller", lead.seller],
                ["Seller mobile", phoneLink(lead.sellerPhone)],
                ["Listing", lead.vehicleId],
                ["Message", lead.message],
              ]}
            />
          ))
        ) : (
          <EmptyNote>
            No enquiries yet. They appear here when a buyer presses Contact Seller on a bike or car.
          </EmptyNote>
        )}
      </div>
    </section>
  );
}
