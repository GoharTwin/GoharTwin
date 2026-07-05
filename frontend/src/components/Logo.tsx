import logoSvg from "../assets/logo.svg";

const sources = ["/logo/logo.png", "/logo/logo.svg", logoSvg];

export function resolveLogoSrc(): string {
  return logoSvg;
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
        const idx = sources.indexOf(img.src.replace(window.location.origin, ""));
        if (idx >= 0 && idx < sources.length - 1) img.src = sources[idx + 1];
      }}
    />
  );
}
