import { useMemo } from "react";
import { testimonials } from "../../data/site";
import { useStoreList } from "../../lib/store";

export function TestimonialCard({ review }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div
          className="flex items-center text-amber-400 text-xs mb-3"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <i
              key={item}
              className={`fa-solid fa-star ${item <= review.rating ? "" : "text-slate-200"}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed italic break-words">{review.text}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 shrink-0 rounded-full ${review.avatarClass} font-bold flex items-center justify-center text-xs`}
          >
            {review.initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{review.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{review.meta}</p>
          </div>
        </div>
        {review.fresh ? (
          <span className="shrink-0 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            New
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
            {review.badge}
          </span>
        )}
      </div>
    </div>
  );
}

const avatarClasses = [
  "bg-brand-100 text-brand-700",
  "bg-slate-100 text-slate-900",
  "bg-amber-100 text-amber-700",
];

const initialsOf = (t) =>
  String(t)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => {
      return item[0]?.toUpperCase() || "";
    })
    .join("") || "?";

function usePublicFeedback() {
  const feedbackList = useStoreList("feedback");
  return useMemo(
    () =>
      feedbackList
        .filter((item) => item.status === "approved" && item.public && !item.hidden && item.message)
        .map((item, index) => ({
          key: item.id,
          name: item.name || "Customer",
          initials: initialsOf(item.name),
          avatarClass: avatarClasses[index % avatarClasses.length],
          meta: `${item.topic} • ${new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`,
          rating: Number(item.rating) || 0,
          text: `"${item.message}"`,
          fresh: true,
        })),
    [feedbackList],
  );
}

export function useTestimonials() {
  const t = usePublicFeedback();
  return useMemo(
    () => [
      ...t,
      ...testimonials.map((testimonial) => ({
        ...testimonial,
        key: testimonial.name,
        rating: 5,
        badge: testimonial.amount,
      })),
    ],
    [t],
  );
}
