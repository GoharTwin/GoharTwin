export interface PlatformModule {
  id: string;
  name: string;
  nameFa: string;
  icon: string;
  status: "active" | "planned";
  route: string;
}

export interface EquipmentSummary {
  id: string;
  tag: string;
  name: string;
  nameFa?: string;
  type: string;
  plant: string;
  area: string;
  status: string;
  category: string;
}

export interface Sensor {
  tag: string;
  name: string;
  type: string;
  unit: string;
  range: string;
}

export interface EquipmentPassport {
  tag: string;
  name: string;
  nameFa?: string;
  type: string;
  plant: string;
  area: string;
  status: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  specifications?: Record<string, unknown>;
  motor?: Record<string, unknown>;
  sensors?: Sensor[];
  interlocks?: string[];
  maintenance?: {
    strategy?: string;
    intervals?: Array<{ task: string; frequency: string }>;
    spareParts?: string[];
  };
  documents?: Array<{ title: string; status: string }>;
  relatedEquipment?: string[];
  aiContext?: string;
  version?: string;
  lastUpdated?: string;
}

export interface SiteUnit {
  type: string;
  name: string;
  nameFa: string;
  count: number;
}

export interface Site {
  id: string;
  code: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  status: "active" | "coming-soon";
  icon: string;
  units: SiteUnit[];
}

export interface HierarchyNode {
  id: string;
  type: "site" | "plant" | "area" | "system" | "equipment";
  name?: string;
  nameFa?: string;
  status?: string;
  tag?: string;
  ref?: string;
  children?: HierarchyNode[];
}

export interface SiteDetail {
  site: Site;
  hierarchy: HierarchyNode | null;
}

export interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  titleFa?: string;
  description?: string;
  descriptionFa?: string;
  fileType: string;
  status: string;
  relatedEquipment: string[];
  date: string;
}

export interface AlarmEntry {
  severity: "critical" | "warning" | "info";
  tag: string;
  message: string;
  messageFa?: string;
  time: string;
}

export interface PlatformStats {
  equipmentCount: number;
  runningEquipment: number;
  knowledgeItemCount: number;
  aiRequestCount: number;
  healthIndex: number;
  recentAssets: Array<{
    id: string;
    tag: string;
    name: string;
    nameFa?: string;
    status: string;
  }>;
  recentDocuments: Array<{
    id: string;
    title: string;
    titleFa?: string;
    category: string;
    status: string;
  }>;
  alarms: {
    critical: number;
    warning: number;
    info: number;
    recent: AlarmEntry[];
  };
}

export interface AIStatus {
  provider: string;
  online: boolean;
  knowledgeDriven: boolean;
  requestCount: number;
}

export interface ChatAttachment {
  name: string;
  kind: "file" | "image";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
