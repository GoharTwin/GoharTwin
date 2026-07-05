import { useTranslation } from "react-i18next";
import Breadcrumbs from "../components/Breadcrumbs";
import ChatPanel from "../components/chat/ChatPanel";

export default function AIPage() {
  const { t } = useTranslation();

  return (
    <>
      <Breadcrumbs items={[{ label: t("nav.ai") }]} />
      <h2 className="page-title">{t("ai.title")}</h2>
      <p className="page-subtitle">{t("ai.subtitle")}</p>
      <ChatPanel />
    </>
  );
}
