interface Props {
  icon: string;
}

/** Simple inline industrial SVG icons for site/unit types. */
export default function SiteIcon({ icon }: Props) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "mine":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 20 L9 8 L13 14 L16 10 L21 20 Z" />
          <path d="M9 8 L11 4 M16 10 L17.5 6" />
          <circle cx="11" cy="4" r="1.1" />
        </svg>
      );
    case "concentrator":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 20 V10 L9 13 V10 L14 13 V10 L20 13 V20 Z" />
          <path d="M6 10 V5 h2 v5" />
        </svg>
      );
    case "pellet":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="12" width="18" height="8" rx="2" />
          <circle cx="8" cy="16" r="1.6" />
          <circle cx="12.5" cy="16" r="1.6" />
          <circle cx="17" cy="16" r="1.6" />
          <path d="M6 12 V7 a6 6 0 0 1 12 0 v5" />
        </svg>
      );
    case "dri":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M9 3 h6 v5 l2 3 v10 H7 V11 l2 -3 Z" />
          <path d="M10 16 c0.5 -1.5 3.5 -1.5 4 0 M10 19 h4" />
        </svg>
      );
    case "steel":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M5 8 h10 l4 4 v8 H5 Z" />
          <path d="M8 8 V4 h4 v4" />
          <path d="M9 15 l2 2 l4 -4" />
        </svg>
      );
    case "rolling":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="7" cy="9" r="3" />
          <circle cx="17" cy="9" r="3" />
          <path d="M2 15 h20 M4 19 h16" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M3 20 V9 l5 3 V9 l5 3 V9 l5 3 v8 Z" />
          <path d="M17 9 V4 h2 v5" />
        </svg>
      );
  }
}
