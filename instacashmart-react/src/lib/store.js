import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, adminUid, db } from "./firebase";
import { defaultTrendingDevices } from "../data/site";

const storageKeys = {
  sell: "cashnova.sellOrders",
  buy: "cashnova.buyOrders",
  products: "cashnova.products",
  trending: "cashnova.trendingDevices",
  popular: "cashnova.popularAccessories",
  feedback: "cashnova.feedback",
  reviews: "cashnova.reviews",
  sellModels: "cashnova.sellModels",
  vehicles: "cashnova.vehicles",
  vehicleLeads: "cashnova.vehicleLeads",
  vehicleProducts: "cashnova.vehicleProducts",
};

const storeDefaults = {
  trending: defaultTrendingDevices,
  popular: [],
};

const STORE_CHANGE_EVENT = "cashnova:change";
export const STORE_ERROR_EVENT = "cashnova:store-error";

export const orderStages = {
  sell: [
    { status: "New", label: "Pickup Requested", icon: "fa-clipboard-check" },
    { status: "Scheduled", label: "Technician Assigned", icon: "fa-motorcycle" },
    { status: "Picked up", label: "Picked Up & Checked", icon: "fa-magnifying-glass" },
    { status: "Paid", label: "Payment Sent", icon: "fa-indian-rupee-sign" },
  ],
  buy: [
    { status: "New", label: "Order Placed", icon: "fa-receipt" },
    { status: "Packed", label: "Packed", icon: "fa-box" },
    { status: "Shipped", label: "Shipped", icon: "fa-truck-fast" },
    { status: "Delivered", label: "Delivered", icon: "fa-house-circle-check" },
  ],
};

const publicCollections = new Set([
  "sell",
  "products",
  "trending",
  "popular",
  "sellModels",
  "vehicleProducts",
  "feedback",
  "reviews",
  "vehicles",
]);

const protectedCollections = new Set(["buy", "vehicleLeads"]);

