import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { APP_VERSION } from "../constants/version";

export default function SplashScreen() {
  const { t } = useTranslation();

  return (
    <div className="splash" role="status" aria-live="polite" aria-label={t("splash.loading")}>
      <div className="splash-content">
        <Logo className="splash-logo splash-animate" alt="GoharTwin" />
        <p className="splash-tagline splash-animate-delay">{t("splash.tagline")}</p>
        <p className="splash-version splash-animate-delay">v{APP_VERSION}</p>
        <div className="splash-progress" aria-hidden="true">
          <span className="splash-progress-bar" />
        </div>
      </div>
    </div>
  );
}
