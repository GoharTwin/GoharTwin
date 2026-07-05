import { useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  { to: "/sites", key: "nav.sites" },
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/ai", key: "nav.ai" },
  { to: "/knowledge", key: "nav.knowledge" },
];

export default function Layout() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="watermark" aria-hidden="true">
        <img src={logo} alt="" />
      </div>

      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="GoharTwin logo" className="brand-logo" />
            <div className="brand-text">
              <h1>{t("common.appName")}</h1>
              <p>{t("common.tagline")}</p>
            </div>
          </Link>

          <nav className={`main-nav${menuOpen ? " open" : ""}`} key={location.pathname}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageSwitcher />
            <span className="version-badge">v0.2.0</span>
            <button
              className="menu-toggle"
              aria-label={t("nav.menu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="footer-bar">{t("common.footer")}</footer>
    </div>
  );
}
