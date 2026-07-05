import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getEquipmentRelationships } from "../../api/client";
import { useLocalized } from "../../i18n/useLocalized";

interface Props {
  equipmentId: string;
}

export default function RelationshipsTab({ equipmentId }: Props) {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [data, setData] = useState<{ nodes: Array<Record<string, string>>; edges: Array<Record<string, string>> } | null>(null);

  useEffect(() => {
    getEquipmentRelationships(equipmentId)
      .then((res) => setData(res as typeof data))
      .catch(() => setData(null));
  }, [equipmentId]);

  if (!data) return <div className="empty-state">{t("common.loading")}</div>;

  return (
    <div className="panel">
      <h3 className="panel-title">{t("equipment.relationshipsTitle")}</h3>
      <div className="relationship-grid">
        {data.nodes.map((node) => (
          <div key={node.id} className="glass-card relationship-node">
            <span className="mono">{node.tag || node.id}</span>
            <div>{localized(node.name, node.nameFa)}</div>
            <span className="status-pill planned">{node.type}</span>
          </div>
        ))}
      </div>
      <ul className="relationship-edges">
        {data.edges.map((edge, i) => (
          <li key={i}>
            {edge.from} → {edge.to} ({edge.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
