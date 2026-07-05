import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCompanyDetail, getSceneConfig } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import PageSkeleton from "../components/PageSkeleton";
import { findPlant, companyPath } from "../utils/hierarchy";
import type { CompanyDetail, HierarchyNode } from "../types";

const PlaceholderPlantScene = lazy(() => import("../scenes/PlaceholderPlantScene"));

export default function PlantPage() {
  const { companyId, siteId, plantId } = useParams<{ companyId?: string; siteId?: string; plantId: string }>();
  const cid = companyId || siteId;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const localized = useLocalized();
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [error, setError] = useState(false);
  const [view, setView] = useState<"overview" | "3d">("overview");
  const [sceneObjects, setSceneObjects] = useState<Array<{ id: string; label: string; x: number; y: number; z: number; color: string }>>([]);

  useEffect(() => {
    if (!cid) return;
    getCompanyDetail(cid).then(setDetail).catch(() => setError(true));
  }, [cid]);

  useEffect(() => {
    if (!plantId) return;
    getSceneConfig(plantId).then((r) => setSceneObjects(r.objects as typeof sceneObjects));
  }, [plantId]);

  if (error || !cid) return <div className="empty-state">{t("common.notFound")}</div>;
  if (!detail) return <div className="empty-state">{t("common.loading")}</div>;

  const { company, hierarchy } = detail;
  const plant = findPlant(hierarchy, plantId!);
  if (!plant) return <div className="empty-state">{t("common.notFound")}</div>;

  const areas = plant.children ?? [];
  const equipmentBase = companyPath(cid, `/plants/${plantId}/equipment`);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t("breadcrumb.companies"), to: "/companies" },
          { label: localized(company.name, company.nameFa), to: companyPath(cid) },
          { label: localized(plant.name, plant.nameFa) },
        ]}
      />
      <h2 className="page-title">{localized(plant.name, plant.nameFa)}</h2>
      <div className="tabs-bar">
        <button className={`tab-btn${view === "overview" ? " active" : ""}`} onClick={() => setView("overview")}>{t("plant.overviewTab")}</button>
        <button className={`tab-btn${view === "3d" ? " active" : ""}`} onClick={() => setView("3d")}>{t("plant.scene3dTab")}</button>
      </div>

      {view === "3d" ? (
        <div className="panel">
          <p className="page-subtitle">{t("plant.scene3dDesc")}</p>
          <Suspense fallback={<PageSkeleton />}>
            <PlaceholderPlantScene
              objects={sceneObjects}
              onSelect={(id) => navigate(`${equipmentBase}/${id}`)}
            />
          </Suspense>
        </div>
      ) : (
        <>
      <p className="page-subtitle">{t("plant.areasTitle")}</p>

      {areas.length === 0 ? (
        <div className="empty-state">{t("plant.noEquipment")}</div>
      ) : (
        areas.map((area) => (
          <section key={area.id} className="panel area-block">
            <h3 className="panel-title">{localized(area.name, area.nameFa)}</h3>
            {(area.children ?? []).map((unit) => (
              <UnitBlock key={unit.id} unit={unit} equipmentBase={equipmentBase} />
            ))}
          </section>
        ))
      )}
        </>
      )}
    </>
  );
}

function UnitBlock({ unit, equipmentBase }: { unit: HierarchyNode; equipmentBase: string }) {
  const { t } = useTranslation();
  const localized = useLocalized();
  const equipment = (unit.children ?? []).filter((node) => node.type === "equipment");

  return (
    <div className="system-block">
      <div className="system-label">
        {t("plant.systemLabel")}: {localized(unit.name, unit.nameFa)}
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
