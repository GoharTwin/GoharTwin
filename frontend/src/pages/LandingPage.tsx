import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../components/Logo";

const CAPABILITIES = ["digitalTwin", "industrialAi", "knowledgeGraph", "predictiveMaintenance", "digitalFactory", "processIntelligence"] as const;
const ROADMAP = ["v01", "v02", "v03", "v10"] as const;

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="landing-hero">
        <Logo className="hero-logo splash-logo" />
        <h1>{t("common.appName")}</h1>
        <p className="hero-tagline">{t("landing.heroTagline")}</p>
        <p className="hero-intro">{t("landing.heroIntro")}</p>
      </section>

      <section className="landing-section">
        <h2>{t("landing.aboutTitle")}</h2>
        <p>{t("landing.aboutText")}</p>
      </section>

      <section className="landing-section two-col">
        <div className="glass-card"><h3>{t("landing.visionTitle")}</h3><p>{t("landing.visionText")}</p></div>
        <div className="glass-card"><h3>{t("landing.missionTitle")}</h3><p>{t("landing.missionText")}</p></div>
      </section>

      <section>
        <h2 className="page-title landing-center">{t("landing.capabilitiesTitle")}</h2>
        <div className="card-grid">
          {CAPABILITIES.map((id) => (
            <div key={id} className="glass-card capability-card">
              <h3>{t(`landing.capabilities.${id}.title`)}</h3>
              <p>{t(`landing.capabilities.${id}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>{t("landing.roadmapTitle")}</h2>
        <ul className="roadmap-list">
          {ROADMAP.map((v) => (
            <li key={v} className="glass-card"><strong>{t(`landing.roadmap.${v}.label`)}</strong> — {t(`landing.roadmap.${v}.desc`)}</li>
          ))}
        </ul>
      </section>

      <div className="landing-cta">
        <Link to="/companies" className="btn btn-gold btn-lg">{t("landing.start")}</Link>
      </div>
    </>
  );
}
