import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCompanies } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import SiteIcon from "../components/SiteIcon";
import type { Company } from "../types";

export default function CompaniesPage() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCompanies().then((r) => setCompanies(r.companies)).catch(() => setError(true));
  }, []);

  return (
    <>
      <Breadcrumbs items={[{ label: t("breadcrumb.companies") }]} />
      <h2 className="page-title">{t("companies.title")}</h2>
      <p className="page-subtitle">{t("companies.subtitle")}</p>
      {error && <div className="empty-state">{t("common.backendOffline")}</div>}
      <div className="card-grid">
        {companies.map((company) => (
          <div key={company.id} className={`glass-card site-card${company.status !== "active" ? " disabled" : ""}`}>
            <div className="site-card-head">
              <span className="site-icon"><SiteIcon icon={company.icon} /></span>
              <div>
                <span className="site-code mono">{company.code}</span>
                <h3>{localized(company.name, company.nameFa)}</h3>
              </div>
            </div>
            <p className="site-desc">{localized(company.description, company.descriptionFa)}</p>
            <div className="unit-badges">
              {company.units.map((unit) => (
                <span key={unit.type} className="unit-badge">
                  <b>{unit.count}</b> {localized(unit.name, unit.nameFa)}
                </span>
              ))}
            </div>
            {(company.website || company.officialWebsite) && (
              <a href={company.website || company.officialWebsite} target="_blank" rel="noreferrer" className="btn btn-ghost">
                {t("companies.website")}
              </a>
            )}
            <div className="site-card-foot">
              <span className={`status-pill ${company.status}`}>
                {company.status === "active" ? t("common.active") : t("common.comingSoon")}
              </span>
              {company.loginEnabled ? (
                <Link to={`/login?company=${company.id}`} className="btn btn-primary">{t("companies.login")}</Link>
              ) : company.status === "active" ? (
                <Link to={`/companies/${company.id}`} className="btn btn-ghost">{t("companies.enter")}</Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
