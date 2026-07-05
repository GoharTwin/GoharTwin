import { useTranslation } from "react-i18next";

const ENTRY_KEYS = ["h1", "h2", "h3", "h4"];

export default function HistoryTab() {
  const { t } = useTranslation();

  return (
    <section className="panel">
      <h3 className="panel-title">{t("equipment.historyTitle")}</h3>
      <ul className="timeline">
        {ENTRY_KEYS.map((key) => (
          <li key={key}>
            <div className="timeline-date">{t(`equipment.history.${key}.date`)}</div>
            <div className="timeline-title">{t(`equipment.history.${key}.title`)}</div>
            <div className="timeline-desc">{t(`equipment.history.${key}.desc`)}</div>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
        {t("equipment.historyNote")}
      </p>
    </section>
  );
}
