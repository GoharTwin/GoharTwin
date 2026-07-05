import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCompanyDetail } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteIcon from "../components/SiteIcon";
import { collectPlants, companyPath } from "../utils/hierarchy";
import type { CompanyDetail } from "../types";

export default function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { t } = useTranslation();
  const localized = useLocalized();
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    getCompanyDetail(companyId).then(setDetail).catch(() => setError(true));
  }, [companyId]);

  if (error) return <div className="empty-state">{t("common.notFound")}</div>;
  if (!detail) return <div className="empty-state">{t("common.loading")}</div>;

  const { company, hierarchy } = detail;
  const plants = collectPlants(hierarchy);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t("breadcrumb.companies"), to: "/companies" },
          { label: localized(company.name, company.nameFa) },
        ]}
      />
      <h2 className="page-title">{localized(company.name, company.nameFa)}</h2>
      <p className="page-subtitle">{t("site.plantsSubtitle")}</p>

      <div className="card-grid">
        {plants.map((plant) => {
          const isActive = plant.status === "active";
          const inner = (
            <>
              <div className="site-card-head">
                <span className="site-icon"><SiteIcon icon={plant.id.replace(/-\d+$/, "")} /></span>
                <h3>{localized(plant.name, plant.nameFa)}</h3>
              </div>
              <span className={`status-pill ${isActive ? "active" : "planned"}`}>
                {isActive ? t("common.active") : t("common.comingSoon")}
              </span>
            </>
          );
          return isActive ? (
            <Link key={plant.id} to={companyPath(company.id, `/plants/${plant.id}`)} className="glass-card site-card">
              {inner}
            </Link>
          ) : (
            <div key={plant.id} className="glass-card site-card disabled">{inner}</div>
          );
        })}
      </div>
    </>
  );
}
