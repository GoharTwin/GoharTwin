import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./pages/LandingPage";
import SitesPage from "./pages/SitesPage";
import SitePage from "./pages/SitePage";
import PlantPage from "./pages/PlantPage";
import EquipmentPage from "./pages/EquipmentPage";
import DashboardPage from "./pages/DashboardPage";
import KnowledgePage from "./pages/KnowledgePage";
import AIPage from "./pages/AIPage";
import NotFoundPage from "./pages/NotFoundPage";

const SPLASH_DURATION_MS = 2300;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/sites/:siteId" element={<SitePage />} />
          <Route path="/sites/:siteId/plants/:plantId" element={<PlantPage />} />
          <Route
            path="/sites/:siteId/plants/:plantId/equipment/:id"
            element={<EquipmentPage />}
          />
          <Route path="/equipment/:id" element={<EquipmentPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/ai" element={<AIPage />} />
          {/* Legacy v0.1 route */}
          <Route path="/pellet" element={<Navigate to="/sites/gzmico/plants/pellet" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
