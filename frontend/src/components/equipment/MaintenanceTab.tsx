import { useTranslation } from "react-i18next";
import SpecRow from "../SpecRow";
import type { EquipmentPassport } from "../../types";

interface Props {
  equipment: EquipmentPassport;
}

export default function MaintenanceTab({ equipment }: Props) {
  const { t } = useTranslation();
  const maintenance = equipment.maintenance;

  if (!maintenance) {
    return (
      <section className="panel">
        <p style={{ color: "var(--text-muted)" }}>{t("equipment.noData")}</p>
      </section>
    );
  }

  return (
    <div className="grid-2">
      <section className="panel">
        <h3 className="panel-title">{t("equipment.intervalsTitle")}</h3>
        <SpecRow label={t("equipment.strategy")} value={maintenance.strategy} />
        {(maintenance.intervals ?? []).map((interval) => (
          <SpecRow key={interval.task} label={interval.task} value={interval.frequency} />
        ))}
      </section>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <section className="panel">
          <h3 className="panel-title">{t("equipment.spareParts")}</h3>
          <ul style={{ paddingInlineStart: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {(maintenance.spareParts ?? []).map((part) => (
              <li key={part} style={{ marginBottom: "0.4rem" }}>
                {part}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">{t("equipment.relatedEquipment")}</h3>
          <div className="unit-badges">
            {(equipment.relatedEquipment ?? []).map((tag) => (
              <span key={tag} className="unit-badge mono">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
