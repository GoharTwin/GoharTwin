import { useTranslation } from "react-i18next";

/** Returns a picker that chooses the Persian variant when the UI is in Persian. */
export function useLocalized() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  return (en?: string | null, fa?: string | null): string =>
    (isFa && fa ? fa : en) ?? "";
}
