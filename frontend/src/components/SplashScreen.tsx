import { useTranslation } from "react-i18next";
import logo from "../assets/logo.svg";

export default function SplashScreen() {
  const { t } = useTranslation();

  return (
    <div className="splash">
      <div className="splash-content">
        <img src={logo} alt="GoharTwin" className="splash-logo" />
        <div className="splash-title">{t("common.appName")}</div>
        <div className="splash-tagline">{t("splash.tagline")}</div>
      </div>
    </div>
  );
}
