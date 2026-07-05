import { useTranslation } from "react-i18next";
import SpecRow from "../SpecRow";
import type { EquipmentPassport } from "../../types";

interface Props {
  equipment: EquipmentPassport;
}

export default function OverviewTab({ equipment }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid-2">
      <section className="panel">
        <h3 className="panel-title">{t("equipment.general")}</h3>
        <SpecRow label={t("equipment.tag")} value={equipment.tag} />
        <SpecRow label={t("equipment.type")} value={equipment.type} />
        <SpecRow label={t("equipment.plant")} value={equipment.plant} />
        <SpecRow label={t("equipment.area")} value={equipment.area} />
        <SpecRow label={t("equipment.manufacturer")} value={equipment.manufacturer} />
        <SpecRow label={t("equipment.model")} value={equipment.model} />
        <SpecRow label={t("equipment.serialNumber")} value={equipment.serialNumber} />
        <SpecRow label={t("equipment.installDate")} value={equipment.installDate} />
        <SpecRow label={t("equipment.lastUpdated")} value={equipment.lastUpdated} />
      </section>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <section className="panel">
          <h3 className="panel-title">{t("equipment.interlocks")}</h3>
          <ul style={{ paddingInlineStart: "1.2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {(equipment.interlocks ?? []).map((interlock) => (
              <li key={interlock} style={{ marginBottom: "0.4rem" }}>
                {interlock}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">{t("equipment.aiContext")}</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            {equipment.aiContext ?? t("equipment.noData")}
          </p>
        </section>
      </div>
    </div>
  );
}
