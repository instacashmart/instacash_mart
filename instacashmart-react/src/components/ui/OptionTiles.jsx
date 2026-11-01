export function OptionTiles({
  name: name2,
  options,
  value,
  onChange,
  columns = "grid-cols-3",
  tileClass = "p-2.5 border border-slate-200 rounded-xl text-center text-xs font-bold text-slate-800",
}) {
  return (
    <div className={`grid ${columns} gap-2`}>
      {options.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="radio"
            name={name2}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <div
            className={`${tileClass} peer-checked:border-brand-600 peer-checked:bg-brand-50/50 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 transition`}
          >
            {option.content}
          </div>
        </label>
      ))}
    </div>
  );
}
