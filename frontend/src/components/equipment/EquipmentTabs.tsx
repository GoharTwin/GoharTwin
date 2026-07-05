import { useState } from "react";
import { useTranslation } from "react-i18next";
import OverviewTab from "./OverviewTab";
import SpecificationsTab from "./SpecificationsTab";
import SensorsTab from "./SensorsTab";
import DocumentsTab from "./DocumentsTab";
import HistoryTab from "./HistoryTab";
import MaintenanceTab from "./MaintenanceTab";
import KnowledgeTab from "./KnowledgeTab";
import ChatPanel from "../chat/ChatPanel";
import type { EquipmentPassport } from "../../types";

const TABS = [
  "overview",
  "specifications",
  "sensors",
  "documents",
  "history",
  "maintenance",
  "knowledge",
  "ai",
] as const;

type TabId = (typeof TABS)[number];

interface Props {
  equipment: EquipmentPassport;
  equipmentId: string;
}

export default function EquipmentTabs({ equipment, equipmentId }: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <>
      <div className="tabs-bar">
        {TABS.map((tabId) => (
          <button
            key={tabId}
            className={`tab-btn${tab === tabId ? " active" : ""}`}
            onClick={() => setTab(tabId)}
          >
            {t(`equipment.tabs.${tabId}`)}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab equipment={equipment} />}
      {tab === "specifications" && <SpecificationsTab equipment={equipment} />}
      {tab === "sensors" && <SensorsTab equipment={equipment} />}
      {tab === "documents" && <DocumentsTab equipment={equipment} />}
      {tab === "history" && <HistoryTab />}
      {tab === "maintenance" && <MaintenanceTab equipment={equipment} />}
      {tab === "knowledge" && <KnowledgeTab equipment={equipment} />}
      {tab === "ai" && <ChatPanel equipmentId={equipmentId} embedded />}
    </>
  );
}
