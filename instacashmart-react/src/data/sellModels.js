import { deviceCatalog } from "./sellCatalog";
import { categoryImages } from "./site";
import { store, useStoreList } from "../lib/store";
import applePhone from "../assets/models/apple-phone.webp";
import googlePhone from "../assets/models/google-phone.webp";
import huaweiPhone from "../assets/models/huawei-phone.webp";
import image1 from "../assets/images/image-1.svg";
import motorolaPhone from "../assets/models/motorola-phone.webp";
import oneplusPhone from "../assets/models/oneplus-phone.webp";
import oppoPhone from "../assets/models/oppo-phone.webp";
import realmePhone from "../assets/models/realme-phone.webp";
import redmiPhone from "../assets/models/redmi-phone.webp";
import samsungPhone from "../assets/models/samsung-phone.webp";
import vivoPhone from "../assets/models/vivo-phone.webp";
import xiaomiPhone from "../assets/models/xiaomi-phone.webp";

const baseModels = Object.fromEntries(
  Object.entries(deviceCatalog).map(([t, e]) => [
    t,
    Object.fromEntries(Object.entries(e.models).map(([s, n]) => [s, [...n]])),
  ]),
);

let adminModels = [];

function applyAdminModels(t) {
  if (t !== adminModels) {
    adminModels = t;
    for (const [e, s] of Object.entries(deviceCatalog)) {
      for (const n of Object.keys(s.models)) {
        s.models[n] = [...(baseModels[e][n] || [])];
      }
    }
    for (const e of t) {
      const s = deviceCatalog[e.category];
      if (!s || !e.name) {
        continue;
      }
      const n = (s.models[e.brand] ||= []);
      const a = {
        name: e.name,
        series: e.series || "",
        base: Number(e.base) || 0,
        adminId: e.id,
      };
      const r = n.findIndex((item) => item.name.toLowerCase() === e.name.toLowerCase());
      if (r >= 0) {
        n[r] = {
          ...n[r],
          ...a,
        };
      } else {
        n.unshift(a);
      }
    }
  }
}

applyAdminModels(store.list("sellModels"));

export function useSellModels() {
  const sellModelsList = useStoreList("sellModels");
  applyAdminModels(sellModelsList);
  return sellModelsList;
}

const adminModelImage = (t, e, s) => {
  var a;
  const n = String(e || "").toLowerCase();
  if (
    (a = adminModels.find(
      (adminModel) =>
        adminModel.category === t &&
        (!s || adminModel.brand === s) &&
        adminModel.image &&
        adminModel.name.toLowerCase() === n,
    )) == null
  ) {
    return undefined;
  } else {
    return a.image;
  }
};

export const baseModelsFor = (t, e) => {
  return baseModels[t]?.[e] || [];
};

const imageSlug = (t) =>
  String(t)
    .toLowerCase()
    .replace(/\+/g, " plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const modelImages = Object.fromEntries(
  Object.entries(
    import.meta.glob("../assets/models/*", {
      eager: true,
      import: "default",
    }),
  ).map(([t, e]) => [
    t
      .split("/")
      .pop()
      .replace(/\.[^.]+$/, "")
      .toLowerCase(),
    e,
  ]),
);

const modelImage = (t, e, s) => adminModelImage(t, e, s) || modelImages[imageSlug(e)];

const seriesOf = (t) => t.series || t.name.replace(/\s*\d.*$/, "");

function siblingModelImage(t, e, s, n) {
  for (const [r, o] of Object.entries(deviceCatalog[t]?.models || {})) {
    if (n && r !== n) {
      continue;
    }
    const l = o.find((item) => item.name === e);
    if (!l) {
      continue;
    }
    const u = (s ? o.filter((item) => seriesOf(item) === seriesOf(l)) : o).find(
      (item) => item !== l && modelImage(t, item.name, r),
    );
    return u && modelImage(t, u.name, r);
  }
  return null;
}

const fallbackDeviceImage = (t, e) =>
  t !== "phone"
    ? categoryImages[t]
    : siblingModelImage(t, e, false) || (/iphone/i.test(e) ? categoryImages[t] : image1);

const brandPhoneImages = {
  Realme: realmePhone,
  OnePlus: oneplusPhone,
  Vivo: vivoPhone,
  Motorola: motorolaPhone,
  Xiaomi: xiaomiPhone,
  Samsung: samsungPhone,
  Google: googlePhone,
  Oppo: oppoPhone,
  Redmi: redmiPhone,
  Huawei: huaweiPhone,
  Apple: applePhone,
};

const brandPhoneImage = (t, e) => {
  if (t !== "phone") {
    return null;
  }
  const s = String(e || "");
  for (const [a, r] of Object.entries(brandPhoneImages)) {
    if (
      (deviceCatalog.phone?.models[a] || []).some((item) => item.name === e) ||
      s.toLowerCase().startsWith(a.toLowerCase())
    ) {
      return r;
    }
  }
  return null;
};

export const deviceImage = (t, e, s) =>
  modelImage(t, e, s) ||
  (t === "phone" && siblingModelImage(t, e, true, s)) ||
  brandPhoneImage(t, e) ||
  fallbackDeviceImage(t, e);
