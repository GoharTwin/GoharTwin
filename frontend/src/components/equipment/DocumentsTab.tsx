import { useTranslation } from "react-i18next";
import type { EquipmentPassport } from "../../types";

interface Props {
  equipment: EquipmentPassport;
}

export default function DocumentsTab({ equipment }: Props) {
  const { t } = useTranslation();
  const documents = equipment.documents ?? [];

  return (
    <section className="panel">
      <h3 className="panel-title">{t("equipment.documentsTitle")}</h3>
      {documents.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>{t("equipment.noData")}</p>
      ) : (
        <ul className="tag-list">
          {documents.map((document) => (
            <li key={document.title}>
              <span style={{ fontSize: "0.9rem" }}>📄 {document.title}</span>
              <span className={`status-pill ${document.status}`}>
                {t(`common.${document.status}`, document.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
