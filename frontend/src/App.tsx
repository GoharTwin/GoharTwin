import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./core/auth/AuthContext";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import LandingPage from "./pages/LandingPage";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyPage from "./pages/CompanyPage";
import PlantPage from "./pages/PlantPage";
import EquipmentPage from "./pages/EquipmentPage";
import DashboardPage from "./pages/DashboardPage";
import KnowledgePage from "./pages/KnowledgePage";
import AIPage from "./pages/AIPage";
import LoginPage from "./pages/LoginPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  RedirectSiteEquipment,
  RedirectSitePlant,
  RedirectSiteToCompany,
  RedirectSitesToCompanies,
} from "./routes/legacyRedirects";

const SPLASH_MS = 2000;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AuthProvider>
      {showSplash && <SplashScreen />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:companyId/dashboard" element={<DashboardPage />} />
          <Route path="/companies/:companyId" element={<CompanyPage />} />
          <Route path="/companies/:companyId/plants/:plantId" element={<PlantPage />} />
          <Route path="/companies/:companyId/plants/:plantId/equipment/:id" element={<EquipmentPage />} />
          <Route path="/sites" element={<RedirectSitesToCompanies />} />
          <Route path="/sites/:siteId" element={<RedirectSiteToCompany />} />
          <Route path="/sites/:siteId/plants/:plantId" element={<RedirectSitePlant />} />
          <Route path="/sites/:siteId/plants/:plantId/equipment/:id" element={<RedirectSiteEquipment />} />
          <Route path="/equipment/:id" element={<EquipmentPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pellet" element={<Navigate to="/companies/gmico/plants/pellet" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
