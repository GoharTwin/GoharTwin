import type {
  AIStatus,
  Company,
  CompanyDetail,
  EquipmentPassport,
  EquipmentSummary,
  KnowledgeItem,
  PlatformModule,
  PlatformStats,
  SearchResult,
} from "../../types";

const API = "/api/v1";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("gohartwin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getHealth() {
  return fetchJson<{ status: string; version: string }>(`${API}/health`);
}

export function getModules() {
  return fetchJson<{ modules: PlatformModule[] }>(`${API}/modules`);
}

export function getCompanies() {
  return fetchJson<{ companies: Company[] }>(`${API}/companies`);
}

export function getCompanyDetail(companyId: string) {
  return fetchJson<CompanyDetail>(`${API}/companies/${companyId}`);
}

/** @deprecated use getCompanies */
export function getSites() {
  return getCompanies().then((r) => ({ sites: r.companies }));
}

export function getSiteDetail(siteId: string) {
  return getCompanyDetail(siteId);
}

export function getEquipmentList() {
  return fetchJson<{ count: number; items: EquipmentSummary[] }>(`${API}/equipment`);
}

export function getEquipment(id: string) {
  return fetchJson<EquipmentPassport>(`${API}/equipment/${id}`);
}

export function getEquipmentRelationships(id: string) {
  return fetchJson<{ nodes: Array<Record<string, string>> }>(`${API}/equipment/${id}/relationships`);
}

export function getEquipmentTimeline(id: string) {
  return fetchJson<{ equipmentId: string; timeline: Array<Record<string, string>> }>(
    `${API}/equipment/${id}/timeline`
  );
}

export function getEquipmentContext(id: string) {
  return fetchJson<Record<string, unknown>>(`${API}/equipment/${id}/context`);
}

export function getKnowledge(category?: string) {
  const q = category ? `?category=${encodeURIComponent(category)}` : "";
  return fetchJson<{ count: number; items: KnowledgeItem[] }>(`${API}/knowledge${q}`);
}

export function getStats() {
  return fetchJson<PlatformStats>(`${API}/stats`);
}

export function getAIStatus() {
  return fetchJson<AIStatus>(`${API}/ai/status`);
}

export function aiChat(message: string, language: string, equipmentId: string | null) {
  return fetchJson<{ message: string; connected: boolean; context: unknown }>(`${API}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, language, equipmentId }),
  });
}

export function login(username: string, password: string, companyId: string) {
  return fetchJson<{
    token: string;
    user: Record<string, unknown>;
    companyId: string;
    roleId: string;
  }>(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, companyId }),
  });
}

export function getMe() {
  return fetchJson<{ user: Record<string, unknown> }>(`${API}/auth/me`, { headers: authHeaders() });
}

export function search(query: string) {
  return fetchJson<{ results: SearchResult[] }>(`${API}/search?q=${encodeURIComponent(query)}`);
}

export function getIntegrations() {
  return fetchJson<{ integrations: Array<Record<string, string>> }>(`${API}/integrations`);
}

export function getNotifications() {
  return fetchJson<{ items: Array<Record<string, unknown>> }>(`${API}/notifications`);
}

export function getSceneConfig(plantId: string) {
  return Promise.resolve({
    objects: [
      { id: "fan-11", label: "FAN-11", x: 0, y: 0, z: 0, color: "#3b82f6" },
      { id: "kiln", label: "Grate-Kiln", x: 2, y: 0, z: -1, color: "#d4a853" },
      { id: "windbox", label: "Windbox-11", x: -1.5, y: 0.5, z: 0.5, color: "#64748b" },
    ],
    plantId,
  });
}

/** @deprecated AI streaming removed in v0.3 */
export async function streamChat(
  message: string,
  language: string,
  equipmentId: string | null,
  onChunk: (text: string) => void
): Promise<void> {
  try {
    const res = await aiChat(message, language, equipmentId);
    onChunk(res.message);
  } catch {
    onChunk("AI provider not connected");
  }
}
