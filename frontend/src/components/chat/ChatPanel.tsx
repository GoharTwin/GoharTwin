import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { aiChat } from "../../api/client";
import { useConversations } from "../../hooks/useConversations";
import ChatSidebar from "./ChatSidebar";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatComposer from "./ChatComposer";
import type { ChatAttachment } from "../../types";

interface Props {
  equipmentId?: string;
  embedded?: boolean;
}

export default function ChatPanel({ equipmentId, embedded }: Props) {
  const { t, i18n } = useTranslation();
  const {
    conversations,
    active,
    activeId,
    setActiveId,
    create,
    rename,
    remove,
    appendMessage,
  } = useConversations(equipmentId);
  const [thinking, setThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [active?.messages, thinking]);

  const send = async (text: string, attachments: ChatAttachment[]) => {
    const conversationId =
      activeId && active ? activeId : create(text.slice(0, 40) || t("ai.defaultTitle"));

    appendMessage(conversationId, {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      attachments: attachments.length ? attachments : undefined,
      timestamp: Date.now(),
    });

    const assistantId = crypto.randomUUID();
    setThinking(true);
    try {
      const res = await aiChat(text, i18n.language, equipmentId ?? null);
      appendMessage(conversationId, {
        id: assistantId,
        role: "assistant",
        content: res.message,
        timestamp: Date.now(),
      });
    } catch {
      appendMessage(conversationId, {
        id: assistantId,
        role: "assistant",
        content: t("common.backendOffline"),
        timestamp: Date.now(),
      });
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className={`chat-shell${embedded ? " embedded" : ""}`}>
      {!embedded && (
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onCreate={() => create(t("ai.defaultTitle"))}
          onRename={rename}
          onDelete={remove}
        />
      )}

      <section className="panel chat-main">
        <div className="chat-header">
          <span className="chat-title">
            {active?.title ?? t("ai.title")}
            {equipmentId && (
              <span className="mono" style={{ color: "var(--gold)", marginInlineStart: "0.5rem" }}>
                [{equipmentId.toUpperCase()}]
              </span>
            )}
          </span>
          <div className="ai-not-connected-banner">{t("ai.notConnected")} — {t("ai.notConnectedDesc")}</div>
        </div>

        <div className="chat-messages" ref={messagesRef}>
          {!active || active.messages.length === 0 ? (
            <div className="empty-state">
              <h3 style={{ marginBottom: "0.5rem" }}>{t("ai.emptyTitle")}</h3>
              <p>{equipmentId ? t("equipment.aiScoped") : t("ai.emptyDesc")}</p>
            </div>
          ) : (
            active.messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} streaming={false} />
            ))
          )}
          {thinking && (
            <div className="typing-indicator">
              <span className="typing-dots"><span /><span /><span /></span>
              {t("ai.thinking")}
            </div>
          )}
        </div>

        <ChatComposer disabled={thinking} onSend={send} />
      </section>
    </div>
  );
}
