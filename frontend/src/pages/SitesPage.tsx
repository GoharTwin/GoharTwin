import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSites } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteIcon from "../components/SiteIcon";
import type { Site } from "../types";

export default function SitesPage() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSites()
      .then((res) => setSites(res.sites))
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumb.sites") }]} />
      <h2 className="page-title">{t("sites.title")}</h2>
      <p className="page-subtitle">{t("sites.subtitle")}</p>

      {error && <div className="empty-state">{t("common.backendOffline")}</div>}

      <div className="card-grid">
        {sites.map((site) => (
          <Link
            key={site.id}
            to={`/sites/${site.id}`}
            className={`glass-card site-card${site.status !== "active" ? " disabled" : ""}`}
          >
            <div className="site-card-head">
              <span className="site-icon">
                <SiteIcon icon={site.icon} />
              </span>
              <div>
                <span className="site-code mono">{site.code}</span>
                <h3>{localized(site.name, site.nameFa)}</h3>
              </div>
            </div>
            <p className="site-desc">{localized(site.description, site.descriptionFa)}</p>
            <div className="unit-badges">
              {site.units.map((unit) => (
                <span key={unit.type} className="unit-badge">
                  <b>{unit.count}</b> {localized(unit.name, unit.nameFa)}
                </span>
              ))}
            </div>
            <div className="site-card-foot">
              <span className={`status-pill ${site.status}`}>
                {site.status === "active" ? t("common.active") : t("common.comingSoon")}
              </span>
              <span className="btn btn-ghost">{t("sites.enter")}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
