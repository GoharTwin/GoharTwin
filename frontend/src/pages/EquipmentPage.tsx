import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEquipment } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import EquipmentTabs from "../components/equipment/EquipmentTabs";
import type { EquipmentPassport } from "../types";

export default function EquipmentPage() {
  const { id, siteId, companyId, plantId } = useParams<{
    id: string;
    siteId?: string;
    companyId?: string;
    plantId?: string;
  }>();
  const cid = companyId || siteId;
  const { t } = useTranslation();
  const localized = useLocalized();
  const [equipment, setEquipment] = useState<EquipmentPassport | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEquipment(id)
      .then(setEquipment)
      .catch(() => setError(true));
  }, [id]);

  if (error) return <div className="empty-state">{t("equipment.notFound")}</div>;
  if (!equipment) return <div className="empty-state">{t("common.loading")}</div>;

  const crumbs =
    cid && plantId
      ? [
          { label: t("breadcrumb.companies"), to: "/companies" },
          { label: cid.toUpperCase(), to: `/companies/${cid}` },
          { label: plantId, to: `/companies/${cid}/plants/${plantId}` },
          { label: equipment.tag },
        ]
      : [{ label: equipment.tag }];

  return (
    <>
      <Breadcrumbs items={crumbs} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 className="page-title mono">{equipment.tag}</h2>
          <p className="page-subtitle">{localized(equipment.name, equipment.nameFa)}</p>
        </div>
        <span className={`status-pill ${equipment.status}`}>
          {t(`common.${equipment.status}`, equipment.status)}
        </span>
      </div>

      <EquipmentTabs equipment={equipment} equipmentId={id!} />
    </>
  );
}
