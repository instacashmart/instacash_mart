const sellers = {
  nova: {
    name: "InstaCashMart Certified",
    rating: 4.9,
    sales: 12480,
    verified: true,
  },
  volt: {
    name: "Volt Accessories Hub",
    rating: 4.7,
    sales: 8940,
    verified: true,
  },
  garage: {
    name: "Gadget Garage",
    rating: 4.8,
    sales: 3210,
    verified: true,
  },
  renew: {
    name: "ReNew Mobiles",
    rating: 4.6,
    sales: 1845,
    verified: true,
  },
  casecraft: {
    name: "CaseCraft Store",
    rating: 4.5,
    sales: 2310,
    verified: true,
  },
  urban: {
    name: "Urban Tech Traders",
    rating: 4.3,
    sales: 620,
    verified: false,
  },
};

export const accessoryCategories = [
  {
    key: "all",
    label: "All",
    icon: "fa-border-all",
  },
  {
    key: "Chargers",
    label: "Chargers",
    icon: "fa-plug",
  },
  {
    key: "Cables",
    label: "Cables",
    icon: "fa-plug-circle-bolt",
  },
  {
    key: "Cases",
    label: "Cases & Covers",
    icon: "fa-shield-halved",
  },
  {
    key: "Screen Guards",
    label: "Screen Guards",
    icon: "fa-mobile-screen",
  },
  {
    key: "Audio",
    label: "Earbuds & Audio",
    icon: "fa-headphones",
  },
  {
    key: "Power Banks",
    label: "Power Banks",
    icon: "fa-battery-full",
  },
  {
    key: "Watch Bands",
    label: "Watch Bands",
    icon: "fa-clock",
  },
  {
    key: "Mounts",
    label: "Mounts & Stands",
    icon: "fa-car",
  },
];

export const productCategories = accessoryCategories.filter(
  (accessoryCategory) => accessoryCategory.key !== "all",
);

export const categoryLabel = (t) =>
  (accessoryCategories.find((accessoryCategory) => accessoryCategory.key === t) || {}).label || t;

export const categoryIcon = (t) =>
  (accessoryCategories.find((accessoryCategory) => accessoryCategory.key === t) || {}).icon ||
  "fa-box";

export const makeProduct = (t, e, s, n, a, r, o, l, c, u) => ({
  id: t,
  name: s,
  brand: n,
  category: e,
  specs: a,
  rating: r,
  price: o,
  mrp: l,
  sellerKey: c,
  image: u,
  grade: "New",
  icon: categoryIcon(e),
  warranty: "1 year",
  replacement: "7 days",
});

export const sellerOf = (t) => sellers[t.sellerKey] || sellers.nova;

export const discountPercent = (t) => Math.round((1 - t.price / t.mrp) * 100);

export const searchTokens = (t) =>
  t
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((item) => (item.length > 3 ? item.replace(/s$/, "") : item));

export function matchesSearch(t, e) {
  const s =
    `${t.name} ${t.brand} ${t.category} ${categoryLabel(t.category)} ${t.specs} ${sellerOf(t).name}`.toLowerCase();
  return e.every((item) => s.includes(item));
}
