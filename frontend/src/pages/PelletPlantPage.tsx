import { Link } from "react-router-dom";

const ZONES = [
  { id: "WB-07", label: "WB 07" },
  { id: "WB-08", label: "WB 08" },
  { id: "WB-09", label: "WB 09" },
  { id: "WB-10", label: "WB 10" },
  { id: "WB-11", label: "WB 11", highlight: true, fan: "FAN-11" },
];

export default function PelletPlantPage() {
  return (
    <>
      <Link to="/" className="back-link">
        ← Back to Platform
      </Link>

      <h2 className="page-title">Pellet Plant — Grate-Kiln Furnace</h2>
      <p className="page-subtitle">
        Interactive furnace overview. Click equipment nodes to open passports.
      </p>

      <div className="furnace-layout">
        <section className="panel">
          <h3 className="panel-title">Furnace Windbox Zone Map (v0.1)</h3>
          <div className="furnace-diagram">
            <div className="furnace-zones">
              {ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className={`zone-block${zone.highlight ? " highlight" : ""}`}
                >
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {zone.label}
                  </span>
                  {zone.fan && (
                    <Link
                      to="/equipment/fan-11"
                      className="equipment-node active"
                    >
                      {zone.fan}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel">
          <h3 className="panel-title">Active Equipment</h3>
          <ul className="tag-list">
            <li>
              <div>
                <strong>FAN-11</strong>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Windbox Cooling Fan 11
                </div>
              </div>
              <Link to="/equipment/fan-11" className="btn btn-primary">
                Open
              </Link>
            </li>
          </ul>

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            3D furnace model and full tag list will be added in v1.0 using plant
            P&ID and layout data.
          </p>
        </aside>
      </div>
    </>
  );
}