function readList(type) {
  try {
    const stored = localStorage.getItem(storageKeys[type]);
    if (stored === null && type === "trending") {
      localStorage.setItem(storageKeys[type], JSON.stringify(defaultTrendingDevices));
      return defaultTrendingDevices;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : storeDefaults[type] || [];
  } catch {
    return storeDefaults[type] || [];
  }
}

function notifyChange() {
  window.dispatchEvent(new Event(STORE_CHANGE_EVENT));
}

function notifyError(error) {
  const message = error?.message || "Unable to save data to Firestore.";
  window.dispatchEvent(new CustomEvent(STORE_ERROR_EVENT, { detail: { message } }));
}

function replaceCache(type, items) {
  try {
    localStorage.setItem(storageKeys[type], JSON.stringify(items));
  } catch (error) {
    notifyError(error);
  }
  notifyChange();
}

function docData(item, position) {
  return Object.fromEntries(
    Object.entries({ ...item, position }).filter(([, value]) => value !== undefined),
  );
}

function publicTrackingData(type, item) {
  const tracking = {
    id: item.id,
    type,
    createdAt: item.createdAt,
    status: item.status,
    history: item.history || {},
    note: item.note || "",
  };
  if (type === "sell") {
    tracking.model = item.model || "";
    tracking.storage = item.storage || "";
    tracking.date = item.date || "";
  } else {
    tracking.product = item.product || "";
    tracking.price = item.price || 0;
  }
  return tracking;
}

function isOrderCollection(type) {
  return type === "sell" || type === "buy";
}

function hasSecureTrackingId(id) {
  return typeof id === "string" && /^[A-Z]+-[A-F0-9]{32}$/.test(id);
}

async function commitList(type, before, after) {
  const oldItems = new Map(before.map((item) => [item.id, item]));
  const newItems = new Map(after.map((item) => [item.id, item]));

  for (let offset = 0; offset < Math.max(before.length, after.length); offset += 200) {
    const batch = writeBatch(db);
    let hasWrites = false;
    const rangeEnd = offset + 200;

    for (let index = offset; index < Math.min(after.length, rangeEnd); index += 1) {
      const item = after[index];
      const previous = oldItems.get(item.id);
      if (previous && JSON.stringify(previous) === JSON.stringify(item) && previous.position === index) {
        continue;
      }
      batch.set(doc(db, type, String(item.id)), docData(item, index));
      if (isOrderCollection(type) && hasSecureTrackingId(item.id)) {
        batch.set(doc(db, "publicTracking", String(item.id)), publicTrackingData(type, item));
      }
      hasWrites = true;
    }

    for (let index = offset; index < Math.min(before.length, rangeEnd); index += 1) {
      const item = before[index];
      if (newItems.has(item.id)) {
        continue;
      }
      batch.delete(doc(db, type, String(item.id)));
      if (isOrderCollection(type) && hasSecureTrackingId(item.id)) {
        batch.delete(doc(db, "publicTracking", String(item.id)));
      }
      hasWrites = true;
    }

    if (hasWrites) {
      await batch.commit();
    }
  }
}

function writeList(type, items) {
  const before = readList(type);
  try {
    localStorage.setItem(storageKeys[type], JSON.stringify(items));
  } catch {
    return false;
  }
  notifyChange();
  commitList(type, before, items).catch((error) => {
    replaceCache(type, before);
    notifyError(error);
  });
  return true;
}

async function addAndWait(type, item) {
  const batch = writeBatch(db);
  batch.set(doc(db, type, String(item.id)), docData(item, 0));
  if (isOrderCollection(type)) {
    batch.set(
      doc(db, "publicTracking", String(item.id)),
      publicTrackingData(type, item),
    );
  }
  await batch.commit();
  const next = [
    item,
    ...readList(type).filter(
      (entry) => entry.id !== item.id && (!item.userId || entry.userId === item.userId),
    ),
  ];
  replaceCache(type, next);
  return true;
}

async function updateAndWait(type, id, updates) {
  const next = readList(type).map((item) =>
    item.id === id ? { ...item, ...updates } : item,
  );
  await commitList(type, readList(type), next);
  replaceCache(type, next);
  return true;
}

function collectionQuery(type, isAdmin) {
  const base = collection(db, type);
  if (isAdmin) {
    return base;
  }
  if (type === "sell" && auth.currentUser) {
    return query(base, where("userId", "==", auth.currentUser.uid));
  }
  if (type === "feedback") {
    return query(
      base,
      where("public", "==", true),
      where("hidden", "==", false),
      where("status", "==", "approved"),
    );
  }
  if (type === "reviews") {
    return query(base, where("status", "==", "approved"));
  }
  if (type === "vehicles") {
    return query(base, where("status", "==", "Live"));
  }
  return base;
}

function sortedSnapshot(snapshot) {
  const items = snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }));
  return items.sort((left, right) => {
    if (
      Number.isFinite(left.position)
      && Number.isFinite(right.position)
      && left.position !== right.position
    ) {
      return left.position - right.position;
    }
    return String(right.createdAt || "").localeCompare(String(left.createdAt || ""));
  });
}

function mergeLocalPending(type, remoteItems) {
  if (type !== "feedback" && type !== "reviews") {
    return remoteItems;
  }
  const items = new Map(
    readList(type)
      .filter((item) => item.status === "pending")
      .map((item) => [item.id, item]),
  );
  for (const item of remoteItems) {
    items.set(item.id, item);
  }
  return [...items.values()].sort((left, right) =>
    String(right.createdAt || "").localeCompare(String(left.createdAt || "")),
  );
}

async function migrateLocalData(type) {
  const marker = `cashnova.firestoreMigration.v1.${type}`;
  if (localStorage.getItem(marker)) {
    return false;
  }
  const items = readList(type);
  if (!items.length) {
    localStorage.setItem(marker, "done");
    return false;
  }
  await commitList(type, [], items);
  localStorage.setItem(marker, "done");
  return true;
}

