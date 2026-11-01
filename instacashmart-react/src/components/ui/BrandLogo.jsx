export function BrandLogo({ brand, large = false }) {
  if (!brand.logo) {
    const n = brand.wordmark.text.length > 7;
    const a = large ? (n ? "text-xl" : "text-3xl") : n ? "text-base" : "text-xl";
    return (
      <span
        className={`inline-flex items-center gap-[0.3em] leading-none whitespace-nowrap ${a} ${brand.wordmark.className}`}
      >
        {brand.wordmark.icon && <i className={brand.wordmark.icon} aria-hidden="true" />}
        {brand.wordmark.text}
      </span>
    );
  }
  const s = brand.wide
    ? large
      ? "max-h-10 max-w-[10rem]"
      : "max-h-7 max-w-[6.5rem]"
    : large
      ? "h-14 w-14"
      : "h-10 w-10";
  return <img src={brand.logo} alt={`${brand.name} logo`} className={`${s} object-contain`} />;
}
