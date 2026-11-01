import { useMemo } from "react";
import { useStoreList } from "../lib/store";
import imageBike from "../assets/images/image-bike.svg";
import imageCar from "../assets/images/image-car.svg";
import logoHonda from "../assets/images/logo-honda.svg";
import logoHyundai from "../assets/images/logo-hyundai.svg";
import logoKia from "../assets/images/logo-kia.svg";
import logoKtm from "../assets/images/logo-ktm.svg";
import logoMahindra from "../assets/images/logo-mahindra.svg";
import logoMg from "../assets/images/logo-mg.svg";
import logoSkoda from "../assets/images/logo-skoda.svg";
import logoSuzuki from "../assets/images/logo-suzuki.svg";
import logoTata from "../assets/images/logo-tata.svg";
import logoToyota from "../assets/images/logo-toyota.svg";
import logoVolkswagen from "../assets/images/logo-volkswagen.svg";
import logoYamaha from "../assets/images/logo-yamaha.svg";
import tileimageBike from "../assets/images/tileimage-bike.webp";
import tileimageCar from "../assets/images/tileimage-car.webp";

export const vehicleTypes = [
  {
    key: "bike",
    label: "Bikes & Scooters",
    short: "Bike",
    tile: "Bikes",
    icon: "fa-motorcycle",
    image: imageBike,
    tileImage: tileimageBike,
  },
  {
    key: "car",
    label: "Cars",
    short: "Car",
    tile: "Cars",
    icon: "fa-car-side",
    image: imageCar,
    tileImage: tileimageCar,
  },
];

export const vehicleBasePath = (t) => (t === "car" ? "/cars" : "/bikes");

export const slugify = (t) =>
  String(t)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const vehicleBrandPath = (t, e) => `${vehicleBasePath(t)}/${slugify(e)}`;

export const vehicleModelPath = (t, e, s) => `${vehicleBrandPath(t, e)}/${slugify(s)}`;

export const vehicleBrowsePath = (t, e) => {
  const s = new URLSearchParams({
    ...(t === "car" && {
      type: t,
    }),
    ...e,
  }).toString();
  return `/bikes-cars${s ? `?${s}` : ""}`;
};

export const getVehicleType = (t) =>
  vehicleTypes.find((vehicleType) => vehicleType.key === t) || vehicleTypes[0];

export const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];

export const transmissionTypes = ["Manual", "Automatic"];

export const ownerOptions = ["1st", "2nd", "3rd+"];

export const priceBands = {
  bike: [
    ["Under ₹50,000", 0, 50000],
    ["₹50,000 – ₹1 Lakh", 50000, 100000],
    ["₹1 – 2 Lakh", 100000, 200000],
    ["Above ₹2 Lakh", 200000, Infinity],
  ],
  car: [
    ["Under ₹5 Lakh", 0, 500000],
    ["₹5 – 10 Lakh", 500000, 1000000],
    ["₹10 – 20 Lakh", 1000000, 2000000],
    ["Above ₹20 Lakh", 2000000, Infinity],
  ],
};

export const vehicleModels = {
  bike: {
    "Royal Enfield": {
      "Classic 350": 195000,
      "Bullet 350": 175000,
      "Hunter 350": 150000,
      "Himalayan 450": 285000,
    },
    Honda: {
      "Activa 6G": 78000,
      "Shine 100": 66000,
      "SP 125": 90000,
      CB350: 210000,
    },
    Hero: {
      "Splendor Plus": 76000,
      "HF Deluxe": 60000,
      "Xtreme 160R": 130000,
    },
    TVS: {
      Jupiter: 76000,
      "Apache RTR 160 4V": 125000,
      "Raider 125": 95000,
      "Ntorq 125": 85000,
    },
    Bajaj: {
      "Pulsar 150": 112000,
      "Pulsar NS200": 150000,
      "Dominar 400": 230000,
    },
    Yamaha: {
      "R15 V4": 185000,
      "FZ-S": 125000,
      "MT-15": 170000,
    },
    KTM: {
      "Duke 200": 200000,
      "Duke 390": 310000,
      "RC 200": 220000,
    },
    Suzuki: {
      "Access 125": 82000,
      Gixxer: 145000,
    },
    Ather: {
      "450X": 145000,
    },
    Ola: {
      "S1 Pro": 130000,
    },
  },
  car: {
    "Maruti Suzuki": {
      Swift: 650000,
      Baleno: 700000,
      Dzire: 700000,
      Brezza: 900000,
      "Wagon R": 560000,
      Ertiga: 950000,
    },
    Hyundai: {
      i20: 750000,
      Creta: 1200000,
      Venue: 850000,
      Verna: 1150000,
    },
    Tata: {
      Nexon: 900000,
      Punch: 650000,
      Harrier: 1600000,
      "Nexon EV": 1450000,
    },
    Mahindra: {
      XUV700: 1650000,
      Thar: 1300000,
      "Scorpio-N": 1500000,
      "XUV 3XO": 900000,
    },
    Kia: {
      Seltos: 1200000,
      Sonet: 900000,
    },
    Honda: {
      City: 1250000,
      Amaze: 750000,
    },
    Toyota: {
      "Innova Crysta": 2000000,
      Fortuner: 3500000,
      Glanza: 750000,
    },
    MG: {
      Hector: 1600000,
    },
    Volkswagen: {
      Virtus: 1250000,
    },
    Skoda: {
      Slavia: 1200000,
    },
  },
};

