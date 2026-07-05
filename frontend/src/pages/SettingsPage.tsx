import { useTranslation } from "react-i18next";
import Breadcrumbs from "../components/Breadcrumbs";

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumbs items={[{ label: t("nav.settings") }]} />
      <h2 className="page-title">{t("settings.title")}</h2>
      <div className="card-grid">
        {(["company", "language", "theme", "ai", "security", "integrations"] as const).map((tab) => (
          <div key={tab} className="glass-card">
            <h3>{t(`settings.tabs.${tab}`)}</h3>
            <p>{t(`settings.tabs.${tab}Desc`)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
