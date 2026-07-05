import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getKnowledge } from "../api/client";
import { useLocalized } from "../i18n/useLocalized";
import Breadcrumbs from "../components/Breadcrumbs";
import type { KnowledgeItem } from "../types";

const CATEGORIES = [
  { id: "all", icon: "🗂" },
  { id: "documents", icon: "📄" },
  { id: "pid", icon: "📐" },
  { id: "manuals", icon: "📘" },
  { id: "photos", icon: "🖼" },
  { id: "videos", icon: "🎬" },
  { id: "drawings", icon: "✏️" },
  { id: "standards", icon: "📏" },
  { id: "lessons", icon: "💡" },
];

const FILE_ICONS: Record<string, string> = {
  pdf: "📄",
  xlsx: "📊",
  dwg: "📐",
  jpg: "🖼",
  mp4: "🎬",
  md: "💡",
};

export default function KnowledgePage() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    getKnowledge()
      .then((res) => setItems(res.items))
      .catch(() => setError(true));
  }, []);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!lowered) return true;
      return [item.title, item.titleFa, item.description, item.descriptionFa]
        .filter(Boolean)
        .some((text) => text!.toLowerCase().includes(lowered));
    });
  }, [items, category, query]);

  const countFor = (id: string) =>
    id === "all" ? items.length : items.filter((item) => item.category === id).length;

  return (
    <>
      <Breadcrumbs items={[{ label: t("nav.knowledge") }]} />
      <h2 className="page-title">{t("knowledge.title")}</h2>
      <p className="page-subtitle">{t("knowledge.subtitle")}</p>

      {error && <div className="empty-state">{t("common.backendOffline")}</div>}

      <input
        className="search-input"
        style={{ marginBottom: "1.25rem" }}
        placeholder={t("knowledge.searchPlaceholder")}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`glass-card category-card clickable${category === cat.id ? " selected" : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-name">{t(`knowledge.categories.${cat.id}`)}</span>
            <span className="cat-count">{countFor(cat.id)}</span>
          </div>
        ))}
      </div>

      <section className="panel">
        <h3 className="panel-title">
          {t(`knowledge.categories.${category}`)} — {t("knowledge.itemsCount", { count: filtered.length })}
        </h3>
        {filtered.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>{t("knowledge.noItems")}</p>
        ) : (
          <ul className="tag-list">
            {filtered.map((item) => (
              <li key={item.id}>
                <div className="knowledge-item">
                  <span className="item-icon">{FILE_ICONS[item.fileType] ?? "📄"}</span>
                  <div>
                    <h4>{localized(item.title, item.titleFa)}</h4>
                    <p>{localized(item.description, item.descriptionFa)}</p>
                    <div className="item-meta">
                      <span className="file-type-badge">{item.fileType}</span>
                      <span className={`status-pill ${item.status}`}>
                        {t(`common.${item.status}`, item.status)}
                      </span>
                      {item.relatedEquipment.length > 0 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {t("knowledge.relatedTo")}:{" "}
                          <span className="mono">{item.relatedEquipment.join(", ")}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