export const vehicleBrands = {
  bike: [
    {
      key: "Royal Enfield",
      wordmark: {
        text: "Royal Enfield",
        className: "font-serif font-bold text-[#8B1E1E]",
      },
    },
    {
      key: "Honda",
      logo: logoHonda,
    },
    {
      key: "Hero",
      wordmark: {
        text: "Hero",
        className: "font-black italic text-[#E11B22] tracking-tight",
      },
    },
    {
      key: "TVS",
      wordmark: {
        text: "TVS",
        className: "font-black italic text-[#1C3F94]",
      },
    },
    {
      key: "Bajaj",
      wordmark: {
        text: "BAJAJ",
        className: "font-extrabold text-[#0B4EA2] tracking-[0.12em]",
      },
    },
    {
      key: "Yamaha",
      logo: logoYamaha,
    },
    {
      key: "KTM",
      logo: logoKtm,
      wide: true,
    },
    {
      key: "Suzuki",
      logo: logoSuzuki,
    },
    {
      key: "Ather",
      wordmark: {
        text: "ather",
        className: "font-bold text-slate-900 tracking-tight",
      },
    },
    {
      key: "Ola",
      wordmark: {
        text: "ola",
        className: "font-black text-slate-900",
      },
    },
  ],
  car: [
    {
      key: "Maruti Suzuki",
      logo: logoSuzuki,
    },
    {
      key: "Hyundai",
      logo: logoHyundai,
      wide: true,
    },
    {
      key: "Tata",
      logo: logoTata,
    },
    {
      key: "Mahindra",
      logo: logoMahindra,
      wide: true,
    },
    {
      key: "Kia",
      logo: logoKia,
      wide: true,
    },
    {
      key: "Honda",
      logo: logoHonda,
    },
    {
      key: "Toyota",
      logo: logoToyota,
    },
    {
      key: "MG",
      logo: logoMg,
    },
    {
      key: "Volkswagen",
      logo: logoVolkswagen,
    },
    {
      key: "Skoda",
      logo: logoSkoda,
    },
  ],
};

function getVehicleBrand(t, e) {
  const s = vehicleBrands[t]?.find((o) => o.key.toLowerCase() === String(e).toLowerCase());
  const n = Object.keys(vehicleModels[t]?.[s?.key] || {});
  return {
    name: e,
    tagline: n.slice(0, 3).join(", "),
    ...(s || {
      key: e,
      wordmark: {
        text: e,
        className: "font-extrabold text-slate-900 tracking-tight",
      },
    }),
  };
}

export function brandsWithListings(t, e) {
  const s = t.filter((item) => item.type === e);
  const n = [...vehicleBrands[e].map((item) => item.key)];
  for (const a of s) {
    if (!n.some((item) => item.toLowerCase() === a.brand.toLowerCase())) {
      n.push(a.brand);
    }
  }
  return n.map((item) => {
    const r = s.filter((item2) => item2.brand.toLowerCase() === item.toLowerCase());
    return {
      ...getVehicleBrand(e, item),
      count: r.length,
      from: r.length ? Math.min(...r.map((item2) => item2.price)) : 0,
    };
  });
}

