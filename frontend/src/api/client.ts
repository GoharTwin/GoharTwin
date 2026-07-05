import type { EquipmentPassport, EquipmentSummary, PlatformModule } from "../types";

const API_BASE = "/api";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export function getModules() {
  return fetchJson<{ modules: PlatformModule[] }>(`${API_BASE}/modules`);
}

export function getEquipmentList() {
  return fetchJson<{ count: number; items: EquipmentSummary[] }>(
    `${API_BASE}/equipment`
  );
}

export function getEquipment(id: string) {
  return fetchJson<EquipmentPassport>(`${API_BASE}/equipment/${id}`);
}

export function getHealth() {
  return fetchJson<{ status: string; version: string }>(`${API_BASE}/health`);
}
