export const formatPrice = (t) => `₹${Number(t || 0).toLocaleString("en-IN")}`;

export const formatPriceCompact = (t) => {
  const e = Number(t || 0);
  if (e >= 100000) {
    return `₹${Number((e / 100000).toFixed(2))} Lakh`;
  } else {
    return formatPrice(e);
  }
};

export const formatDateTime = (t) =>
  t
    ? new Date(t).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export const formatDateTimeYear = (t) =>
  t
    ? new Date(t).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export const formatDate = (
  t,
  e = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  },
) => (t ? new Date(`${t}T00:00:00`).toLocaleDateString("en-IN", e) : "");

export const todayIso = () => {
  const t = new Date();
  return new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const orderSummary = (t, e) =>
  t === "sell"
    ? [e.model, [e.storage, e.ram && `${e.ram} RAM`].filter(Boolean).join(" • ")]
        .filter(Boolean)
        .join(" — ")
    : e.product;