const sellerTypes = {
  assured: {
    label: "InstaCashMart Assured",
    verified: true,
  },
  dealer: {
    label: "Dealer",
    verified: true,
  },
  owner: {
    label: "Individual owner",
    verified: false,
  },
};

export const sellerTypeOf = (t) => sellerTypes[t.sellerType] || sellerTypes.owner;

const vehicleImageFiles = import.meta.glob("../assets/vehicles/models/*", {
  eager: true,
  import: "default",
});

const vehicleImageSlugs = {
  "Royal Enfield/Classic 350": "re-classic-350",
  "Royal Enfield/Hunter 350": "re-hunter-350",
  "Honda/Activa 6G": "honda-activa-6g",
  "Honda/CB350": "honda-cb350",
  "Yamaha/R15 V4": "yamaha-r15-v4",
  "Bajaj/Pulsar NS200": "bajaj-pulsar-ns200",
  "KTM/Duke 390": "ktm-duke-390",
  "TVS/Apache RTR 160 4V": "tvs-apache-rtr-160-4v",
  "Hero/Splendor Plus": "hero-splendor-plus",
  "Suzuki/Access 125": "suzuki-access-125",
  "Ola/S1 Pro": "ola-s1-pro",
  "Maruti Suzuki/Swift": "maruti-swift",
  "Maruti Suzuki/Baleno": "maruti-baleno",
  "Hyundai/Creta": "hyundai-creta",
  "Hyundai/i20": "hyundai-i20",
  "Tata/Nexon": "tata-nexon",
  "Tata/Nexon EV": "tata-nexon-ev",
  "Tata/Punch": "tata-punch",
  "Mahindra/XUV700": "mahindra-xuv700",
  "Mahindra/Thar": "mahindra-thar",
  "Honda/City": "honda-city",
  "Kia/Seltos": "kia-seltos",
  "Toyota/Innova Crysta": "toyota-innova-crysta",
};

const vehicleModelImage = (t, e) => {
  const s = vehicleImageSlugs[`${t}/${e}`];
  return s && vehicleImageFiles[`../assets/vehicles/models/${s}.webp`];
};

export function modelsWithListings(t, e, s) {
  const n = t.filter((item) => item.type === e && item.brand.toLowerCase() === s.toLowerCase());
  const a = vehicleModels[e][s] || {};
  const r = Object.keys(a);
  for (const o of n) {
    if (!r.some((item) => item.toLowerCase() === o.model.toLowerCase())) {
      r.push(o.model);
    }
  }
  return r.map((item) => {
    const listings = n.filter((item2) => item2.model.toLowerCase() === item.toLowerCase());
    return {
      name: item,
      newPrice: a[item],
      listings,
      image: vehicleModelImage(s, item) || listings.find((listing) => listing.image)?.image,
    };
  });
}

const makeVehicle = (t, e, s, n, a, r, o, l, c, u, m, p, h, _) => ({
  id: t,
  type: e,
  brand: s,
  model: n,
  variant: a,
  year: r,
  km: o,
  fuel: l,
  transmission: c,
  owners: u,
  city: m,
  price: p,
  sellerType: h,
  sellerName: _,
  image: vehicleModelImage(s, n),
  builtIn: true,
});

