import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "fa", label: "🇮🇷 فارسی" },
  { code: "en", label: "🇺🇸 English" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={i18n.language === lang.code ? "active" : ""}
          onClick={() => i18n.changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
