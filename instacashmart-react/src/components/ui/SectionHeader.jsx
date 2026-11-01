export function SectionHeader({ eyebrow, title, children, className = "max-w-2xl mb-6" }) {
  return (
    <div className={className}>
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {eyebrow}
      </span>
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