const vehicleSeedRows = [
  [
    "bike",
    "Royal Enfield",
    "Classic 350",
    "Signals",
    2022,
    14500,
    "Petrol",
    "Manual",
    "1st",
    "Bengaluru",
    158000,
    "assured",
    "InstaCashMart Assured",
  ],
  [
    "bike",
    "Honda",
    "Activa 6G",
    "DLX",
    2021,
    18200,
    "Petrol",
    "Automatic",
    "1st",
    "Hyderabad",
    52000,
    "owner",
    "Sandeep R.",
  ],
  [
    "bike",
    "Yamaha",
    "R15 V4",
    "Racing Blue",
    2023,
    9800,
    "Petrol",
    "Manual",
    "1st",
    "Pune",
    152000,
    "dealer",
    "Speedway Motors",
  ],
  [
    "bike",
    "Bajaj",
    "Pulsar NS200",
    "ABS",
    2020,
    26500,
    "Petrol",
    "Manual",
    "2nd",
    "Delhi NCR",
    82000,
    "owner",
    "Amit K.",
  ],
  [
    "bike",
    "KTM",
    "Duke 390",
    "Gen 2",
    2022,
    12400,
    "Petrol",
    "Manual",
    "1st",
    "Mumbai",
    228000,
    "assured",
    "InstaCashMart Assured",
  ],
  [
    "bike",
    "TVS",
    "Apache RTR 160 4V",
    "Dual Disc",
    2021,
    21000,
    "Petrol",
    "Manual",
    "1st",
    "Chennai",
    78000,
    "dealer",
    "Chennai Two Wheels",
  ],
  [
    "bike",
    "Hero",
    "Splendor Plus",
    "i3S",
    2019,
    34000,
    "Petrol",
    "Manual",
    "2nd",
    "Kolkata",
    38000,
    "owner",
    "Debashis M.",
  ],
  [
    "bike",
    "Ather",
    "450X",
    "Gen 3",
    2023,
    8600,
    "Electric",
    "Automatic",
    "1st",
    "Bengaluru",
    98000,
    "assured",
    "InstaCashMart Assured",
  ],
  [
    "bike",
    "Royal Enfield",
    "Hunter 350",
    "Metro Rebel",
    2023,
    7200,
    "Petrol",
    "Manual",
    "1st",
    "Jaipur",
    132000,
    "dealer",
    "Pink City Motors",
  ],
  [
    "bike",
    "Suzuki",
    "Access 125",
    "Special Edition",
    2022,
    11000,
    "Petrol",
    "Automatic",
    "1st",
    "Ahmedabad",
    62000,
    "owner",
    "Hetal P.",
  ],
  [
    "bike",
    "Honda",
    "CB350",
    "DLX Pro",
    2022,
    15800,
    "Petrol",
    "Manual",
    "1st",
    "Hyderabad",
    165000,
    "dealer",
    "Deccan Bikes",
  ],
  [
    "bike",
    "Ola",
    "S1 Pro",
    "Gen 1",
    2022,
    14000,
    "Electric",
    "Automatic",
    "1st",
    "Pune",
    68000,
    "owner",
    "Nikhil S.",
  ],
  [
    "car",
    "Maruti Suzuki",
    "Swift",
    "ZXi",
    2021,
    32000,
    "Petrol",
    "Manual",
    "1st",
    "Bengaluru",
    565000,
    "assured",
    "InstaCashMart Assured",
  ],
  [
    "car",
    "Hyundai",
    "Creta",
    "SX (O)",
    2022,
    28500,
    "Diesel",
    "Automatic",
    "1st",
    "Delhi NCR",
    1425000,
    "dealer",
    "Capital Car Bazaar",
  ],
  [
    "car",
    "Tata",
    "Nexon",
    "XZ+",
    2021,
    41000,
    "Petrol",
    "Manual",
    "1st",
    "Pune",
    785000,
    "owner",
    "Prasad J.",
  ],
  [
    "car",
    "Mahindra",
    "XUV700",
    "AX7",
    2023,
    18000,
    "Diesel",
    "Automatic",
    "1st",
    "Hyderabad",
    2050000,
    "assured",
    "InstaCashMart Assured",
  ],
  [
    "car",
    "Honda",
    "City",
    "VX",
    2020,
    52000,
    "Petrol",
    "Manual",
    "2nd",
    "Mumbai",
    815000,
    "dealer",
    "Western Wheels",
  ],
  [
    "car",
    "Kia",
    "Seltos",
    "HTX",
    2022,
    24000,
    "Petrol",
    "Manual",
    "1st",
    "Chennai",
    1295000,
    "owner",
    "Karthik V.",
  ],
  [
    "car",
    "Maruti Suzuki",
    "Baleno",
    "Alpha AGS",
    2022,
    21000,
    "Petrol",
    "Automatic",
    "1st",
    "Ahmedabad",
    735000,
    "assured",
    "InstaCashMart Assured",
  ],
  [
    "car",
    "Toyota",
    "Innova Crysta",
    "2.4 GX",
    2019,
    88000,
    "Diesel",
    "Manual",
    "1st",
    "Kolkata",
    1650000,
    "dealer",
    "Eastern Motors",
  ],
  [
    "car",
    "Tata",
    "Punch",
    "Accomplished",
    2023,
    12000,
    "CNG",
    "Manual",
    "1st",
    "Jaipur",
    625000,
    "owner",
    "Rohit S.",
  ],
  [
    "car",
    "Mahindra",
    "Thar",
    "LX 4WD",
    2021,
    36000,
    "Diesel",
    "Manual",
    "1st",
    "Bengaluru",
    1325000,
    "dealer",
    "Garden City Autos",
  ],
  [
    "car",
    "Hyundai",
    "i20",
    "Asta",
    2020,
    45000,
    "Petrol",
    "Manual",
    "2nd",
    "Delhi NCR",
    595000,
    "owner",
    "Neha G.",
  ],
  [
    "car",
    "Tata",
    "Nexon EV",
    "Empowered",
    2023,
    15000,
    "Electric",
    "Automatic",
    "1st",
    "Mumbai",
    1185000,
    "assured",
    "InstaCashMart Assured",
  ],
];

