import { useState } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { useAuth } from "../core/auth/AuthContext";
import { search as apiSearch } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import type { SearchResult } from "../types";

const NAV = [
  { to: "/companies", key: "nav.companies" },
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/ai", key: "nav.ai" },
  { to: "/knowledge", key: "nav.knowledge" },
  { to: "/integrations", key: "nav.integrations" },
  { to: "/settings", key: "nav.settings" },
];

export default function Layout() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const location = useLocation();

  const onSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) { setResults([]); return; }
    try {
      const res = await apiSearch(value);
      setResults(res.results);
    } catch { setResults([]); }
  };

  return (
    <div className="app-shell">
      <div className="watermark" aria-hidden="true"><Logo /></div>
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <Logo className="brand-logo" alt="GoharTwin" />
          </Link>
          <div className="header-search">
            <input
              type="search"
              placeholder={t("common.search")}
              value={query}
              onChange={(e) => onSearch(e.target.value)}
            />
            {results.length > 0 && (
              <div className="search-dropdown">
                {results.map((r) => (
                  <button key={`${r.type}-${r.id}`} type="button" onClick={() => { if (r.route) navigate(r.route); setResults([]); }}>
                    <span className="mono">{r.type}</span> {localized(r.title, r.titleFa)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className={`main-nav${menuOpen ? " open" : ""}`}>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={() => setMenuOpen(false)}>
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            {user ? (
              <button type="button" className="btn btn-ghost" onClick={logout}>{user.displayNameFa || user.username}</button>
            ) : null}
            <span className="version-badge">v0.3.0</span>
            <button className="menu-toggle" aria-label={t("nav.menu")} onClick={() => setMenuOpen((o) => !o)}>☰</button>
          </div>
        </div>
      </header>
      <main className="app-main"><Outlet key={location.pathname} /></main>
      <footer className="footer-bar">{t("common.footer")}</footer>
    </div>
  );
}
