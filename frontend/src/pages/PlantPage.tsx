import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSiteDetail } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import type { HierarchyNode, SiteDetail } from "../types";

export default function PlantPage() {
  const { siteId, plantId } = useParams<{ siteId: string; plantId: string }>();
  const { t } = useTranslation();
  const localized = useLocalized();
  const [detail, setDetail] = useState<SiteDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!siteId) return;
    getSiteDetail(siteId)
      .then(setDetail)
      .catch(() => setError(true));
  }, [siteId]);

  if (error) return <div className="empty-state">{t("common.notFound")}</div>;
  if (!detail) return <div className="empty-state">{t("common.loading")}</div>;

  const { site, hierarchy } = detail;
  const plant = hierarchy?.children?.find((node) => node.id === plantId);

  if (!plant) return <div className="empty-state">{t("common.notFound")}</div>;

  const areas = plant.children ?? [];
  const equipmentBase = `/sites/${siteId}/plants/${plantId}/equipment`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t("breadcrumb.sites"), to: "/sites" },
          { label: localized(site.name, site.nameFa), to: `/sites/${siteId}` },
          { label: localized(plant.name, plant.nameFa) },
        ]}
      />
      <h2 className="page-title">{localized(plant.name, plant.nameFa)}</h2>
      <p className="page-subtitle">{t("plant.areasTitle")}</p>

      {areas.length === 0 ? (
        <div className="empty-state">{t("plant.noEquipment")}</div>
      ) : (
        areas.map((area) => (
          <section key={area.id} className="panel area-block">
            <h3 className="panel-title">{localized(area.name, area.nameFa)}</h3>
            {(area.children ?? []).map((system) => (
              <SystemBlock
                key={system.id}
                system={system}
                equipmentBase={equipmentBase}
              />
            ))}
          </section>
        ))
      )}
    </>
  );
}

function SystemBlock({
  system,
  equipmentBase,
}: {
  system: HierarchyNode;
  equipmentBase: string;
}) {
  const { t } = useTranslation();
  const localized = useLocalized();
  const equipment = (system.children ?? []).filter((node) => node.type === "equipment");

  return (
    <div className="system-block">
      <div className="system-label">
        {t("plant.systemLabel")}: {localized(system.name, system.nameFa)}
      </div>
      {equipment.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          {t("plant.noEquipment")}
        </p>
      ) : (
        <ul className="tag-list">
          {equipment.map((item) => (
            <li key={item.id}>
              <div>
                <strong className="mono">{item.tag}</strong>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {localized(item.name, item.nameFa)}
                </div>
              </div>
              <Link to={`${equipmentBase}/${item.ref ?? item.id}`} className="btn btn-primary">
                {t("plant.openPassport")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
