import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fa from "./locales/fa.json";
import en from "./locales/en.json";

const STORAGE_KEY = "gohartwin.language";

export function applyDocumentDirection(language: string) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
}

const saved = localStorage.getItem(STORAGE_KEY) ?? "fa";

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
  },
  lng: saved,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

applyDocumentDirection(saved);

i18n.on("languageChanged", (language) => {
  localStorage.setItem(STORAGE_KEY, language);
  applyDocumentDirection(language);
});

export default i18n;
