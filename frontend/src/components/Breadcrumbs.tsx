import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  items: Crumb[];
}

export default function Breadcrumbs({ items }: Props) {
  const { t, i18n } = useTranslation();
  const separator = i18n.dir() === "rtl" ? "‹" : "›";

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <Link to="/">{t("breadcrumb.home")}</Link>
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          <span className="crumb-sep">{separator}</span>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="crumb-current">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
