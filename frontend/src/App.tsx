import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./core/auth/AuthContext";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import PageSkeleton from "./components/PageSkeleton";
const LoginPage = lazy(() => import("./pages/LoginPage"));
import LandingPage from "./pages/LandingPage";
import { useAppBootstrap } from "./hooks/useAppBootstrap";
import {
  RedirectSiteEquipment,
  RedirectSitePlant,
  RedirectSiteToCompany,
  RedirectSitesToCompanies,
} from "./routes/legacyRedirects";

const CompaniesPage = lazy(() => import("./pages/CompaniesPage"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const PlantPage = lazy(() => import("./pages/PlantPage"));
const EquipmentPage = lazy(() => import("./pages/EquipmentPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const KnowledgePage = lazy(() => import("./pages/KnowledgePage"));
const AIPage = lazy(() => import("./pages/AIPage"));
const IntegrationsPage = lazy(() => import("./pages/IntegrationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

export default function App() {
  const ready = useAppBootstrap();

  return (
    <AuthProvider>
      {!ready && <SplashScreen />}
      <Routes>
        <Route path="/login" element={<Lazy><LoginPage /></Lazy>} />
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/companies" element={<Lazy><CompaniesPage /></Lazy>} />
          <Route path="/companies/:companyId/dashboard" element={<Lazy><DashboardPage /></Lazy>} />
          <Route path="/companies/:companyId" element={<Lazy><CompanyPage /></Lazy>} />
          <Route path="/companies/:companyId/plants/:plantId" element={<Lazy><PlantPage /></Lazy>} />
          <Route path="/companies/:companyId/plants/:plantId/equipment/:id" element={<Lazy><EquipmentPage /></Lazy>} />
          <Route path="/sites" element={<RedirectSitesToCompanies />} />
          <Route path="/sites/:siteId" element={<RedirectSiteToCompany />} />
          <Route path="/sites/:siteId/plants/:plantId" element={<RedirectSitePlant />} />
          <Route path="/sites/:siteId/plants/:plantId/equipment/:id" element={<RedirectSiteEquipment />} />
          <Route path="/equipment/:id" element={<Lazy><EquipmentPage /></Lazy>} />
          <Route path="/dashboard" element={<Lazy><DashboardPage /></Lazy>} />
          <Route path="/knowledge" element={<Lazy><KnowledgePage /></Lazy>} />
          <Route path="/ai" element={<Lazy><AIPage /></Lazy>} />
          <Route path="/integrations" element={<Lazy><IntegrationsPage /></Lazy>} />
          <Route path="/settings" element={<Lazy><SettingsPage /></Lazy>} />
          <Route path="/pellet" element={<Navigate to="/companies/gzmico/plants/pellet" replace />} />
          <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
