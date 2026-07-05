import { useTranslation } from "react-i18next";
import type { EquipmentPassport } from "../../types";

interface Props {
  equipment: EquipmentPassport;
}

export default function SensorsTab({ equipment }: Props) {
  const { t } = useTranslation();
  const sensors = equipment.sensors ?? [];

  return (
    <section className="panel">
      <h3 className="panel-title">{t("equipment.tabs.sensors")}</h3>
      {sensors.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>{t("equipment.noData")}</p>
      ) : (
        <ul className="tag-list">
          {sensors.map((sensor) => (
            <li key={sensor.tag}>
              <div>
                <strong className="mono">{sensor.tag}</strong>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {sensor.name} — {sensor.type}
                </div>
              </div>
              <span className="file-type-badge">
                {sensor.unit} · {sensor.range}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
