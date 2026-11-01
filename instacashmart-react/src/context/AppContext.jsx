import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accessoryCategories, makeProduct } from "../data/accessories";
import { STORE_ERROR_EVENT, useStoreList } from "../lib/store";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    message: "",
    visible: false,
  });
  const ref = useRef(null);
  const showToast = useCallback((te) => {
    clearTimeout(ref.current);
    setToast({
      message: te,
      visible: true,
    });
    ref.current = setTimeout(
      () =>
        setToast((De) => ({
          ...De,
          visible: false,
        })),
      3500,
    );
  }, []);
  useEffect(() => {
    const onStoreError = (event) => {
      showToast(`Firestore error: ${event.detail?.message || "Unable to save data."}`);
    };
    window.addEventListener(STORE_ERROR_EVENT, onStoreError);
    return () => window.removeEventListener(STORE_ERROR_EVENT, onStoreError);
  }, [showToast]);
  const [city, setCity] = useState("Bengaluru");
  const [modal, setModal] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [buyProduct, setBuyProduct] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);
  const setCity2 = useCallback(
    (te) => {
      setCity(te);
      setModal(null);
      showToast(`Pickup location set to ${te}`);
    },
    [showToast],
  );
  const openBuy = useCallback((te) => {
    setBuyProduct(te);
    setModal("buy");
  }, []);
  const openTrack = useCallback((te = "") => {
    setTrackId(te);
    setModal("track");
  }, []);
  const productsList = useStoreList("products");
  const catalog = useMemo(
    () => [
      ...productsList
        .filter((item) =>
          accessoryCategories.some((accessoryCategory) => accessoryCategory.key === item.category),
        )
        .map((item) =>
          makeProduct(
            item.id,
            item.category,
            item.name,
            item.brand,
            item.specs,
            4.5,
            Number(item.price),
            Number(item.mrp) || Number(item.price),
            "nova",
            item.image || undefined,
          ),
        ),
    ],
    [productsList],
  );
  const [market, setMarket] = useState({
    category: "all",
    query: "",
  });
  const setMarketCategory = useCallback(
    (te) =>
      setMarket((De) => ({
        ...De,
        category: te,
      })),
    [],
  );
  const setMarketQuery = useCallback(
    (te) =>
      setMarket((De) => ({
        ...De,
        query: te || "",
      })),
    [],
  );
  const goToStore = useCallback(
    (te = {}) => {
      const De = {
        ...market,
        ...te,
      };
      setMarket(De);
      const Ke = new URLSearchParams();
      if (De.category !== "all") {
        Ke.set("cat", De.category);
      }
      if (De.query.trim()) {
        Ke.set("q", De.query.trim());
      }
      const ya = Ke.toString();
      navigate(`/accessories${ya ? `?${ya}` : ""}#trending-devices`);
    },
    [market, navigate],
  );
  const P = {
    toast,
    showToast,
    city,
    setCity: setCity2,
    modal,
    setModal,
    closeModal,
    trackId,
    openTrack,
    buyProduct,
    openBuy,
    catalog,
    market,
    setMarket,
    setMarketCategory,
    setMarketQuery,
    goToStore,
  };
  return <AppContext.Provider value={P}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
