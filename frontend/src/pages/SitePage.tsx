import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSiteDetail } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteIcon from "../components/SiteIcon";
import type { SiteDetail } from "../types";

export default function SitePage() {
  const { siteId } = useParams<{ siteId: string }>();
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

  if (error) {
    return <div className="empty-state">{t("common.notFound")}</div>;
  }

  if (!detail) {
    return <div className="empty-state">{t("common.loading")}</div>;
  }

  const { site, hierarchy } = detail;
  const plants = hierarchy?.children ?? [];

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t("breadcrumb.sites"), to: "/sites" },
          { label: localized(site.name, site.nameFa) },
        ]}
      />
      <h2 className="page-title">{localized(site.name, site.nameFa)}</h2>
      <p className="page-subtitle">{t("site.plantsSubtitle")}</p>

      {plants.length === 0 ? (
        <div className="empty-state">{t("site.noPlants")}</div>
      ) : (
        <div className="card-grid">
          {plants.map((plant) => {
            const isActive = plant.status === "active";
            const card = (
              <>
                <div className="site-card-head">
                  <span className="site-icon">
                    <SiteIcon icon={plant.id.replace(/-\d+$/, "")} />
                  </span>
                  <h3>{localized(plant.name, plant.nameFa)}</h3>
                </div>
                <span className={`status-pill ${isActive ? "active" : "planned"}`}>
                  {isActive ? t("common.active") : t("common.comingSoon")}
                </span>
              </>
            );
            return isActive ? (
              <Link
                key={plant.id}
                to={`/sites/${site.id}/plants/${plant.id}`}
                className="glass-card site-card"
              >
                {card}
              </Link>
            ) : (
              <div key={plant.id} className="glass-card site-card disabled">
                {card}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
