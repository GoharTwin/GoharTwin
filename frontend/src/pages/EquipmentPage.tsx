import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEquipment } from "../api/client";
import SpecRow from "../components/SpecRow";
import type { EquipmentPassport } from "../types";

export default function EquipmentPage() {
  const { id } = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<EquipmentPassport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getEquipment(id)
      .then(setEquipment)
      .catch(() => setError("Equipment not found or API offline."));
  }, [id]);

  if (error) {
    return (
      <div className="empty-state">
        <p>{error}</p>
        <Link to="/pellet" className="btn btn-ghost" style={{ marginTop: "1rem" }}>
          Back to Pellet Plant
        </Link>
      </div>
    );
  }

  if (!equipment) {
    return <div className="empty-state">Loading equipment passport...</div>;
  }

  return (
    <>
      <Link to="/pellet" className="back-link">
        ← Back to Pellet Plant
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h2 className="page-title">{equipment.tag}</h2>
          <p className="page-subtitle">
            {equipment.name}
            {equipment.nameFa && ` — ${equipment.nameFa}`}
          </p>
        </div>
        <span className="status-pill active">{equipment.status}</span>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <section className="panel">
          <h3 className="panel-title">General</h3>
          <SpecRow label="Tag" value={equipment.tag} />
          <SpecRow label="Type" value={equipment.type} />
          <SpecRow label="Plant" value={equipment.plant} />
          <SpecRow label="Area" value={equipment.area} />
          <SpecRow label="Manufacturer" value={equipment.manufacturer} />
          <SpecRow label="Model" value={equipment.model} />
          <SpecRow label="Last Updated" value={equipment.lastUpdated} />
        </section>

        <section className="panel">
          <h3 className="panel-title">Motor</h3>
          {equipment.motor ? (
            Object.entries(equipment.motor).map(([key, value]) => (
              <SpecRow
                key={key}
                label={key.replace(/_/g, " ")}
                value={value as string}
              />
            ))
          ) : (
            <p style={{ color: "var(--text-muted)" }}>No motor data</p>
          )}
        </section>
      </div>

      <div className="grid-2" style={{ marginBottom: "1rem" }}>
        <section className="panel">
          <h3 className="panel-title">Specifications</h3>
          {equipment.specifications ? (
            Object.entries(equipment.specifications).map(([key, value]) => (
              <SpecRow
                key={key}
                label={key.replace(/_/g, " ")}
                value={value as string}
              />
            ))
          ) : (
            <p style={{ color: "var(--text-muted)" }}>No specifications</p>
          )}
        </section>

        <section className="panel">
          <h3 className="panel-title">Sensors</h3>
          {equipment.sensors?.length ? (
            <ul className="tag-list">
              {equipment.sensors.map((sensor) => (
                <li key={sensor.tag}>
                  <div>
                    <strong>{sensor.tag}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {sensor.name} — {sensor.unit}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>No sensors listed</p>
          )}
        </section>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h3 className="panel-title">Interlocks</h3>
          <ul style={{ paddingLeft: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {equipment.interlocks?.map((item) => (
              <li key={item} style={{ marginBottom: "0.4rem" }}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">AI Context</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            {equipment.aiContext}
          </p>
        </section>
      </div>
    </>
  );
}
