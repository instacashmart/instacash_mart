import { useMemo, useState } from "react";
import { CloseButton, Modal } from "../ui/Modal";
import { formatDateTimeYear } from "../../lib/format";
import { store, useStoreList } from "../../lib/store";

const Stars = ({ value, className = "text-xs" }) => (
  <span
    className={`text-amber-400 whitespace-nowrap ${className}`}
    aria-label={`${value} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((item) => (
      <i
        key={item}
        className={`fa-solid fa-star ${item <= Math.round(value) ? "" : "text-slate-200"}`}
      />
    ))}
  </span>
);

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const productKey = (t) =>
  t.id ||
  `name:${String(t.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;

export function useProductReviews(t) {
  const reviewsList = useStoreList("reviews");
  return useMemo(() => {
    if (!t) {
      return {
        list: [],
        count: 0,
        avg: 0,
      };
    }
    const s = productKey(t);
    const list = reviewsList.filter((item) => item.productKey === s && item.status === "approved");
    const avg = list.length
      ? list.reduce((total, item) => total + Number(item.rating), 0) / list.length
      : 0;
    return {
      list,
      count: list.length,
      avg,
    };
  }, [reviewsList, t]);
}

function ReviewItem({ review }) {
  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <Stars value={review.rating} />
        <span className="text-xs font-bold text-slate-900">{review.name}</span>
        {review.orderId && (
          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
            <i className="fa-solid fa-circle-check text-[9px]" />
            {" Verified purchase"}
          </span>
        )}
        <span className="text-[10px] text-slate-400">{formatDateTimeYear(review.createdAt)}</span>
      </div>
      {review.text && (
        <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line break-words">
          {review.text}
        </p>
      )}
    </li>
  );
}

export function ReviewsSummary({ product, limit = 3, onSeeAll }) {
  const { list, count, avg } = useProductReviews(product);
  if (count) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-extrabold text-slate-900">{avg.toFixed(1)}</span>
          <Stars value={avg} />
          <span className="text-xs text-slate-500">
            {count}
            {" review"}
            {count > 1 ? "s" : ""}
          </span>
          {onSeeAll && count > limit && (
            <button
              type="button"
              onClick={onSeeAll}
              className="ml-auto text-xs font-bold text-brand-700 hover:text-brand-800"
            >
              See all
            </button>
          )}
        </div>
        <ul className="mt-3 divide-y divide-slate-100">
          {list.slice(0, limit).map((item) => (
            <ReviewItem key={item.id} review={item} />
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <p className="text-xs text-slate-500">
        No reviews yet. Buyers can review this product after ordering.
      </p>
    );
  }
}

export function ReviewForm({ product, orderId, defaultName = "" }) {
  const review = useStoreList("reviews").find((item) => item.orderId === orderId);
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [form, setForm] = useState(defaultName);
  const [textValue, setTextValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  if (review) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 text-left">
        <p className="text-xs font-bold text-brand-700">
          <i className="fa-solid fa-heart" />
          {" Thanks! Your review was submitted for moderation."}
        </p>
        <ul className="mt-3">
          <ReviewItem review={review} />
        </ul>
      </div>
    );
  }
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!rating) {
      setErrorMessage("Please choose a star rating.");
      return;
    }
    try {
      await store.addAndWait("reviews", {
        id: store.newId("RV"),
        createdAt: new Date().toISOString(),
        productKey: productKey(product),
        productName: product.name,
        orderId,
        name: form.trim() || "Customer",
        rating,
        text: textValue.trim(),
        status: "pending",
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  const S = count || rating;
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left space-y-3"
    >
      <div>
        <p className="text-sm font-extrabold text-slate-900">Rate this product</p>
        <p className="text-[11px] text-slate-500">
          Your review helps other shoppers. It will be marked as a verified purchase.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex gap-1"
          role="radiogroup"
          aria-label="Rating"
          onMouseLeave={() => setCount(0)}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={rating === item}
              aria-label={`${item} star${item > 1 ? "s" : ""}`}
              onMouseEnter={() => setCount(item)}
              onClick={() => {
                setRating(item);
                setErrorMessage("");
              }}
              className={`text-2xl transition-transform hover:scale-110 ${item <= S ? "text-amber-400" : "text-slate-300"}`}
            >
              <i className="fa-solid fa-star" />
            </button>
          ))}
        </div>
        <span className="text-xs font-bold text-slate-700">{ratingLabels[S]}</span>
      </div>
      <input
        value={form}
        onChange={(evt) => setForm(evt.target.value)}
        maxLength={40}
        aria-label="Name shown with your review"
        placeholder="Name shown with your review"
        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <textarea
        value={textValue}
        onChange={(evt) => setTextValue(evt.target.value)}
        rows={3}
        maxLength={500}
        aria-label="Your review"
        placeholder="What did you like or dislike? (optional)"
        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
      />
      {errorMessage && (
        <p role="alert" className="text-xs font-semibold text-red-700">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition"
      >
        Post Review
      </button>
    </form>
  );
}

export function ReviewsPanel({ product, onClose }) {
  const { list, count, avg } = useProductReviews(product);
  if (product) {
    return (
      <Modal open onClose={onClose} className="max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Customer reviews
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
              {product.name}
            </h3>
            {count > 0 && (
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-extrabold text-slate-900">{avg.toFixed(1)}</span>
                <Stars value={avg} />
                {count}
                {" review"}
                {count > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <CloseButton onClick={onClose} label="Close reviews" />
        </div>
        {count ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {list.map((item) => (
              <ReviewItem key={item.id} review={item} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-slate-500 text-center">
            No reviews yet. Buyers can review this product after ordering.
          </p>
        )}
      </Modal>
    );
  } else {
    return null;
  }
}
