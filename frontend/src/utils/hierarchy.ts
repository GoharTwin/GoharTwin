import type { HierarchyNode } from "../types";

export function collectPlants(node: HierarchyNode | null | undefined): HierarchyNode[] {
  if (!node) return [];
  if (node.type === "plant") return [node];
  return (node.children ?? []).flatMap(collectPlants);
}

export function findPlant(root: HierarchyNode | null | undefined, plantId: string): HierarchyNode | undefined {
  return collectPlants(root).find((p) => p.id === plantId);
}

export function companyPath(companyId: string, suffix = ""): string {
  return `/companies/${companyId}${suffix}`;
}
