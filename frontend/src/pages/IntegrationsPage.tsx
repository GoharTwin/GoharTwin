import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getIntegrations } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [items, setItems] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    getIntegrations().then((r) => setItems(r.integrations)).catch(() => setItems([]));
  }, []);

  return (
    <>
      <Breadcrumbs items={[{ label: t("nav.integrations") }]} />
      <h2 className="page-title">{t("integrations.title")}</h2>
      <p className="page-subtitle">{t("integrations.subtitle")}</p>
      <div className="card-grid">
        {items.map((item) => (
          <div key={item.id} className="glass-card">
            <h3>{localized(item.name, item.nameFa)}</h3>
            <p>{localized(item.description || "", item.descriptionFa || "")}</p>
            <span className="status-pill planned">{t("integrations.notConnected")}</span>
          </div>
        ))}
      </div>
      <Link to="/settings" className="btn btn-ghost">{t("nav.settings")}</Link>
    </>
  );
}
