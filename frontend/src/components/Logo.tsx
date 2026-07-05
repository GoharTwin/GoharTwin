import { LOGO_URL } from "../core/branding";
import logoSvg from "../assets/logo.svg";

interface Props {
  className?: string;
  alt?: string;
}

export default function Logo({ className, alt = "GoharTwin" }: Props) {
  return (
    <img
      className={className}
      src={LOGO_URL}
      alt={alt}
      onError={(e) => {
        if (!e.currentTarget.src.endsWith("logo.svg")) {
          e.currentTarget.src = logoSvg;
        }
      }}
    />
  );
}