async function findOrder(reference) {
  const id = String(reference || "").trim().toUpperCase();
  if (!id) {
    return null;
  }
  const result = await getDoc(doc(db, "publicTracking", id));
  if (!result.exists()) {
    return null;
  }
  const item = result.data();
  return item.type === "sell" || item.type === "buy"
    ? { type: item.type, item }
    : null;
}

export const store = {
  list: readList,
  addAndWait,
  updateAndWait,
  add(type, item) {
    return writeList(type, [item, ...readList(type)]);
  },
  update(type, id, updates) {
    return writeList(
      type,
      readList(type).map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  },
  remove(type, id) {
    return writeList(
      type,
      readList(type).filter((item) => item.id !== id),
    );
  },
  resetTrending() {
    writeList("trending", defaultTrendingDevices);
    return defaultTrendingDevices;
  },
  resetPopular() {
    writeList("popular", []);
  },
  move(type, id, offset) {
    const items = [...readList(type)];
    const from = items.findIndex((item) => item.id === id);
    const to = from + offset;
    if (from < 0 || to < 0 || to >= items.length) {
      return false;
    }
    [items[from], items[to]] = [items[to], items[from]];
    return writeList(type, items);
  },
  setStatus(type, id, status) {
    const item = readList(type).find((entry) => entry.id === id);
    if (!item) {
      return false;
    }
    const history = {
      New: item.createdAt,
      ...(item.history || {}),
      [status]: new Date().toISOString(),
    };
    return this.update(type, id, { status, history });
  },
  findOrder,
  newId(prefix) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    return `${prefix}-${token}`;
  },
};

export function useStoreVersion() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount((value) => value + 1);
    const onVisible = () => {
      if (!document.hidden) {
        update();
      }
    };
    window.addEventListener(STORE_CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(STORE_CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return count;
}

export function useStoreList(type) {
  const [state, setState] = useState(() => {
    if (type === "sell") {
      const currentUserId = auth.currentUser?.uid;
      return currentUserId
        ? readList(type).filter((item) => item.userId === currentUserId)
        : [];
    }
    return protectedCollections.has(type) ? [] : readList(type);
  });
  useEffect(() => {
    setState(
      type === "sell" && auth.currentUser
        ? readList(type).filter((item) => item.userId === auth.currentUser.uid)
        : protectedCollections.has(type) || type === "sell"
          ? []
          : readList(type),
    );
    let unsubscribeSnapshot = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeSnapshot?.();
      unsubscribeSnapshot = null;
      const isAdmin = !!user && user.uid === adminUid;
      if (type === "sell") {
        setState(
          isAdmin
            ? readList(type)
            : user
              ? readList(type).filter((item) => item.userId === user.uid)
              : [],
        );
        if (!user && !isAdmin) {
          return;
        }
      }
      if (protectedCollections.has(type) && !isAdmin) {
        setState([]);
        return;
      }
      if (!isAdmin && !publicCollections.has(type)) {
        return;
      }
      unsubscribeSnapshot = onSnapshot(
        collectionQuery(type, isAdmin),
        async (snapshot) => {
          if (isAdmin && snapshot.empty) {
            try {
              if (await migrateLocalData(type)) {
                return;
              }
            } catch (error) {
              notifyError(error);
            }
          }
          let items = sortedSnapshot(snapshot);
          if (!isAdmin && type !== "sell" && snapshot.empty) {
            const marker = `cashnova.firestoreMigration.v1.${type}`;
            if (!localStorage.getItem(marker) && readList(type).length > 0) {
              setState(readList(type));
              return;
            }
          }
          if (!isAdmin) {
            items = mergeLocalPending(type, items);
          }
          if (type === "trending" && items.length === 0) {
            items = defaultTrendingDevices;
          }
          replaceCache(type, items);
          setState(items);
        },
        notifyError,
      );
    });
    return () => {
      unsubscribeSnapshot?.();
      unsubscribeAuth();
    };
  }, [type]);
  return state;
}
