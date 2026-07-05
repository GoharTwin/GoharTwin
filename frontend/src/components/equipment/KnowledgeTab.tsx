import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getKnowledge } from "../../api/client";
import { useLocalized } from "../../i18n/useLocalized";
import type { EquipmentPassport, KnowledgeItem } from "../../types";

interface Props {
  equipment: EquipmentPassport;
}

export default function KnowledgeTab({ equipment }: Props) {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [items, setItems] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    getKnowledge()
      .then((res) =>
        setItems(
          res.items.filter((item) => item.relatedEquipment.includes(equipment.tag))
        )
      )
      .catch(() => setItems([]));
  }, [equipment.tag]);

  return (
    <section className="panel">
      <h3 className="panel-title">{t("equipment.knowledgeTab.title")}</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
        {t("equipment.knowledgeTab.desc")}
      </p>
      {items.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>{t("equipment.knowledgeTab.empty")}</p>
      ) : (
        <ul className="tag-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>
                  {localized(item.title, item.titleFa)}
                </strong>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {t(`knowledge.categories.${item.category}`)} · {item.fileType}
                </div>
              </div>
              <span className={`status-pill ${item.status}`}>
                {t(`common.${item.status}`, item.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
