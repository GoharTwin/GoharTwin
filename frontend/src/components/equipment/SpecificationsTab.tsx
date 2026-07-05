import { useTranslation } from "react-i18next";
import SpecRow from "../SpecRow";
import type { EquipmentPassport } from "../../types";

interface Props {
  equipment: EquipmentPassport;
}

export default function SpecificationsTab({ equipment }: Props) {
  const { t } = useTranslation();

  return (
    <div className="grid-2">
      <section className="panel">
        <h3 className="panel-title">{t("equipment.tabs.specifications")}</h3>
        {equipment.specifications ? (
          Object.entries(equipment.specifications).map(([key, value]) => (
            <SpecRow key={key} label={key.replace(/_/g, " ")} value={value} />
          ))
        ) : (
          <p style={{ color: "var(--text-muted)" }}>{t("equipment.noData")}</p>
        )}
      </section>

      <section className="panel">
        <h3 className="panel-title">{t("equipment.motor")}</h3>
        {equipment.motor ? (
          Object.entries(equipment.motor).map(([key, value]) => (
            <SpecRow key={key} label={key.replace(/_/g, " ")} value={value} />
          ))
        ) : (
          <p style={{ color: "var(--text-muted)" }}>{t("equipment.noData")}</p>
        )}
      </section>
    </div>
  );
}
