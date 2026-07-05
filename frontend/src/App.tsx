import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PelletPlantPage from "./pages/PelletPlantPage";
import EquipmentPage from "./pages/EquipmentPage";
import KnowledgePage from "./pages/KnowledgePage";
import ComingSoonPage from "./pages/ComingSoonPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/pellet" element={<PelletPlantPage />} />
        <Route path="/equipment/:id" element={<EquipmentPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/:moduleId" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  );
}