const seedVehicles = vehicleSeedRows.map((vehicleSeedRow, index) =>
  makeVehicle(`V${index + 1}`, ...vehicleSeedRow),
);

export const vehicleTitle = (t) =>
  [t.condition === "New" ? "New" : t.year, t.brand, t.model].filter(Boolean).join(" ");

const stripBrandPrefix = (t, e) =>
  t.toLowerCase().startsWith(`${e.toLowerCase()} `) ? t.slice(e.length + 1) : t;

const toVehicle = (t) => ({
  ...t,
  model: t.model || stripBrandPrefix(t.name, t.brand),
  variant: t.model ? t.name : "",
  year: Number(t.year) || 0,
  km: t.condition === "New" ? 0 : Number(t.km) || 0,
  price: Number(t.price),
  sellerType: "assured",
  sellerName: "InstaCashMart Assured",
});

export function useVehicles() {
  const vehicleProductsList = useStoreList("vehicleProducts");
  const vehiclesList = useStoreList("vehicles");
  return useMemo(
    () => [
      ...vehicleProductsList.filter((item) => !item.hidden).map(toVehicle),
      ...vehiclesList.filter((item) => item.status === "Live"),
      ...seedVehicles,
    ],
    [vehicleProductsList, vehiclesList],
  );
}

export function estimateResale({ type, brand, model, year, km, owners }) {
  const o = vehicleModels[type]?.[brand]?.[model];
  if (!o || !year) {
    return null;
  }
  const l = Math.max(0, new Date().getFullYear() - Number(year));
  const c = l === 0 ? 0.92 : (type === "car" ? 0.93 : 0.92) ** (l - 1) * 0.88;
  const u = type === "car" ? 12000 : 8000;
  const m = (Number(km) || 0) / u - Math.max(l, 1);
  const p = Math.min(1.05, Math.max(0.8, 1 - m * 0.04));
  const h =
    {
      "1st": 1,
      "2nd": 0.92,
      "3rd+": 0.85,
    }[owners] || 1;
  const _ = type === "car" ? 5000 : 1000;
  const f = o * c * p * h;
  const S = (B) => Math.round(B / _) * _;
  return {
    low: S(f * 0.93),
    high: S(f * 1.07),
    mid: S(f),
  };
}

export function vehicleMatches(t, e) {
  const s = e.toLowerCase().split(/\s+/).filter(Boolean);
  const n =
    `${t.year || ""} ${t.brand} ${t.model} ${t.variant || ""} ${t.fuel || ""} ${t.city || ""} ${getVehicleType(t.type).label}`.toLowerCase();
  return s.every((item) => n.includes(item));
}

export const isUsedVehicle = (t) => t.condition !== "New";

export const vehicleSpecs = (t) =>
  [
    isUsedVehicle(t) && t.km > 0 && [`${t.km.toLocaleString("en-IN")} km`, "fa-gauge-high"],
    t.fuel && [t.fuel, t.fuel === "Electric" ? "fa-bolt" : "fa-gas-pump"],
    t.type === "car" && t.transmission && [t.transmission, "fa-gears"],
    isUsedVehicle(t) && t.owners && [`${t.owners} owner`, "fa-user"],
  ].filter(Boolean);

export const sellVehiclePath = (t, e, s) =>
  `/bikes-cars/sell?${new URLSearchParams({
    type: t,
    ...(e && {
      brand: e,
    }),
    ...(s && {
      model: s,
    }),
  })}`;
