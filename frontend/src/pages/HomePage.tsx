import { useEffect, useState } from "react";
import { getHealth, getModules } from "../api/client";
import ModuleCard from "../components/ModuleCard";
import type { PlatformModule } from "../types";

export default function HomePage() {
  const [modules, setModules] = useState<PlatformModule[]>([]);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getModules(), getHealth()])
      .then(([modulesRes]) => {
        setModules(modulesRes.modules);
        setApiOnline(true);
      })
      .catch(() => {
        setApiOnline(false);
        setError("Backend API is offline. Start backend on port 8000.");
        setModules([
          {
            id: "pellet",
            name: "Pellet Plant",
            nameFa: "کارخانه گندله",
            icon: "factory",
            status: "active",
            route: "/pellet",
          },
          {
            id: "concentrate",
            name: "Concentrate Plant",
            nameFa: "کارخانه کنسانتره",
            icon: "factory",
            status: "planned",
            route: "/concentrate",
          },
          {
            id: "steel",
            name: "Steel Plant",
            nameFa: "فولادسازی",
            icon: "factory",
            status: "planned",
            route: "/steel",
          },
          {
            id: "utilities",
            name: "Utilities",
            nameFa: "تاسیسات",
            icon: "settings",
            status: "planned",
            route: "/utilities",
          },
          {
            id: "ai-engineer",
            name: "AI Engineer",
            nameFa: "مهندس هوش مصنوعی",
            icon: "bot",
            status: "planned",
            route: "/ai",
          },
          {
            id: "knowledge",
            name: "Knowledge Center",
            nameFa: "مرکز دانش",
            icon: "book",
            status: "active",
            route: "/knowledge",
          },
          {
            id: "settings",
            name: "Settings",
            nameFa: "تنظیمات",
            icon: "gear",
            status: "planned",
            route: "/settings",
          },
        ]);
      });
  }, []);

  return (
    <>
      <h2 className="page-title">Platform Overview</h2>
      <p className="page-subtitle">
        Select a module to enter the digital twin environment.
        {apiOnline === false && (
          <span style={{ display: "block", color: "var(--warning)", marginTop: "0.5rem" }}>
            {error}
          </span>
        )}
      </p>

      <div className="module-grid">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </>
  );
}
