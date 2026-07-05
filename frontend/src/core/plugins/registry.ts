/** Plugin registration skeleton — modules register routes and nav items here. */

export interface PluginDefinition {
  id: string;
  name: string;
  nameFa: string;
  route: string;
  enabled: boolean;
}

const registry: PluginDefinition[] = [];

export function registerPlugin(plugin: PluginDefinition): void {
  registry.push(plugin);
}

export function getPlugins(): PluginDefinition[] {
  return registry.filter((p) => p.enabled);
}
