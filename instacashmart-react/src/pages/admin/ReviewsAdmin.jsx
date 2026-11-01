import { formatDateTimeYear } from "../../lib/format";
import { store } from "../../lib/store";
import { EmptyNote, RatingStars } from "./shared";

export function ReviewsAdmin({ reviews, showToast }) {
  const s = (a) => {
    if (
      window.confirm(
        `Delete ${a.name}'s review of "${a.productName}"? Shoppers will no longer see it.`,
      )
    ) {
      store.remove("reviews", a.id);
      showToast("Review deleted");
    }
  };
  const n = (a) => {
    const status2 = a.status === "approved" ? "pending" : "approved";
    store.update("reviews", a.id, {
      status: status2,
    });
    showToast(status2 === "approved" ? "Review approved" : "Approval removed");
  };
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-base font-bold text-slate-900">Product Reviews</h2>
      <p className="text-xs text-slate-500 mt-0.5">
        Posted by buyers after placing an order. Shoppers see them on the product; delete any that
        break the rules.
      </p>
      <div className="mt-4 space-y-3">
        {reviews.length ? (
          reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                    {review.productName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <h3 className="text-sm font-bold text-slate-900">{review.name}</h3>
                    <RatingStars value={Number(review.rating) || 0} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDateTimeYear(review.createdAt)}
                    {review.orderId && (
                      <>
                        {" "}
                        {"· order "}
                        <span className="font-mono">{review.orderId}</span>
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => n(review)}
                  className="px-3 h-8 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 hover:border-slate-900 transition"
                >
                  {review.status === "approved" ? "Unapprove" : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() => s(review)}
                  aria-label="Delete review"
                  className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-300 transition"
                >
                  <i className="fa-solid fa-trash-can text-xs" />
                </button>
              </div>
              {review.text && (
                <p className="mt-3 text-sm text-slate-700 whitespace-pre-line break-words">
                  {review.text}
                </p>
              )}
            </article>
          ))
        ) : (
          <EmptyNote>
            No reviews yet. They appear here when a buyer rates a product after ordering.
          </EmptyNote>
        )}
      </div>
    </section>
  );
}
