import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="empty-state">
      <h2 className="page-title">404</h2>
      <p>{t("common.notFound")}</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
        {t("breadcrumb.home")}
      </Link>
    </div>
  );
}
