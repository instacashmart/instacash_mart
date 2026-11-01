import { Link } from "react-router-dom";
import { TestimonialCard, useTestimonials } from "../components/reviews/Testimonials";
import { BackToHome } from "../components/ui/BackToHome";
import { SectionHeader } from "../components/ui/SectionHeader";

export function ReviewsPage() {
  const t = useTestimonials();
  const e = t.reduce((total, item) => total + item.rating, 0) / t.length;
  return (
    <main>
      <BackToHome />
      <section className="reveal max-w-7xl mx-3 sm:mx-4 xl:mx-auto mt-4 mb-10 rounded-2xl border border-slate-200 bg-white py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <SectionHeader eyebrow="Customer Reviews" title="What Our Customers Say" className="">
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-extrabold text-slate-900">{e.toFixed(1)}</span>
                <span className="text-amber-400 text-sm">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <i
                      key={item}
                      className={`fa-solid fa-star ${item <= Math.round(e) ? "" : "text-slate-200"}`}
                    />
                  ))}
                </span>
                <span className="text-xs text-slate-500">
                  {t.length}
                  {" review"}
                  {t.length > 1 ? "s" : ""}
                </span>
              </div>
            </SectionHeader>
            <Link
              to="/feedback"
              className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
            >
              <i className="fa-solid fa-pen text-xs" />
              {" Write a review"}
            </Link>
          </div>
          <div className="reveal-group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.map((item) => (
              <TestimonialCard key={item.key} review={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
