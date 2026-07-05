import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getStats } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import HealthGauge from "../components/HealthGauge";
import type { PlatformStats } from "../types";

export default function DashboardPage() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) return <div className="empty-state">{t("common.backendOffline")}</div>;
  if (!stats) return <div className="empty-state">{t("common.loading")}</div>;

  const cards = [
    { label: t("dashboard.equipmentCount"), value: stats.equipmentCount },
    { label: t("dashboard.runningEquipment"), value: stats.runningEquipment },
    { label: t("dashboard.knowledgeItems"), value: stats.knowledgeItemCount },
    { label: t("dashboard.aiRequests"), value: stats.aiRequestCount },
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: t("nav.dashboard") }]} />
      <h2 className="page-title">{t("dashboard.title")}</h2>
      <p className="page-subtitle">{t("dashboard.subtitle")}</p>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div key={card.label} className="glass-card stat-card">
            <span className="stat-label">{card.label}</span>
            <span className="stat-value stat-accent">{card.value}</span>
            <div className="stat-bar">
              <span style={{ width: `${Math.min(100, card.value * 10)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-lower">
        <section className="panel">
          <h3 className="panel-title">{t("dashboard.healthIndex")}</h3>
          <HealthGauge value={stats.healthIndex} />
        </section>

        <section className="panel">
          <h3 className="panel-title">{t("dashboard.recentAssets")}</h3>
          <ul className="tag-list">
            {stats.recentAssets.map((asset) => (
              <li key={asset.id}>
                <div>
                  <strong className="mono">{asset.tag}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {localized(asset.name, asset.nameFa)}
                  </div>
                </div>
                <span className={`status-pill ${asset.status}`}>
                  {t(`common.${asset.status}`, asset.status)}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="panel-title" style={{ marginTop: "1.25rem" }}>
            {t("dashboard.recentDocuments")}
          </h3>
          <ul className="tag-list">
            {stats.recentDocuments.map((doc) => (
              <li key={doc.id}>
                <div style={{ fontSize: "0.85rem" }}>{localized(doc.title, doc.titleFa)}</div>
                <span className={`status-pill ${doc.status}`}>
                  {t(`common.${doc.status}`, doc.status)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h3 className="panel-title">{t("dashboard.alarmSummary")}</h3>
          <div className="alarm-counts">
            <div className="alarm-count">
              <span className="count" style={{ color: "var(--danger)" }}>
                {stats.alarms.critical}
              </span>
              <span className="label">{t("dashboard.critical")}</span>
            </div>
            <div className="alarm-count">
              <span className="count" style={{ color: "var(--warning)" }}>
                {stats.alarms.warning}
              </span>
              <span className="label">{t("dashboard.warning")}</span>
            </div>
            <div className="alarm-count">
              <span className="count" style={{ color: "var(--accent)" }}>
                {stats.alarms.info}
              </span>
              <span className="label">{t("dashboard.info")}</span>
            </div>
          </div>
          {stats.alarms.recent.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>{t("dashboard.noAlarms")}</p>
          ) : (
            stats.alarms.recent.map((alarm, index) => (
              <div key={index} className="alarm-row">
                <span className={`alarm-dot ${alarm.severity}`} />
                <span className="mono" style={{ fontSize: "0.78rem" }}>
                  {alarm.tag}
                </span>
                <span style={{ color: "var(--text-secondary)" }}>
                  {localized(alarm.message, alarm.messageFa)}
                </span>
                <span className="alarm-time">{alarm.time}</span>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
