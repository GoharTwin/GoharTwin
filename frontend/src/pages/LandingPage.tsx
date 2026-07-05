import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.svg";

const CAPABILITIES = [
  { id: "digitalTwin", icon: "◈" },
  { id: "industrialAi", icon: "⚛" },
  { id: "knowledgeGraph", icon: "🕸" },
  { id: "predictiveMaintenance", icon: "📈" },
  { id: "digitalFactory", icon: "🏭" },
  { id: "processIntelligence", icon: "⚙" },
];

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="landing-hero">
        <img src={logo} alt="GoharTwin" className="hero-logo" />
        <h1>{t("common.appName")}</h1>
        <p className="hero-tagline">{t("landing.heroTagline")}</p>
        <p className="hero-intro">{t("landing.heroIntro")}</p>
      </section>

      <section>
        <h2 className="page-title" style={{ textAlign: "center", fontSize: "1.35rem" }}>
          {t("landing.capabilitiesTitle")}
        </h2>
        <p className="page-subtitle" style={{ textAlign: "center" }}>
          {t("landing.capabilitiesSubtitle")}
        </p>
        <div className="card-grid">
          {CAPABILITIES.map((capability) => (
            <div key={capability.id} className="glass-card capability-card">
              <span className="capability-icon">{capability.icon}</span>
              <h3>{t(`landing.capabilities.${capability.id}.title`)}</h3>
              <p>{t(`landing.capabilities.${capability.id}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="landing-cta">
        <Link to="/sites" className="btn btn-gold btn-lg">
          {t("landing.start")}
        </Link>
      </div>
    </>
  );
}
