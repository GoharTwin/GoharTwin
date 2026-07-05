import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEquipmentList } from "../api/client";
import type { EquipmentSummary } from "../types";

export default function KnowledgePage() {
  const [items, setItems] = useState<EquipmentSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEquipmentList()
      .then((res) => setItems(res.items))
      .catch(() => setError("Could not load knowledge base. Is the backend running?"));
  }, []);

  return (
    <>
      <Link to="/" className="back-link">
        ← Back to Platform
      </Link>

      <h2 className="page-title">Knowledge Center</h2>
      <p className="page-subtitle">
        Equipment passports and process knowledge base.
      </p>

      {error && <div className="empty-state">{error}</div>}

      {!error && (
        <section className="panel">
          <h3 className="panel-title">Registered Equipment ({items.length})</h3>
          {items.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No equipment registered yet.</p>
          ) : (
            <ul className="tag-list">
              {items.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.tag}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {item.name} — {item.area}
                    </div>
                  </div>
                  <Link to={`/equipment/${item.id}`} className="btn btn-ghost">
                    View Passport
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
