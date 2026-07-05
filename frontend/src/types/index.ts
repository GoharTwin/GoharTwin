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
