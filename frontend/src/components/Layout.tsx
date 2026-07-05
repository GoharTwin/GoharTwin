import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <div className="brand-mark">GT</div>
            <div className="brand-text">
              <h1>GOHARTWIN</h1>
              <p>Digital Twin Platform</p>
            </div>
          </Link>
          <span className="version-badge">v0.1.0</span>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="footer-bar">
        GoharTwin © 2026 — Gohar Zamin Industrial Complex
      </footer>
    </div>
  );
}
