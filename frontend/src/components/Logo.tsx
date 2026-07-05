import logoPng from "../assets/logo.png";
import logoSvg from "../assets/logo.svg";

const FALLBACKS = [logoPng, logoSvg];

export function resolveLogoSrc(): string {
  return logoPng;
}

interface Props {
  className?: string;
  alt?: string;
}

export default function Logo({ className, alt = "GoharTwin" }: Props) {
  return (
    <img
      className={className}
      src={resolveLogoSrc()}
      alt={alt}
      onError={(e) => {
        const img = e.currentTarget;
        const current = FALLBACKS.findIndex((src) => img.src.includes(src.split("/").pop() ?? ""));
        const next = FALLBACKS[current + 1];
        if (next) img.src = next;
      }}
    />
  );
}
