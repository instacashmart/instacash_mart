export function DetailRows({ rows, className = "space-y-2 text-sm text-slate-600" }) {
  return (
    <div className={className}>
      {rows.map(([s, n]) => (
        <div key={s} className="flex items-start justify-between gap-4">
          <span className="shrink-0">{s}</span>
          <span
            className={`text-right break-words ${n ? "font-bold text-slate-900" : "text-slate-400 italic"}`}
          >
            {n || "Not added"}
          </span>
        </div>
      ))}
    </div>
  );
}
