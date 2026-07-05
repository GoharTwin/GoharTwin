import type {
  AIStatus,
  EquipmentPassport,
  EquipmentSummary,
  HierarchyNode,
  KnowledgeItem,
  PlatformModule,
  PlatformStats,
  Site,
  SiteDetail,
} from "../types";

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

export function getHierarchy() {
  return fetchJson<{ version: string; sites: HierarchyNode[] }>(
    `${API_BASE}/hierarchy`
  );
}

export function getSites() {
  return fetchJson<{ sites: Site[] }>(`${API_BASE}/sites`);
}

export function getSiteDetail(siteId: string) {
  return fetchJson<SiteDetail>(`${API_BASE}/sites/${siteId}`);
}

export function getKnowledge(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return fetchJson<{ count: number; items: KnowledgeItem[] }>(
    `${API_BASE}/knowledge${query}`
  );
}

export function getStats() {
  return fetchJson<PlatformStats>(`${API_BASE}/stats`);
}

export function getAIStatus() {
  return fetchJson<AIStatus>(`${API_BASE}/ai/status`);
}

/**
 * Streams the AI chat reply chunk by chunk.
 * Designed so a real LLM provider can replace the backend transparently.
 */
export async function streamChat(
  message: string,
  language: string,
  equipmentId: string | null,
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, language, equipmentId }),
  });
  if (!response.ok || !response.body) {
    throw new Error(`AI chat error: ${response.status}`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
