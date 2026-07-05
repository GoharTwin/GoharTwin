import { Link } from "react-router-dom";
import type { PlatformModule } from "../types";

const ICONS: Record<string, string> = {
  factory: "🏭",
  settings: "⚙️",
  bot: "🤖",
  book: "📚",
  gear: "🔧",
};

interface Props {
  module: PlatformModule;
}

export default function ModuleCard({ module }: Props) {
  const isActive = module.status === "active";
  const icon = ICONS[module.icon] ?? "📦";

  if (!isActive) {
    return (
      <div className="module-card disabled">
        <span className="module-icon">{icon}</span>
        <h3>{module.name}</h3>
        <p>{module.nameFa}</p>
        <span className="status-pill planned">Coming Soon</span>
      </div>
    );
  }

  return (
    <Link to={module.route} className="module-card">
      <span className="module-icon">{icon}</span>
      <h3>{module.name}</h3>
      <p>{module.nameFa}</p>
      <span className="status-pill active">Active</span>
    </Link>
  );
}
