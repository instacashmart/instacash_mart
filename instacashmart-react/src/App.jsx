import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Intro } from "./components/layout/Intro";
import { Layout } from "./components/layout/Layout";
import { Toast } from "./components/layout/Toast";
import { AppProvider } from "./context/AppContext";
import { sellBrandCatalog } from "./data/sellBrands";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { AccessoriesPage } from "./pages/AccessoriesPage";
import { BrandPage } from "./pages/BrandPage";
import { BrandsPage } from "./pages/BrandsPage";
import { DevicesPage } from "./pages/DevicesPage";
import { FaqsPage } from "./pages/FaqsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { TrackPage } from "./pages/TrackPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { DeviceCheckPage } from "./pages/sell/DeviceCheckPage";
import { DeviceProblemsPage } from "./pages/sell/DeviceProblemsPage";
import { PickupPage } from "./pages/sell/PickupPage";
import { SellBrandPage } from "./pages/sell/SellBrandPage";
import { SellCategoryPage } from "./pages/sell/SellCategoryPage";
import { SellModelPage } from "./pages/sell/SellModelPage";
import { SellPage } from "./pages/sell/SellPage";
import { SellVehiclePage } from "./pages/vehicles/SellVehiclePage";
import { VehicleBrandPage } from "./pages/vehicles/VehicleBrandPage";
import { VehicleBrandsPage } from "./pages/vehicles/VehicleBrandsPage";
import { VehicleModelPage } from "./pages/vehicles/VehicleModelPage";
import { VehiclesPage } from "./pages/vehicles/VehiclesPage";

const pageTitles = {
  "/": "InstaCashMart | Sell Old Phones, Laptops & Gadgets Instantly for Cash",
  "/sell": "InstaCashMart | Sell Your Device – Instant Price Quote",
  "/pickup": "InstaCashMart | Confirm Pickup Address & Date",
  "/profile": "Your Profile | InstaCashMart",
  "/accessories": "Buy Accessories | InstaCashMart",
  "/how-it-works": "How It Works | InstaCashMart",
  "/faqs": "FAQs | InstaCashMart",
  "/feedback": "Feedback | InstaCashMart",
  "/reviews": "Customer Reviews | InstaCashMart",
  "/track": "Track Your Order | InstaCashMart",
  "/brands": "All Brands by Device | InstaCashMart",
  "/devices": "Choose a Device to Sell | InstaCashMart",
  "/bikes-cars": "Buy Used Bikes & Cars | InstaCashMart",
  "/bikes-cars/sell": "Sell Your Bike or Car – Free Listing | InstaCashMart",
  "/sell-phone": "Sell Old Phone – Choose Your Brand | InstaCashMart",
  "/sell-laptop": "Sell Old Laptop – Choose Your Brand | InstaCashMart",
  "/sell-tablet": "Sell Old Tablet – Choose Your Brand | InstaCashMart",
  "/sell-smartwatch": "Sell Old Smartwatch – Choose Your Brand | InstaCashMart",
  "/sell-earbuds": "Sell Old Earbuds & Headphones – Choose Your Brand | InstaCashMart",
  "/sell-console": "Sell Old Gaming Console – Choose Your Brand | InstaCashMart",
  "/sell-camera": "Sell Old Camera – Choose Your Brand | InstaCashMart",
};

function RouteEffects() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (pageTitles[pathname]) {
      document.title = pageTitles[pathname];
    }
  }, [pathname]);
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const n = requestAnimationFrame(() => {
      var a;
      if ((a = document.getElementById(hash.slice(1))) == null) {
        return undefined;
      } else {
        return a.scrollIntoView();
      }
    });
    return () => cancelAnimationFrame(n);
  }, [pathname, search, hash]);
  return null;
}

export function App() {
  useScrollReveal();
  return (
    <AppProvider>
      <RouteEffects />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="accessories" element={<AccessoriesPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="faqs" element={<FaqsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="track" element={<TrackPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="brand/:brand" element={<BrandPage />} />
          <Route path="bikes-cars" element={<VehiclesPage />} />
          <Route path="bikes-cars/sell" element={<SellVehiclePage />} />
          <Route path="bikes" element={<VehicleBrandsPage key={"bike"} type="bike" />} />
          <Route path="bikes/:brand" element={<VehicleBrandPage key={"bike"} type="bike" />} />
          <Route
            path="bikes/:brand/:model"
            element={<VehicleModelPage key={"bike"} type="bike" />}
          />
          <Route path="cars" element={<VehicleBrandsPage key={"car"} type="car" />} />
          <Route path="cars/:brand" element={<VehicleBrandPage key={"car"} type="car" />} />
          <Route path="cars/:brand/:model" element={<VehicleModelPage key={"car"} type="car" />} />
          {Object.entries(sellBrandCatalog).flatMap(([t, e]) => [
            <Route
              key={t}
              path={e.path.slice(1)}
              element={<SellCategoryPage key={t} category={t} />}
            />,
            <Route
              key={`${t}-brand`}
              path={`${e.path.slice(1)}/:brand`}
              element={<SellBrandPage key={t} category={t} />}
            />,
            <Route
              key={`${t}-model`}
              path={`${e.path.slice(1)}/:brand/:model`}
              element={<SellModelPage key={t} category={t} />}
            />,
          ])}
        </Route>
        <Route path="sell" element={<SellPage />} />
        <Route path="device-check" element={<DeviceCheckPage />} />
        <Route path="device-problems" element={<DeviceProblemsPage />} />
        <Route path="pickup" element={<PickupPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
      <Intro />
    </AppProvider>
  );
}
