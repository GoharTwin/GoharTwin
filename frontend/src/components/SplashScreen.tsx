import { useTranslation } from "react-i18next";
import Logo from "./Logo";

export default function SplashScreen() {
  const { t } = useTranslation();
  return (
    <div className="splash">
      <div className="splash-content">
        <Logo className="splash-logo splash-animate" />
        <div className="splash-title">{t("common.appName")}</div>
        <div className="splash-tagline">{t("splash.tagline")}</div>
      </div>
    </div>
  );
}
